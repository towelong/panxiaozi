import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "#/components/ui/card";
import { SITE_URL, serializeJsonLd } from "#/lib/seo";

const searchSteps = [
	{
		title: "先输入核心名称",
		description:
			"优先搜索作品名、课程名、软件名或资料主题，先不要加入“网盘”“下载”“资源”等泛化词。",
		example: "示例：流浪地球，而不是 流浪地球网盘资源免费下载",
	},
	{
		title: "再加入一个限定词",
		description:
			"结果过多时加入年份、季数、文件类型、语言或版本；每次只增加一个条件，方便判断哪个词造成了结果变化。",
		example: "示例：流浪地球 2023、Python 教程 PDF、纪录片 4K",
	},
	{
		title: "没有结果就逐步放宽",
		description:
			"删除画质、格式、作者等次要条件，尝试常见简称、原名或同义词，并检查是否存在错别字。",
		example: "示例：把“第二季全集 1080P”缩短为“第二季”",
	},
	{
		title: "打开前核对详情",
		description:
			"比较标题、分类、描述、更新时间和网盘来源。相似标题不一定是同一内容，更新时间也不代表链接永久有效。",
		example: "优先核对内容信息，而不是只看标题中的“高清”“全集”等词",
	},
];

export const Route = createFileRoute("/guide")({
	head: () => {
		const title = "网盘资源搜索指南：关键词技巧与安全检查 - 盘小子";
		const description =
			"学习如何组合网盘搜索关键词、缩小或放宽结果、核对更新时间与网盘来源，并在访问第三方分享链接前完成必要的安全检查。";
		const canonical = `${SITE_URL}/guide`;
		const structuredData = {
			"@context": "https://schema.org",
			"@type": "HowTo",
			name: "如何更准确地搜索和核对网盘资源",
			description,
			inLanguage: "zh-CN",
			dateModified: "2026-07-14",
			step: searchSteps.map((step, index) => ({
				"@type": "HowToStep",
				position: index + 1,
				name: step.title,
				text: `${step.description}${step.example}`,
				url: `${canonical}#step-${index + 1}`,
			})),
		};

		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{
					name: "robots",
					content: "index, follow, max-snippet:-1, max-image-preview:large",
				},
				{ property: "og:type", content: "article" },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:url", content: canonical },
			],
			links: [{ rel: "canonical", href: canonical }],
			scripts: [
				{
					type: "application/ld+json",
					children: serializeJsonLd(structuredData),
				},
			],
		};
	},
	component: GuidePage,
});

function GuidePage() {
	return (
		<main className="container mx-auto max-w-5xl px-4 py-12 md:px-0">
			<header className="mx-auto max-w-3xl text-center">
				<p className="text-sm font-medium text-primary">使用指南</p>
				<h1 className="mt-3 text-3xl font-bold md:text-4xl">
					网盘资源搜索：关键词技巧与安全检查
				</h1>
				<p className="mt-5 leading-7 text-muted-foreground">
					准确搜索的关键不是一次输入很多词，而是从核心名称开始，逐步增加或删除限定条件，并在访问第三方链接前核对页面信息。
				</p>
				<p className="mt-3 text-xs text-muted-foreground">
					最后更新：2026 年 7 月 14 日
				</p>
			</header>

			<section aria-labelledby="search-method" className="mt-12">
				<h2 id="search-method" className="text-2xl font-bold">
					四步搜索法
				</h2>
				<div className="mt-5 grid gap-4 md:grid-cols-2">
					{searchSteps.map((step, index) => (
						<Card id={`step-${index + 1}`} key={step.title}>
							<CardContent className="space-y-3 pt-2">
								<div className="flex items-center gap-3">
									<span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
										{index + 1}
									</span>
									<h3 className="font-semibold">{step.title}</h3>
								</div>
								<p className="text-sm leading-6 text-muted-foreground">
									{step.description}
								</p>
								<p className="rounded-md bg-muted px-3 py-2 text-sm">
									{step.example}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<div className="mx-auto mt-12 max-w-3xl space-y-10 leading-7">
				<section aria-labelledby="query-patterns">
					<h2 id="query-patterns" className="text-2xl font-bold">
						实用关键词组合
					</h2>
					<ul className="mt-4 list-disc space-y-3 pl-6 text-muted-foreground">
						<li>
							影视：作品名 + 年份、季数、语言或画质，例如“沙丘 2024”“某剧
							第二季”。
						</li>
						<li>
							学习资料：主题 + 文件类型或阶段，例如“线性代数 PDF”“英语听力
							初级”。
						</li>
						<li>
							软件与素材：名称 + 系统、版本或格式，例如“Blender 教程”“图标
							SVG”。
						</li>
					</ul>
				</section>

				<section aria-labelledby="result-check">
					<h2 id="result-check" className="text-2xl font-bold">
						如何判断结果是否值得打开
					</h2>
					<p className="mt-4 text-muted-foreground">
						先比较标题是否完整、分类是否合理、描述是否与目标一致，再查看更新时间和网盘类型。标题中的“最新”“高清”“全集”属于分享信息的一部分，不应单独作为真实性判断依据。第三方链接可能要求登录对应网盘，也可能已经失效。
					</p>
				</section>

				<section aria-labelledby="safe-access">
					<h2 id="safe-access" className="text-2xl font-bold">
						访问第三方链接前的安全检查
					</h2>
					<ol className="mt-4 list-decimal space-y-3 pl-6 text-muted-foreground">
						<li>确认浏览器地址栏中的域名属于预期的网盘或服务。</li>
						<li>不要在跳转页输入与网盘访问无关的账号、支付或身份信息。</li>
						<li>下载后先检查文件类型，不运行来源不明的可执行文件或脚本。</li>
						<li>确认内容来源、授权和使用方式符合适用法律及平台规则。</li>
					</ol>
				</section>

				<section aria-labelledby="no-results">
					<h2 id="no-results" className="text-2xl font-bold">
						没有结果或链接失效怎么办
					</h2>
					<p className="mt-4 text-muted-foreground">
						先删除画质、格式等限定词，再尝试简称、原名或同义词；也可以回到分类列表查找相近条目。若详情页信息有误或链接失效，请在反馈中附上具体页面地址，便于定位处理。
					</p>
				</section>
			</div>

			<nav
				aria-label="指南相关页面"
				className="mt-12 flex flex-wrap justify-center gap-3"
			>
				<Link
					to="/about"
					className="rounded-md border px-4 py-2 hover:bg-muted"
				>
					查看收录与排序说明
				</Link>
				<Link
					to="/contact"
					className="rounded-md border px-4 py-2 hover:bg-muted"
				>
					反馈问题
				</Link>
				<Link
					to="/resource"
					className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
				>
					开始搜索
				</Link>
			</nav>
		</main>
	);
}
