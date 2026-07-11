import { and, count, desc, eq, like, ne } from "drizzle-orm";
import { env } from "#/env";
import { logger } from "#/utils/logger";
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
		list = result.data.map((item: { title: string }) => item.title);
		if (list.length > 10) {
			list = list.slice(0, 10);
		}
		if (list.length === 0) {
			throw new Error("获取热门资源失败");
		}
	} catch (error) {
		logger.error("获取热门资源失败", error);
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

function normalizeTitleForSimilarity(rawTitle: string): string {
	return (
		rawTitle
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
			.replace(/\s+/g, " ")
			.trim()
	);
}

export function extractPrimaryTitle(rawTitle: string): string {
	const normalized = rawTitle.replace(/\s+/g, " ").trim();
	if (!normalized) return "";

	// 优先取第一个片段，避免资源描述中的补充信息干扰标题识别
	const firstSegment =
		normalized
			.split(/[\/|｜]/)
			.map((s) => s.trim())
			.find(Boolean) || normalized;

	let text = firstSegment;
	// 去掉前置标签，如【日漫】、[电影]
	text = text.replace(/^(?:[【\[].*?[】\]]\s*)+/, "");
	text = text.replace(/^(日漫|国漫|动漫|电影|电视剧|美剧|韩剧|日剧)\s+/, "");
	// 去掉显式年份括号，如 (2025) / （2011）
	text = text.replace(/[\(\[（【]\s*(19|20)\d{2}[^)\]）】]*[\)\]）】]/g, " ");
	// 去掉集数类括号，如（63集）
	text = text.replace(/[\(\[（【]\s*\d+\s*集[^)\]）】]*[\)\]）】]/g, " ");

	const boundaryRules = [
		/\s+(4k|8k|1080p|720p|2160p)\S*/i,
		/\s+(全集|全\d+集|更\d+集|更新至?\d+集?)(?=\s|$)/,
		/\s+(第?[一二三四五六七八九十百零两\d]+\s*(季|部|集)|\d+\s*季全)(?=\s|$)/,
		/\s+(动画|剧场版|电影|电视剧|国漫|美剧|韩剧|日剧|高码|hdr|杜比)(?=\s|$)/i,
	];

	let cutIndex = text.length;
	for (const rule of boundaryRules) {
		const match = rule.exec(text);
		if (match && typeof match.index === "number") {
			cutIndex = Math.min(cutIndex, match.index);
		}
	}

	text = text.slice(0, cutIndex);
	text = text
		.replace(/[^\p{L}\p{N}\s·:：\-]/gu, " ")
		.replace(/\s+/g, " ")
		.trim();
	// 你要求的规则：中间有空格时按空格切分，只取第一个
	if (text.includes(" ")) {
		text = text.split(/\s+/)[0] || text;
	}

	// 兜底：提取失败时返回原首片段
	if (text.length < 2) {
		return firstSegment
			.replace(/[^\p{L}\p{N}\s·:：\-]/gu, " ")
			.replace(/\s+/g, " ")
			.trim();
	}
	return text;
}

export async function getRelatedResources(
	title: string,
	_categoryKey?: string,
	excludeId?: number,
): Promise<Resource[]> {
	const primaryTitle = extractPrimaryTitle(title);
	const queryTitle = (primaryTitle || title).trim();
	const CANDIDATE_LIMIT = 20;

	// 标题为空或不可用时，兜底返回全站最新资源
	if (!queryTitle) {
		return await db
			.select()
			.from(resource)
			.where(and(excludeId ? ne(resource.id, excludeId) : undefined))
			.orderBy(
				desc(resource.updatedAt),
				desc(resource.hotNum),
				desc(resource.id),
			)
			.limit(10);
	}

	// 全量模糊召回，不按分类优先
	const candidates = await db
		.select()
		.from(resource)
		.where(
			and(
				excludeId ? ne(resource.id, excludeId) : undefined,
				like(resource.title, `%${queryTitle}%`),
			),
		)
		.orderBy(desc(resource.updatedAt), desc(resource.hotNum), desc(resource.id))
		.limit(CANDIDATE_LIMIT);

	// 候选去重
	const dedup = new Map<number, Resource>();
	for (const it of candidates) {
		if (!dedup.has(it.id)) dedup.set(it.id, it);
	}

	// 简单排序：精确匹配 > 前缀匹配 > 包含匹配，再按长度/热度/时间打平
	const scored = Array.from(dedup.values()).map((it) => {
		const candidateTitle = normalizeTitleForSimilarity(it.title);
		const isExact = candidateTitle === queryTitle ? 1 : 0;
		const isPrefix = candidateTitle.startsWith(queryTitle) ? 1 : 0;
		const isIncludes = candidateTitle.includes(queryTitle) ? 1 : 0;
		const lengthGap = Math.abs(
			candidateTitle.length - queryTitle.length,
		);
		const hotScore = it.hotNum || 0;
		const updatedTs = it.updatedAt?.getTime?.() || 0;

		return {
			it,
			isExact,
			isPrefix,
			isIncludes,
			lengthGap,
			hotScore,
			updatedTs,
		};
	});

	scored.sort(
		(a, b) =>
			b.isExact - a.isExact ||
			b.isPrefix - a.isPrefix ||
			b.isIncludes - a.isIncludes ||
			a.lengthGap - b.lengthGap ||
			b.hotScore - a.hotScore ||
			b.updatedTs - a.updatedTs ||
			b.it.id - a.it.id,
	);

	return scored.slice(0, 10).map((s) => s.it);
}
