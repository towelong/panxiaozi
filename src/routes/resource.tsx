import {
	IconChevronLeft,
	IconChevronRight,
	IconSearch,
	IconX,
} from "@tabler/icons-react";
import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useRouterState,
} from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import type { Category } from "#/db/schema";
import {
	buildCanonicalUrl,
	buildSeoTitle,
	NETDISK_TITLE_FILLERS,
} from "#/lib/seo";
import { cn } from "#/lib/utils";
import { getResourcePageListServer } from "#/server/resource";
import { formatTime } from "#/utils/time";

function validateSearch(search: Record<string, unknown>): {
	q?: string;
	category?: string;
	page?: number;
} {
	const q = typeof search.q === "string" ? search.q : undefined;
	const category =
		typeof search.category === "string" ? search.category : undefined;
	const pageStr = typeof search.page === "string" ? search.page : undefined;
	const page = pageStr ? Math.max(1, Number(pageStr) || 1) : undefined;
	return { q, category, page };
}

export const Route = createFileRoute("/resource")({
	validateSearch,
	loaderDeps: ({ search }) => search,
	loader: async ({ deps: search }) => {
		const pageSize = 10;
		const requestedPage = search.page ?? 1;

		const { categories, resources } = await getResourcePageListServer({
			data: {
				page: requestedPage,
				pageSize,
				q: search.q,
				category: search.category,
			},
		});

		const totalPages = Math.max(1, Math.ceil(resources.total / pageSize));
		if (requestedPage > totalPages) {
			throw redirect({
				to: "/resource",
				search: { ...search, page: totalPages },
				replace: true,
			});
		}

		return {
			categories,
			pageSize,
			page: requestedPage,
			total: resources.total,
			resources: resources.list,
			totalPages,
			q: search.q,
			category: search.category,
		};
	},
	head: ({ loaderData, match, matches }) => {
		const isResourceDetail = matches.some(
			// @ts-ignore
			(currentMatch) => currentMatch.routeId === "/resource/$rid",
		);
		if (isResourceDetail) {
			return {};
		}

		const query = match.search.q?.trim();
		const category = match.search.category;
		const currentPage = match.search.page ?? 1;
		const totalPages = loaderData?.totalPages ?? 1;
		const categoryLabel =
			category && loaderData?.categories
				? getCategoryLabel(loaderData.categories, category)
				: "全部";
		const titlePrefix = query
			? `“${query}”搜索结果`
			: category && category !== "all"
				? `${categoryLabel}资源列表`
				: "网盘资源列表";
		const title = buildSeoTitle(
			currentPage > 1 ? `${titlePrefix}_第${currentPage}页` : titlePrefix,
			NETDISK_TITLE_FILLERS,
		);
		const description = query
			? `盘小子为你展示与“${query}”相关的夸克网盘、百度网盘、阿里云盘资源，支持分类筛选与分页浏览。`
			: `浏览盘小子的网盘资源列表，支持按分类筛选并查看夸克网盘、百度网盘、阿里云盘最新更新内容。`;
		const robots = "index, follow";

		const buildPageHref = (page: number) => {
			return buildCanonicalUrl(match.pathname, {
				...match.search,
				page: page > 1 ? page : undefined,
			});
		};

		const canonicalHref = buildCanonicalUrl(match.pathname, match.search);
		const links: Record<string, string>[] = [
			{
				rel: "canonical",
				href: canonicalHref,
			},
		];
		if (currentPage > 1) {
			links.push({ rel: "prev", href: buildPageHref(currentPage - 1) });
		}
		if (currentPage < totalPages) {
			links.push({ rel: "next", href: buildPageHref(currentPage + 1) });
		}

		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ name: "robots", content: robots },
				{ property: "og:type", content: "website" },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:url", content: canonicalHref },
			],
			links,
		};
	},
	component: RouteComponent,
	staleTime: 60 * 1000,
	gcTime: 5 * 60 * 1000,
});

type PaginationItem = number | "ellipsis";

function getPaginationItems(
	currentPage: number,
	totalPages: number,
): PaginationItem[] {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const items: PaginationItem[] = [];
	const push = (item: PaginationItem) => items.push(item);

	push(1);

	const left = Math.max(2, currentPage - 1);
	const right = Math.min(totalPages - 1, currentPage + 1);

	if (left > 2) push("ellipsis");
	for (let p = left; p <= right; p++) push(p);
	if (right < totalPages - 1) push("ellipsis");

	push(totalPages);
	return items;
}

function getCategoryLabel(categories: Category[], key: string) {
	if (!key) return "全部";
	return categories.find((c) => c.key === key)?.name ?? key;
}

