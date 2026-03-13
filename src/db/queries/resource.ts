import { and, count, desc, eq, like, or } from "drizzle-orm";
import { env } from "#/env";
import type { PageResult } from "@/types";
import { db } from "../index";
import {
	type Resource,
	type ResourceDisk,
	resource,
	resourceDisk,
} from "../schema";

// 获取首页资源信息
export async function getHomeResource(): Promise<Resource[]> {
	return await db
		.select()
		.from(resource)
		.where(eq(resource.isShowHome, 1))
		.orderBy(desc(resource.id));
}

export async function getAllResource(): Promise<Resource[]> {
	return await db.select().from(resource).orderBy(desc(resource.id));
}

export async function getResourceRange(
	start: number,
	end: number,
): Promise<Resource[]> {
	const limit = end - start;
	return await db
		.select()
		.from(resource)
		.orderBy(desc(resource.id))
		.limit(limit)
		.offset(start);
}

export async function getResourceCount(): Promise<number> {
	const [result] = await db.select({ value: count() }).from(resource);
	return result.value;
}

export async function getResourcePageList(
	page = 1,
	pageSize = 10,
	query = "",
	category = "",
): Promise<PageResult<Resource>> {
	const list = await db
		.select()
		.from(resource)
		.where(
			and(
				query !== "" ? like(resource.title, `%${query}%`) : undefined,
				category !== "" ? eq(resource.categoryKey, category) : undefined,
			),
		)
		.orderBy(desc(resource.updatedAt), desc(resource.id))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	const [totalResult] = await db
		.select({ value: count() })
		.from(resource)
		.where(
			and(
				query !== "" ? like(resource.title, `%${query}%`) : undefined,
				category !== "" ? eq(resource.categoryKey, category) : undefined,
			),
		);
	const total = totalResult.value;
	return { list, total };
}

// 获取热门资源的核心逻辑
export async function getHotResourceCore(): Promise<string[]> {
	let list: string[] = [];
	try {
		const url = `${env.HOT_MOVIE_API}`;
		const res = await fetch(url);
		const result = await res.json();
		list = result.data.map((item: { seriesInfo: { name: string } }) => item.seriesInfo.name);
		if (list.length > 10) {
			list = list.slice(0, 10);
		}
		if (list.length === 0) {
			throw new Error("获取热门资源失败");
		}
	} catch (error) {
		console.error(error);
		const result = await db
			.select()
			.from(resource)
			.orderBy(desc(resource.hotNum), desc(resource.id))
			.limit(10);
		list = result.map((item) => item.title);
	}
	return list;
}

export async function saveResource(
	id: number | undefined,
	title: string,
	categoryKey: string,
	url: string,
	pinyin: string,
	desc: string,
	diskType: string,
	hotNum: number,
	isShowHome: number | null,
) {
	if (id) {
		await db
			.update(resource)
			.set({
				title,
				categoryKey,
				url,
				pinyin,
				desc,
				diskType,
				hotNum,
				isShowHome,
			})
			.where(eq(resource.id, id));
	} else {
		await db.insert(resource).values({
			title,
			categoryKey,
			url,
			pinyin,
			desc,
			diskType,
			hotNum,
			isShowHome,
		});
	}
}

export async function deleteResource(id: number) {
	await db.delete(resource).where(eq(resource.id, id));
}

export async function getResourceByPinyin(
	name: string,
): Promise<(Resource & { diskList: ResourceDisk[] }) | null> {
	const list = await db
		.select()
		.from(resource)
		.where(eq(resource.pinyin, name))
		.limit(1);
	if (list.length === 0) {
		return null;
	}
	// 获取资源对应的网盘信息
	const diskList = await db
		.select()
		.from(resourceDisk)
		.where(eq(resourceDisk.resourceId, list[0].id));
	return { ...list[0], diskList };
}

export async function getResourceById(
	id: number,
): Promise<(Resource & { diskList: ResourceDisk[] }) | null> {
	const list = await db
		.select()
		.from(resource)
		.where(eq(resource.id, id))
		.limit(1);
	if (list.length === 0) {
		return null;
	}
	const diskList = await db
		.select()
		.from(resourceDisk)
		.where(eq(resourceDisk.resourceId, list[0].id));
	return { ...list[0], diskList };
}

