import { IconSearch } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/components/ui/input-group";
import { SITE_URL, serializeJsonLd } from "#/lib/seo";
import type { HomeMovie } from "#/types";
import { getHomeMoviesServer, getHotResourceServer } from "@/server/resource";

const landingHighlights = [
	{
		title: "集中查看关键信息",
		description:
			"搜索结果同时展示资源标题、分类、更新时间和网盘类型，便于先核对再打开详情。",
	},
	{
		title: "覆盖常见网盘来源",
		description:
			"聚合夸克网盘、百度网盘等第三方公开分享信息，减少在多个平台之间重复查找。",
	},
	{
		title: "明确更新时间",
		description:
			"详情页标注信息更新时间，并提供问题反馈渠道；第三方链接仍可能因分享方调整而失效。",
	},
];

const editorialPrinciples = [
	{
		title: "收录范围",
		description:
			"本站索引第三方网盘公开分享的标题、分类与链接信息，不存储、上传或分发网盘文件本身。",
	},
	{
		title: "结果排序",
		description:
			"结果主要依据关键词相关性、资源更新时间与站内热度呈现，不承诺第三方内容始终可用。",
	},
	{
		title: "内容处理",
		description:
			"发现失效、描述不准确或涉嫌侵权的条目，可以通过联系页反馈，我们会核查并处理索引信息。",
	},
];

const quickSteps = [
	{
		title: "输入关键词",
		description: "在首页搜索框中输入你要找的主题。",
	},
	{
		title: "缩小范围",
		description: "通过分类、年份、季数或文件类型等限定词减少无关结果。",
	},
	{
		title: "核对详情",
		description:
			"打开详情页检查描述、更新时间和网盘来源，再决定是否访问第三方链接。",
	},
];

const faqItems = [
	{
		question: "盘小子的资源是怎么来的？",
		answer:
			"盘小子聚合第三方网盘的公开分享信息，只索引标题、分类、描述、更新时间和链接等元数据，不存储或上传网盘文件。",
	},
	{
		question: "搜索不到我想要的内容怎么办？",
		answer:
			"你可以尝试更换同义词、缩短关键词，或先从热门搜索中选择相关方向再逐步细化。",
	},
	{
		question: "为什么链接有时会失效？",
		answer:
			"资源链接由第三方分享者和网盘平台管理，可能被取消、过期或调整权限。详情页的更新时间仅代表本站信息更新时间，不等于永久有效。",
	},
	{
		question: "是否支持移动端使用？",
		answer: "支持，页面已适配移动端和桌面端，方便你在不同设备上快速搜索。",
	},
	{
		question: "盘小子会保存或分发文件吗？",
		answer:
			"不会。本站提供公开分享信息的搜索与导航，不托管文件，也不参与第三方网盘文件的上传和分发。",
	},
	{
		question: "搜索关键词有推荐写法吗？",
		answer:
			"建议优先使用核心名词，例如“AI 提示词”“设计素材包”，再逐步叠加限定词提升准确度。",
	},
	{
		question: "搜索结果如何排序？",
		answer:
			"结果会综合关键词匹配、更新时间和站内热度呈现。排序用于帮助筛选，不代表对第三方内容质量、版权或安全性的担保。",
	},
	{
		question: "访问第三方链接前需要注意什么？",
		answer:
			"请核对域名和分享信息，不要在陌生页面输入网盘之外的账号密码，不运行来源不明的程序，并确认使用内容符合当地法律与平台规则。",
	},
	{
		question: "如何反馈失效、错误或侵权内容？",
		answer:
			"请通过联系我们页面发送具体资源地址和问题说明。对于可核实的失效、错误或侵权索引，我们会及时处理。",
	},
];