function RouteComponent() {
	const search = Route.useSearch();
	const data = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const isDetail = useRouterState({
		select: (s) => s.matches.some((m) => m.routeId === "/resource/$rid"),
	});
	const [keyword, setKeyword] = useState(search.q ?? "");

	useEffect(() => {
		setKeyword(search.q ?? "");
	}, [search.q]);

	const submitSearch = useCallback(
		(query: string) => {
			navigate({
				to: "/resource",
				search: { ...search, q: query || undefined, page: 1 },
			});
		},
		[navigate, search],
	);

	const paginationItems = useMemo(
		() => getPaginationItems(data.page, data.totalPages),
		[data.page, data.totalPages],
	);

	const activeCategoryLabel = useMemo(
		() => getCategoryLabel(data.categories, search.category ?? ""),
		[data.categories, search.category],
	);

	if (isDetail) {
		return <Outlet />;
	}

	return (
		<div className="container mx-auto px-4 py-6 md:px-0 text-base">
			<div className="flex flex-col gap-4 mb-4">
				<div className="flex items-center justify-between gap-4 flex-wrap">
					<h1 className="text-xl font-bold">
						{search.q ? `“${search.q}” 相关资源` : "资源列表"}
					</h1>
					<div className="text-sm text-muted-foreground">
						{activeCategoryLabel}
						{search.q ? (
							<>
								<span className="mx-2">·</span>
								<span className="break-all">“{search.q}”</span>
							</>
						) : null}
						<span className="mx-2">·</span>
						<span>共 {data.total} 条</span>
					</div>
				</div>
				<form
					role="search"
					aria-label="资源列表搜索"
					className="flex items-center"
					onSubmit={(e) => {
						e.preventDefault();
						submitSearch(keyword.trim());
					}}
				>
					<label htmlFor="resource-search-input" className="sr-only">
						资源关键词
					</label>
					<div className="relative flex-1">
						<Input
							id="resource-search-input"
							name="q"
							value={keyword}
							placeholder="请输入关键词搜索"
							className="h-10 pl-9 pr-10"
							onChange={(e) => {
								setKeyword(e.target.value);
							}}
						/>
						<div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
							<IconSearch className="h-4 w-4" />
						</div>
						{keyword && (
							<button
								type="button"
								onClick={() => {
									setKeyword("");
									submitSearch("");
								}}
								className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted/80"
								aria-label="清空"
							>
								<IconX className="h-4 w-4" />
							</button>
						)}
					</div>
					<Button type="submit">搜索</Button>
				</form>
			</div>

			<Card className="mb-6">
				<CardContent>
					<div className="flex flex-wrap items-center gap-2">
						{data.categories.map((c) => (
							<Link
								key={c.key}
								to="/resource"
								search={{
									...search,
									category: c.key === "all" ? undefined : c.key,
									page: 1,
								}}
								className={cn(
									"px-3 py-1 rounded-full text-sm border hover:bg-primary hover:text-primary-foreground transition-colors",
									(search.category ?? "all") === c.key
										? "bg-primary text-primary-foreground border-primary"
										: "bg-background text-foreground border-border",
								)}
							>
								{c.name}
							</Link>
						))}
					</div>
				</CardContent>
			</Card>

			<div className="space-y-3">
				{data.resources.length === 0 ? (
					<Card>
						<CardContent>
							<div className="text-sm text-muted-foreground py-8 text-center">
								暂无数据
							</div>
						</CardContent>
					</Card>
				) : (
					data.resources.map((r) => (
						<Card key={r.id} size="sm">
							<article>
								<CardContent className="py-1">
									<div className="flex items-start gap-4">
										{r.cover ? (
											<img
												src={r.cover}
												alt={r.title}
												className="w-28 h-42 md:w-40 md:h-56  object-cover rounded-md border bg-muted shrink-0"
												loading="lazy"
											/>
										) : null}
										<div className="min-w-0 flex-1 flex flex-col justify-between">
											<div className="flex items-center justify-between gap-2">
												<h2 className="font-semibold text-base line-clamp-1">
													<Link
														to="/resource/$rid"
														params={{ rid: r.pinyin }}
														search={{
															q: undefined,
															category: undefined,
															page: undefined,
														}}
														className="hover:text-primary hover:underline"
													>
														{r.title}
													</Link>
												</h2>
												<span className="text-xs text-muted-foreground shrink-0">
													{formatTime(
														r.updatedAt?.toISOString() || "",
														"YYYY-MM-DD",
													)}
												</span>
											</div>

											<div className="text-sm text-muted-foreground line-clamp-4 leading-relaxed mt-1">
												{r.desc}
											</div>

											<div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
												<Link
													to="/resource"
													search={{
														...search,
														category: r.categoryKey,
														page: 1,
													}}
													className="px-2 py-0.5 rounded-full border bg-background hover:bg-muted transition-colors"
												>
													{getCategoryLabel(data.categories, r.categoryKey)}
												</Link>
												<span className="px-2 py-0.5 rounded-full border bg-background">
													{r.diskType}
												</span>
											</div>
										</div>
									</div>
								</CardContent>
							</article>
						</Card>
					))
				)}
			</div>

			{data.total > data.pageSize ? (
				<div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
					<Link
						to="/resource"
						search={{ ...search, page: Math.max(1, data.page - 1) }}
						className={cn(
							"inline-flex items-center gap-1 px-3 h-9 rounded-md border text-sm",
							data.page <= 1
								? "pointer-events-none opacity-50"
								: "hover:bg-muted",
						)}
						aria-disabled={data.page <= 1}
					>
						<IconChevronLeft className="h-4 w-4" />
						上一页
					</Link>

					{paginationItems.map((item, idx) =>
						item === "ellipsis" ? (
							<span key={idx} className="px-2 text-muted-foreground">
								…
							</span>
						) : (
							<Link
								key={idx}
								to="/resource"
								search={{ ...search, page: item }}
								className={cn(
									"inline-flex items-center justify-center rounded-md border text-sm px-3 py-1 h-9 hover:bg-muted",
									item === data.page
										? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
										: "bg-background",
								)}
							>
								{item}
							</Link>
						),
					)}

					<Link
						to="/resource"
						search={{
							...search,
							page: Math.min(data.totalPages, data.page + 1),
						}}
						className={cn(
							"inline-flex items-center gap-1 px-3 h-9 rounded-md border text-sm",
							data.page >= data.totalPages
								? "pointer-events-none opacity-50"
								: "hover:bg-muted",
						)}
						aria-disabled={data.page >= data.totalPages}
					>
						下一页
						<IconChevronRight className="h-4 w-4" />
					</Link>
				</div>
			) : null}
		</div>
	);
}
