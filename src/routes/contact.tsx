import { createFileRoute, Link } from "@tanstack/react-router";
import { ImagePreview } from "#/components/ImagePreview";
import { SITE_URL, serializeJsonLd } from "#/lib/seo";

export const Route = createFileRoute("/contact")({
	head: () => {
		const title = "联系我们 - 盘小子";
		const description =
			"盘小子失效链接、错误信息与侵权移除反馈渠道。提交具体页面地址、问题说明和必要证明，帮助我们更快定位并处理索引信息。";
		const canonical = `${SITE_URL}/contact`;
		const structuredData = {
			"@context": "https://schema.org",
			"@type": "ContactPage",
			name: title,
			description,
			url: canonical,
			inLanguage: "zh-CN",
			mainEntity: {
				"@type": "Organization",
				"@id": `${SITE_URL}/#organization`,
				name: "盘小子",
				email: "i@xiaozi.cc",
			},
		};
		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ name: "robots", content: "index, follow" },
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
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="min-h-[65vh] w-full flex flex-col items-center px-4 py-12">
			<h1 className="text-3xl font-bold mb-8 text-center">联系我们</h1>
			<section className="prose prose-lg mx-auto max-w-3xl">
				<p className="mb-4">
					盘小子致力于打造一站式网盘资源搜索平台。我们仅提供搜索服务，不存储、上传或分发任何网盘内容。
				</p>

				<p className="mb-4">
					所有资源均来自第三方网盘，请用户自行判断资源的真实性与安全性。
				</p>

				<p className="mb-4">
					如发现链接失效、标题或描述错误、不当信息或侵权内容，请发送邮件至{" "}
					<a
						href="mailto:i@xiaozi.cc"
						className="text-blue-600 hover:text-blue-800"
					>
						i@xiaozi.cc
					</a>
					。请尽量附上具体页面地址、问题说明；侵权移除请求还应包含权利人身份和必要的权利证明，以便准确定位并核查。
				</p>
				<p className="mb-4">
					你也可以先阅读 <Link to="/about">收录与内容处理说明</Link>
					，了解本站的服务边界与处理原则。
				</p>
				<div className="flex justify-center items-center">
					<ImagePreview
						src="/wechat.jpg"
						alt="小付同学的开发日常微信公众号二维码"
					/>
				</div>
			</section>
		</main>
	);
}