export const Route = createFileRoute("/")({
	loader: async () => {
		const [hotResources, homeMovies] = await Promise.all([
			getHotResourceServer(),
			getHomeMoviesServer(),
		]);
		return { ...hotResources, movies: homeMovies.movies };
	},
	staleTime: 5 * 60 * 1000,
	gcTime: 5 * 60 * 1000,
	head: () => {
		const title = "盘小子 - 网盘资源搜索与发现";
		const description =
			"聚合检索夸克网盘、百度网盘等公开分享信息，查看资源分类、更新时间与网盘来源，并通过搜索技巧更快定位所需内容。";
		const structuredData = {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "Organization",
					"@id": `${SITE_URL}/#organization`,
					name: "盘小子",
					url: SITE_URL,
					logo: `${SITE_URL}/logo.webp`,
					contactPoint: {
						"@type": "ContactPoint",
						contactType: "content and copyright inquiries",
						email: "i@xiaozi.cc",
						availableLanguage: "zh-CN",
					},
				},
				{
					"@type": "WebSite",
					"@id": `${SITE_URL}/#website`,
					url: SITE_URL,
					name: "盘小子",
					description,
					inLanguage: "zh-CN",
					publisher: { "@id": `${SITE_URL}/#organization` },
					potentialAction: {
						"@type": "SearchAction",
						target: {
							"@type": "EntryPoint",
							urlTemplate: `${SITE_URL}/resource?q={search_term_string}`,
						},
						"query-input": "required name=search_term_string",
					},
				},
				{
					"@type": "FAQPage",
					"@id": `${SITE_URL}/#faq`,
					mainEntity: faqItems.map((item) => ({
						"@type": "Question",
						name: item.question,
						acceptedAnswer: {
							"@type": "Answer",
							text: item.answer,
						},
					})),
				},
			],
		};

		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ name: "robots", content: "index, follow" },
				{ property: "og:type", content: "website" },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:url", content: SITE_URL },
				{ property: "og:image", content: `${SITE_URL}/og.png` },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
				{ name: "twitter:image", content: `${SITE_URL}/og.png` },
			],
			links: [{ rel: "canonical", href: SITE_URL }],
			scripts: [
				{
					type: "application/ld+json",
					children: serializeJsonLd(structuredData),
				},
			],
		};
	},
	component: App,
});

