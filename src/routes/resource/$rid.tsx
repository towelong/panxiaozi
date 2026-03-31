import { IconChevronRight } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { ImagePreview } from "#/components/ImagePreview";
import { Alert, AlertDescription } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import { cn } from "#/lib/utils";
import { getResourceDetailServer, updateResource } from "#/server/resource";
import { formatTime } from "#/utils/time";

const SITE_URL = "https://pan.xiaozi.cc";

const defaultResourceSearch = {
	q: undefined,
	category: undefined,
	page: undefined,
} as const;

/**
 * 根据磁盘类型返回对应的图标
 */
const getDiskTypeIcon = (diskType: string) => {
	switch (diskType?.toLowerCase()) {
		case "百度":
			return (
				<img
					src="/baidu_icon.svg"
					alt="百度"
					width={40}
					height={40}
					className="inline-block"
				/>
			);
		case "夸克":
			return (
				<img
					src="/quark_icon.svg"
					alt="夸克"
					width={80}
					height={80}
					className="inline-block"
				/>
			);
		default:
			return null;
	}
};

export const Route = createFileRoute("/resource/$rid")({
	loader: async ({ params: { rid } }) => {
		const data = await getResourceDetailServer({ data: { pinyin: rid } });
		return data;
	},
	head: ({ loaderData, params }) => {
		const resource = loaderData?.resource;
		const category = loaderData?.category;
		const fallbackCanonical = `${SITE_URL}/resource/${params.rid}`;

		if (!resource) {
			return {
				meta: [
					{ title: "资源不存在 - 盘小子" },
					{
						name: "description",
						content: "当前资源不存在、已下线或链接已失效。",
					},
					{ name: "robots", content: "noindex, nofollow" },
				],
				links: [{ rel: "canonical", href: fallbackCanonical }],
			};
		}

		const canonicalHref = `${SITE_URL}/resource/${resource.pinyin}`;
		const description =
			resource.desc?.trim() ||
			`${resource.title} 网盘资源详情，包含更新时间、分类和可用下载入口。`;
		const breadcrumbSchema = {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "首页",
					item: SITE_URL,
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "资源",
					item: `${SITE_URL}/resource`,
				},
				...(category?.name
					? [
							{
								"@type": "ListItem",
								position: 3,
								name: category.name,
								item: `${SITE_URL}/resource?category=${resource.categoryKey}`,
							},
						]
					: []),
				{
					"@type": "ListItem",
					position: category?.name ? 4 : 3,
					name: resource.title,
					item: canonicalHref,
				},
			],
		};
		const resourceSchema = {
			"@context": "https://schema.org",
			"@type": "CreativeWork",
			name: resource.title,
			description,
			url: canonicalHref,
			inLanguage: "zh-CN",
			dateModified: resource.updatedAt?.toISOString(),
		};

		return {
			meta: [
				{ title: `${resource.title} - 盘小子` },
				{ name: "description", content: description },
				{ name: "robots", content: "index, follow" },
				{ property: "og:type", content: "article" },
				{ property: "og:title", content: `${resource.title} - 盘小子` },
				{ property: "og:description", content: description },
				{ property: "og:url", content: canonicalHref },
				{
					property: "og:image",
					content: resource.cover || `${SITE_URL}/og.png`,
				},
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: `${resource.title} - 盘小子` },
				{ name: "twitter:description", content: description },
				{
					name: "twitter:image",
					content: resource.cover || `${SITE_URL}/og.png`,
				},
			],
			links: [{ rel: "canonical", href: canonicalHref }],
			scripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify(breadcrumbSchema),
				},
				{
					type: "application/ld+json",
					children: JSON.stringify(resourceSchema),
				},
			],
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [text, setText] = useState("");
	const [error, setError] = useState("");
	const [mounted, setMounted] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setMounted(true);
		const ua = navigator.userAgent.toLowerCase();
		setIsMobile(/android|iphone|ipad|ipod|mobile/.test(ua));
	}, []);

	const { resource, category, relatedResources } = Route.useLoaderData();
	if (!resource) {
		return <div>404</div>;
	}

	return (
		<div className="container mx-auto py-6 text-base">
			<nav
				aria-label="面包屑"
				className="flex items-center text-sm text-muted-foreground mb-4 overflow-hidden flex-nowrap px-2 md:px-0"
			>
				<Link to="/" className="hover:underline whitespace-nowrap shrink-0">
					首页
				</Link>
				<IconChevronRight className="h-4 w-4 mx-1" />
				<Link
					to="/resource"
					search={defaultResourceSearch}
					className="hover:underline whitespace-nowrap shrink-0"
				>
					资源
				</Link>
				<IconChevronRight className="h-4 w-4 mx-1" />
				<Link
					to="/resource"
					search={{ q: "", category: resource.categoryKey }}
					className="hover:underline whitespace-nowrap shrink-0"
				>
					{category?.name}
				</Link>
				<IconChevronRight className="h-4 w-4 mx-1" />
				<span className="text-foreground truncate min-w-0 flex-1">
					{resource.title}
				</span>
			</nav>

			<Card>
				<article>
					<CardContent>
						<div className="rounded-lg flex flex-col items-center md:flex-row md:items-start gap-6">
							{resource.cover && (
								<div className="min-w-[160px]">
									<ImagePreview
										src={resource.cover}
										alt={resource.title}
										className="w-[160px] h-auto object-cover rounded-md"
									/>
								</div>
							)}
							<div className="flex-1">
								<h1
									className={cn(
										"text-2xl font-bold mb-6",
										resource.cover ? "text-left" : " text-center",
									)}
								>
									{resource.title}
								</h1>

								<div className="space-y-4">
									<div className="flex flex-col">
										<span className="font-medium mb-2">资源描述:</span>
										<p className="text-muted-foreground break-all md:break-words whitespace-pre-line">
											{resource.desc}
										</p>
									</div>

									<div className="flex items-center">
										<span className="font-medium mr-2">更新时间:</span>
										<span className="text-muted-foreground">
											{formatTime(resource.updatedAt?.toISOString() || "")}
										</span>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</article>
			</Card>
			<Card>
				<CardContent>
					<Alert className="bg-amber-50 border-amber-200">
						<AlertDescription className="text-amber-700">
							<p>
								资源一定要转到夸克网盘方可观看全部 否则只能观看2分钟的试片
								夸克还可以投屏
							</p>
							<p className="mt-4 text-md">
								资源不对的话关注微信公众号「小付同学的开发日常」私信我免费帮找!
							</p>
							<p className="mt-4 text-md">二维码点击可放大查看</p>
							<p>
								<ImagePreview
									src="/wechat.jpg"
									className="w-32 h-32"
									alt="小付同学的开发日常"
								/>
							</p>
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>

			<Card className="shadow-sm">
				<CardContent>
					<div className="flex items-center">
						<span className="text-base md:mr-2 my-2">资源地址:</span>
						<div className="flex flex-col gap-2">
							{resource.diskList.map((item) => {
								const itemDiskIcon = getDiskTypeIcon(item.diskType);
								return (
									<div
										key={item.id}
										className="flex items-center flex-wrap gap-1"
									>
										<span className="text-sm mr-2 flex items-center  dark:invert">
											{itemDiskIcon}
										</span>
										<Dialog>
											<DialogTrigger>
												{mounted && (
													<Button asChild>
														{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
														<h3
															className="bg-primary text-white px-1 py-1"
															onClick={async () => {
																if (item.url) {
																	setText(item.url);
																} else {
																	try {
																		const res = await updateResource({
																			data: {
																				id: item.id,
																				categoryKey: category.key,
																				externalUrl: item.externalUrl,
																			},
																		});
																		setText(res.url);
																	} catch (_) {
																		setError("资源已失效");
																	}
																}
															}}
														>
															点击获取
														</h3>
													</Button>
												)}
											</DialogTrigger>
											<DialogContent aria-describedby={undefined}>
												<DialogHeader>
													<DialogTitle>扫描二维码</DialogTitle>
													<DialogDescription>
														请使用手机扫描二维码访问资源链接
													</DialogDescription>
												</DialogHeader>
												{mounted && (
													<div className="flex w-full flex-col items-center justify-center py-4 space-y-4">
														<div className="p-4 rounded-md">
															{text ? (
																<QRCode
																	className="bg-white p-1"
																	value={text}
																	size={260}
																/>
															) : (
																error || "正在获取中..."
															)}
														</div>
														{isMobile && text && (
															<Button asChild className="w-full">
																<a
																	className="w-full"
																	href={text}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	打开链接
																</a>
															</Button>
														)}
													</div>
												)}
											</DialogContent>
										</Dialog>
									</div>
								);
							})}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="shadow-sm">
				<CardContent>
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">同类资源</h2>
						<Link
							to="/resource"
							search={{
								q: resource.title,
							}}
							className="text-sm text-muted-foreground hover:underline flex items-center"
						>
							更多 <IconChevronRight className="h-4 w-4" />
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						{relatedResources?.map((item, index) => (
							<div key={item.id} className="flex items-center">
								<span className="text-primary font-medium mr-2">
									{index + 1}
								</span>
								<Link
									to="/resource/$rid"
									params={{ rid: item.pinyin }}
									className="hover:text-primary hover:underline truncate"
								>
									{item.title}
								</Link>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
