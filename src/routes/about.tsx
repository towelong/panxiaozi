import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "#/components/ui/card";
import { SITE_URL, serializeJsonLd } from "#/lib/seo";

const principles = [
	{
		title: "只索引公开分享信息",
		description:
			"盘小子记录资源标题、描述、分类、更新时间、网盘类型和第三方链接等元数据，不存储、上传或分发网盘文件。",
	},
	{
		title: "用相关性与新鲜度帮助筛选",
		description:
			"搜索结果主要依据关键词匹配、更新时间和站内热度呈现。排序是检索辅助，不构成对第三方内容的推荐或担保。",
	},
	{
		title: "接受失效与侵权反馈",
		description:
			"第三方分享可能被取消、过期或修改。收到包含具体页面地址的问题反馈后，我们会核查对应索引并作出处理。",
	},
];

export const Route = createFileRoute("/about")({
	head: () => {
		const title = "关于盘小子：收录、排序与内容处理说明";
		const description =
			"了解盘小子收录哪些公开分享信息、搜索结果如何排序、更新时间代表什么，以及失效、错误和侵权内容的反馈处理方式。";
		const canonical = `${SITE_URL}/about`;
		const structuredData = {
			"@context": "https://schema.org",
			"@type": "AboutPage",
			name: title,
			description,
			url: canonical,
			inLanguage: "zh-CN",
			dateModified: "2026-07-14",
			mainEntity: {
				"@type": "Organization",
				"@id": `${SITE_URL}/#organization`,
				name: "盘小子",
				url: SITE_URL,
				email: "i@xiaozi.cc",
			},
		};

		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{
					name: "robots",
					content: "index, follow, max-snippet:-1, max-image-preview:large",
				},
				{ property: "og:type", content: "website" },
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
	component: AboutPage,
});

function AboutPage() {
	return (
		<main className="container mx-auto max-w-5xl px-4 py-12 md:px-0">
			<header className="mx-auto max-w-3xl text-center">
				<p className="text-sm font-medium text-primary">关于盘小子</p>
				<h1 className="mt-3 text-3xl font-bold md:text-4xl">
					收录、排序与内容处理说明
				</h1>
				<p className="mt-5 leading-7 text-muted-foreground">
					盘小子是一项网盘公开分享信息的聚合检索服务。我们的目标是让用户先看到标题、分类、更新时间和网盘来源，再决定是否访问第三方页面。
				</p>
				<p className="mt-3 text-xs text-muted-foreground">
					最后更新：2026 年 7 月 14 日
				</p>
			</header>

			<section aria-labelledby="principles" className="mt-12">
				<h2 id="principles" className="text-2xl font-bold">
					基本原则
				</h2>
				<div className="mt-5 grid gap-4 md:grid-cols-3">
					{principles.map((item) => (
						<Card key={item.title}>
							<CardContent className="space-y-3 pt-2">
								<h3 className="font-semibold">{item.title}</h3>
								<p className="text-sm leading-6 text-muted-foreground">
									{item.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<div className="mx-auto mt-12 max-w-3xl space-y-10 leading-7">
				<section aria-labelledby="scope">
					<h2 id="scope" className="text-2xl font-bold">
						收录范围与页面信息
					</h2>
					<p className="mt-4 text-muted-foreground">
						资源详情页通常展示标题、描述、分类、网盘来源和本站最近一次更新该条信息的时间。页面中的链接指向第三方网盘或相关服务，文件是否存在、分享权限和访问要求由对应平台及分享者决定。
					</p>
				</section>

				<section aria-labelledby="ranking">
					<h2 id="ranking" className="text-2xl font-bold">
						搜索与排序逻辑
					</h2>
					<p className="mt-4 text-muted-foreground">
						用户输入关键词后，系统从已收录信息中查找标题匹配的条目，并结合更新时间等信息组织结果。首页热门内容用于反映近期检索或内容趋势，不代表编辑推荐、版权确认或安全认证。
					</p>
				</section>

				<section aria-labelledby="freshness">
					<h2 id="freshness" className="text-2xl font-bold">
						更新时间与链接有效性
					</h2>
					<p className="mt-4 text-muted-foreground">
						“更新时间”表示本站记录最近发生变化的时间，不等于第三方链接的有效期。网盘分享可能随时被取消、迁移或设置新的访问条件。遇到失效链接时，可以尝试搜索同一标题的其他条目或提交反馈。
					</p>
				</section>

				<section aria-labelledby="safety">
					<h2 id="safety" className="text-2xl font-bold">
						安全、版权与责任边界
					</h2>
					<p className="mt-4 text-muted-foreground">
						访问第三方页面前，请核对域名，不要提交与网盘访问无关的账号密码，也不要运行来源不明的程序。用户应自行确认内容来源、授权情况和使用方式符合适用法律及平台规则。盘小子不控制第三方文件，也无法保证其真实性、完整性或持续可用性。
					</p>
				</section>

				<section aria-labelledby="feedback">
					<h2 id="feedback" className="text-2xl font-bold">
						反馈与移除请求
					</h2>
					<p className="mt-4 text-muted-foreground">
						如发现链接失效、标题或描述错误、页面包含不当信息，或需要提交侵权移除请求，请提供具体页面地址、问题说明和必要的权利证明。联系邮箱为
						i@xiaozi.cc。
					</p>
				</section>
			</div>

			<nav
				aria-label="相关页面"
				className="mt-12 flex flex-wrap justify-center gap-3"
			>
				<Link
					to="/guide"
					className="rounded-md border px-4 py-2 hover:bg-muted"
				>
					阅读搜索与安全指南
				</Link>
				<Link
					to="/contact"
					className="rounded-md border px-4 py-2 hover:bg-muted"
				>
					联系我们
				</Link>
				<Link
					to="/resource"
					className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
				>
					浏览资源
				</Link>
			</nav>
		</main>
	);
}