function App() {
	const [keyword, setKeyword] = useState("");
	const navigate = Route.useNavigate();

	const data = Route.useLoaderData();

	return (
		<main className="bg-blue-50 dark:bg-blue-900/10 py-12 px-4 md:px-0 flex justify-center">
			<div className="container grid grid-cols-1 gap-8 items-center">
				<header className="space-y-4 text-center">
					<h1 className="text-2xl md:text-3xl font-bold">网盘资源搜索与发现</h1>
					<p className="text-sm text-gray-700 dark:text-muted-foreground">
						聚合夸克网盘、百度网盘等公开分享信息，先查看分类、更新时间和网盘来源，再访问第三方链接。
					</p>
					<p className="text-sm text-gray-700 dark:text-muted-foreground">
						已收录 <strong className="text-primary">{data.count}</strong>{" "}
						条资源索引
					</p>
				</header>

				<section aria-labelledby="search-heading" className="space-y-3">
					<h2 id="search-heading" className="sr-only">
						站内搜索
					</h2>
					<form
						role="search"
						aria-label="网盘资源搜索"
						className="flex items-center"
						onSubmit={(e) => {
							e.preventDefault();
							const query = keyword.trim();
							navigate({
								to: "/resource",
								search: {
									q: query,
								},
							});
						}}
					>
						<label htmlFor="home-search-input" className="sr-only">
							请输入关键词搜索
						</label>
						<InputGroup>
							<InputGroupAddon align="inline-start">
								<IconSearch />
							</InputGroupAddon>
							<InputGroupInput
								id="home-search-input"
								name="q"
								value={keyword}
								onChange={(e) => setKeyword(e.target.value)}
								placeholder="请输入关键词搜索"
							/>
						</InputGroup>
						<Button type="submit">搜索</Button>
					</form>
				</section>

				<section aria-labelledby="hot-search-heading">
					<Card className="h-full">
						<CardContent className="h-full">
							<div className="flex items-center justify-between mb-4">
								<h2 id="hot-search-heading" className="font-bold">
									热门搜索
								</h2>
							</div>
							<ul className="grid grid-cols-2 gap-x-4 gap-y-3">
								{data.hotResources.map((item, index) => (
									<li key={item}>
										<Link
											to="/resource"
											search={{ q: item }}
											title={item}
											className="flex items-center gap-2 group"
										>
											<span className="text-xs block text-orange-500 font-bold min-w-4">
												{index + 1}
											</span>
											<span className="text-sm group-hover:text-primary text-gray-700 dark:text-muted-foreground line-clamp-1">
												{item}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</section>

				{data.movies && data.movies.length > 0 && (
					<section aria-labelledby="poster-wall-heading" className="space-y-3">
						<h2
							id="poster-wall-heading"
							className="text-xl font-bold text-center"
						>
							热门影视
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
							{data.movies.map((movie: HomeMovie) => (
								<Link
									key={movie.id}
									to="/resource"
									search={{ q: movie.title }}
									className="group block bg-white dark:bg-[#333] shadow"
								>
									<div className="h-full overflow-hidden group-hover:ring-2 group-hover:ring-primary/50 transition-all">
										<div className="aspect-[2/3] overflow-hidden">
											<img
												src={movie.poster}
												alt={movie.title}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												loading="lazy"
											/>
										</div>
										<div className="p-3">
											<h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
												{movie.title}
											</h3>
											<div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
												{movie.rating > 0 && (
													<span className="text-orange-500 font-medium">
														{movie.rating}
													</span>
												)}
												<span>{movie.year}</span>
												<span className="px-1.5 py-0.5 rounded-full border text-[10px]">
													{movie.type}
												</span>
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					</section>
				)}

				<section aria-labelledby="why-heading" className="space-y-6">
					<h2 id="why-heading" className="text-xl font-bold text-center">
						搜索结果提供哪些信息
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
						{landingHighlights.map((item) => (
							<Card key={item.title}>
								<CardContent className="pt-2">
									<h3 className="font-semibold mb-2">{item.title}</h3>
									<p className="text-sm text-gray-600 dark:text-muted-foreground leading-6">
										{item.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section aria-labelledby="principles-heading" className="space-y-6">
					<div className="text-center space-y-2">
						<h2 id="principles-heading" className="text-xl font-bold">
							收录、排序与内容处理原则
						</h2>
						<p className="text-sm text-gray-600 dark:text-muted-foreground">
							了解结果从哪里来、如何呈现，以及遇到问题时怎样反馈。
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{editorialPrinciples.map((item) => (
							<Card key={item.title}>
								<CardContent className="pt-2">
									<h3 className="font-semibold mb-2">{item.title}</h3>
									<p className="text-sm text-gray-600 dark:text-muted-foreground leading-6">
										{item.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
					<p className="text-center text-sm text-muted-foreground">
						<Link to="/about" className="text-primary hover:underline">
							查看完整收录说明
						</Link>
						<span className="mx-2">·</span>
						<Link to="/guide" className="text-primary hover:underline">
							阅读搜索与安全指南
						</Link>
					</p>
				</section>

				<section aria-labelledby="steps-heading" className="space-y-6">
					<h2 id="steps-heading" className="text-xl font-bold text-center mt-2">
						3 步快速上手
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{quickSteps.map((step, index) => (
							<Card key={step.title}>
								<CardContent className="pt-6 space-y-2">
									<span className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
										{index + 1}
									</span>
									<h3 className="font-semibold">{step.title}</h3>
									<p className="text-sm text-gray-600 dark:text-muted-foreground leading-6">
										{step.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section aria-labelledby="faq-heading" className="space-y-6">
					<h2 id="faq-heading" className="text-xl font-bold text-center mt-2">
						常见问题 FAQ
					</h2>
					<Accordion
						type="single"
						collapsible
						className="mx-auto w-full max-w-3xl rounded-lg border bg-card px-4"
					>
						{faqItems.map((item, index) => (
							<AccordionItem key={item.question} value={`faq-${index}`}>
								<AccordionTrigger className="text-base hover:no-underline">
									{item.question}
								</AccordionTrigger>
								<AccordionContent className="text-gray-600 dark:text-muted-foreground leading-6">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</section>

				<section aria-labelledby="cta-heading">
					<Card className="border-primary/20 bg-gradient-to-r from-blue-100/80 to-sky-100/80 dark:from-blue-900/30 dark:to-sky-900/20">
						<CardContent className="py-8 text-center space-y-4">
							<h2 id="cta-heading" className="text-2xl font-bold">
								开始下一次高效搜索
							</h2>
							<p className="text-sm text-gray-700 dark:text-muted-foreground">
								现在就搜索你的关键词，快速找到更有价值的资源。
							</p>
							<div className="flex items-center justify-center gap-3">
								<Button
									onClick={() =>
										navigate({
											to: "/resource",
										})
									}
								>
									立即搜索
								</Button>
								<Button variant="outline" asChild>
									<Link to="/resource">查看全部资源</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</section>
			</div>
		</main>
	);
}