// 提取标题关键词（去除年份/季/集等冗余信息）
function extractKeywords(rawTitle: string): string[] {
	const lower = rawTitle
		.toLowerCase()
		// 去掉括号内容与中英文括号
		.replace(/[\[\]【】()（）]/g, " ")
		// 去掉季/集/部等标识，如 第1季 / 第10集 / 第2部
		.replace(/第?\s*\d+\s*(季|集|部)/g, " ")
		// 去掉英文季/集标识
		.replace(/\b(season|s)\s*\d+\b/g, " ")
		.replace(/\b(episode|ep)\s*\d+\b/g, " ")
		// 去掉常见年份
		.replace(/\b(19|20)\d{2}\b/g, " ")
		// 去掉常见画质/无关短词
		.replace(
			/\b(4k|8k|1080p|720p|hdr|bluray|webrip|web-dl|x264|x265|hevc)\b/g,
			" ",
		)
		// 归一非法字符为空格（保留字母数字与中文）
		.replace(/[^\p{L}\p{N}]+/gu, " ")
		.trim();

	let tokens = lower.split(/\s+/).filter((t) => t.length >= 2);

	// 去重并限制最多 8 个关键词，避免 SQL 过长
	const seen = new Set<string>();
	tokens = tokens
		.filter((t) => {
			if (seen.has(t)) return false;
			seen.add(t);
			return true;
		})
		.slice(0, 8);

	// 兜底：若没有分词到内容，截取原标题前缀
	if (tokens.length === 0) {
		const prefix = rawTitle.trim().slice(0, 8);
		if (prefix) tokens = [prefix.toLowerCase()];
	}

	return tokens;
}

export async function getRelatedResources(
	title: string,
	categoryKey?: string,
	excludeId?: number,
): Promise<Resource[]> {
	const tokens = extractKeywords(title);

	// 构造 LIKE 条件
	const likeConds = tokens.map((t) => like(resource.title, `%${t}%`));

	// 先按同分类召回更多候选
	const sameCategoryCandidates = await db
		.select()
		.from(resource)
		.where(
			and(
				categoryKey ? eq(resource.categoryKey, categoryKey) : undefined,
				or(...likeConds),
			),
		)
		.orderBy(desc(resource.hotNum), desc(resource.updatedAt), desc(resource.id))
		.limit(50);

	// 若不足，再跨分类补充
	let crossCategoryCandidates: Resource[] = [];
	if (sameCategoryCandidates.length < 20) {
		crossCategoryCandidates = await db
			.select()
			.from(resource)
			.where(and(categoryKey ? undefined : undefined, or(...likeConds)))
			.orderBy(
				desc(resource.hotNum),
				desc(resource.updatedAt),
				desc(resource.id),
			)
			.limit(50);
	}

	// 合并候选并去重
	const all = [...sameCategoryCandidates, ...crossCategoryCandidates];
	const dedup = new Map<number, Resource>();
	for (const it of all) {
		if (excludeId && it.id === excludeId) continue;
		if (!dedup.has(it.id)) dedup.set(it.id, it);
	}

	// 评分：关键词命中数 + 前缀加权 + 同类加权 + 热度/时间微调
	const scored = Array.from(dedup.values()).map((it) => {
		const t = it.title.toLowerCase();
		let score = 0;
		for (const k of tokens) {
			if (t.includes(k)) score += 2;
			if (t.startsWith(k)) score += 1;
		}
		if (categoryKey && it.categoryKey === categoryKey) score += 2;
		// 微调：热度与更新时间（避免严格依赖 DB 排序，保持可读性）
		score += Math.min(3, Math.floor((it.hotNum || 0) / 1000));
		return { it, score };
	});

	scored.sort(
		(a, b) =>
			b.score - a.score ||
			(b.it.updatedAt?.getTime?.() || 0) - (a.it.updatedAt?.getTime?.() || 0),
	);

	return scored.slice(0, 10).map((s) => s.it);
}
