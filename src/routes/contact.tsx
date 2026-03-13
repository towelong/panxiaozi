import { createFileRoute } from "@tanstack/react-router";
import { ImagePreview } from "#/components/ImagePreview";

export const Route = createFileRoute("/contact")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-[65vh] w-full flex flex-col items-center px-4 py-12">
			<h1 className="text-3xl font-bold mb-8 text-center">联系我们</h1>
			<div className="prose prose-lg mx-auto">
				<p className="mb-4">
					盘小子致力于打造一站式网盘资源搜索平台。我们仅提供搜索服务，不存储、上传或分发任何网盘内容。
				</p>

				<p className="mb-4">
					所有资源均来自第三方网盘，请用户自行判断资源的真实性与安全性。
				</p>

				<p className="mb-4">本站秉承非营利原则运营，完全免费使用。</p>

				<p className="mb-4">
					如发现任何侵权内容，请发送邮件至{" "}
					<a
						href="mailto:i@xiaozi.cc"
						className="text-blue-600 hover:text-blue-800"
					>
						i@xiaozi.cc
					</a>
					，我们将及时处理。
				</p>
				<p className="flex justify-center items-center">
					<ImagePreview src="/wechat.jpg" alt="小付同学的开发日常" />
				</p>
			</div>
		</div>
	);
}
