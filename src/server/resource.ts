import { createServerFn } from "@tanstack/react-start";
import { LRUCache } from "lru-cache";
import { getCategoryByKey, getCategoryList } from "#/db/queries/category";
import {
	getRelatedResources,
	getResourceByPinyin,
	getResourcePageList,
} from "#/db/queries/resource";
import {
	getResourceDiskUrl,
	updateResourceDiskUrl,
} from "#/db/queries/resource-disk";
import type { Category, Resource } from "#/db/schema";
import { env } from "#/env";
import { notice } from "#/utils/notice";
import { getHotResourceCore, getResourceCount } from "@/db/queries/resource";

const cache = new LRUCache({ max: 500, ttl: 1000 * 60 * 60 * 6 }); // 6 小时

export const getHotResourceServer = createServerFn().handler(async () => {
	const cacheKey = "hotResources";
	if (cache.get(cacheKey)) {
		return cache.get(cacheKey) as { hotResources: string[]; count: number };
	}
	const hotResources = await getHotResourceCore();
	const count = await getResourceCount();
	cache.set(cacheKey, { hotResources, count });
	return { hotResources, count };
});

export const getResourcePageListServer = createServerFn({ method: "GET" })
	.inputValidator(
		(data: {
			page?: number;
			pageSize?: number;
			q?: string;
			category?: string;
		}) => {
			return {
				page: data.page ?? 1,
				pageSize: data.pageSize ?? 10,
				q: data.q,
				category: data.category,
			};
		},
	)
	.handler(async ({ data }) => {
		const resources = await getResourcePageList(
			data.page,
			data.pageSize,
			data.q,
			data.category,
		);
		const categories = await getCategoryListCache();
		return { resources, categories };
	});

const getCategoryListCache = async () => {
	const key = "categoryList";
	const cacheData = cache.get(key);
	if (cacheData) {
		return cacheData as Category[];
	}
	const categories = await getCategoryList();
	cache.set(key, categories);
	return categories;
};

export const getResourceDetailServer = createServerFn()
	.inputValidator((data: { pinyin: string }) => data)
	.handler(async ({ data }) => {
		const resource = await getResourceByPinyin(data.pinyin);
		if (!resource) {
			return { resource: null, category: null, relatedResources: [] };
		}
		let relatedResources: Resource[] = [];
		if (resource?.title) {
			relatedResources = await getRelatedResources(
				resource.title,
				resource.categoryKey,
				resource.id,
			);
		}
		const category = await getCategoryByKey(resource.categoryKey);
		return { resource, category, relatedResources };
	});

export const getCategoryByKeyServer = createServerFn()
	.inputValidator((data: { key: string }) => data)
	.handler(async ({ data }) => {
		const category = await getCategoryByKey(data.key);
		return category;
	});

// 定义请求锁映射（控制同一id的并发请求）
const transferLocks = new Map<number, Promise<string>>();

const transferCache = new LRUCache({
	max: 1000, // 最多缓存1000个资源的转存结果
	ttl: 1000 * 60 * 10, // 缓存10分钟后自动失效
});

export const updateResource = createServerFn({ method: "POST" })
	.inputValidator(
		(data: { id: number; categoryKey: string; externalUrl: string }) => data,
	)
	.handler(async ({ data }) => {
		const { id, categoryKey, externalUrl } = data;

		// 尝试获取已有转存 URL
		const existingUrl = await getResourceDiskUrl(id);
		if (existingUrl) {
			return {
				message: "获取成功",
				url: existingUrl,
			};
		}

		// 获取分类
		const category = await getCategoryByKey(categoryKey);
		if (!category) {
			throw new Error("分类不存在");
		}

		// 并发控制：检查当前id是否已有正在执行的转存请求
		const existingLock = transferLocks.get(id);
		if (existingLock) {
			// 已有请求在处理，等待其完成并复用结果
			const resultUrl = await existingLock;
			return {
				message: "获取成功",
				url: resultUrl,
			};
		}

		// 无锁则创建新的转存Promise，并加锁
		const transferPromise = (async () => {
			try {
				// 获取分类
				const category = await getCategoryByKey(categoryKey);
				if (!category) {
					throw new Error("分类不存在");
				}

				const quarkApi = env.QUARK_API;
				if (!quarkApi) {
					throw new Error("QUARK_API 未配置");
				}

				// 调用夸克转存 API
				const response = await fetch(`${quarkApi}/transfer`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						share_url: externalUrl,
						save_path: `/${category.name}`,
						gen_passcode: false,
						expire_days: 1,
					}),
				});

				if (!response.ok) {
					const errorText = await response.text();
					await notice(
						`告警：资源磁盘转存失败\nHTTP状态码：${response.status}\n响应体：${errorText}`,
					);
					throw new Error(`转存失败: ${response.status}`);
				}

				const result = await response.json();
				console.log(result);

				if (result.message?.includes("capacity limit")) {
					await notice("告警：资源磁盘容量不足，请及时清理");
				}

				const newUrl = result.share_url;
				if (!newUrl) {
					throw new Error("转存成功但未返回有效 URL");
				}

				// 更新数据库
				await updateResourceDiskUrl(id, newUrl);

				// 存入缓存
				transferCache.set(id, newUrl);

				return newUrl;
			} catch (error) {
				// 出错时释放锁，避免死锁
				transferLocks.delete(id);
				throw error;
			}
		})();

		// 将Promise存入锁映射，供其他并发请求复用
		transferLocks.set(id, transferPromise);

		// 等待转存完成，获取结果
		const newUrl = await transferPromise;

		// 转存完成后释放锁
		transferLocks.delete(id);

		return {
			message: "获取成功",
			url: newUrl,
		};
	});
