import { cn } from "@/lib/utils";

interface MenuItem {
	title: string;
	links: {
		text: string;
		url: string;
	}[];
}

interface FooterProps {
	logo?: {
		url: string;
		src: string;
		alt: string;
		title: string;
	};
	className?: string;
	tagline?: string;
	menuItems?: MenuItem[];
	copyright?: string;
	bottomLinks?: {
		text: string;
		url: string;
	}[];
}

export const Footer = ({
	logo = {
		src: "/logo.webp",
		alt: "盘小子",
		title: "盘小子",
		url: "https://pan.xiaozi.cc",
	},
	className,
	tagline = "盘小子提供第三方网盘公开分享信息的聚合检索，不存储、上传或分发网盘文件。请在访问前核对来源、更新时间与链接域名；如发现失效、错误或侵权索引，请发送邮件至 i@xiaozi.cc。",
	menuItems = [
		{
			title: "快速链接",
			links: [
				{ text: "首页", url: "/" },
				{ text: "资源列表", url: "/resource" },
				{ text: "搜索与安全指南", url: "/guide" },
				{ text: "关于与收录说明", url: "/about" },
				{ text: "联系我们", url: "/contact" },
				{ text: "网站地图", url: "/sitemap.xml" },
				{ text: "LLM 站点说明", url: "/llms.txt" },
			],
		},
		{
			title: "热门网盘",
			links: [
				{ text: "夸克网盘", url: "https://pan.quark.cn" },
				{ text: "阿里云盘", url: "https://www.aliyundrive.com" },
				{ text: "百度网盘", url: "https://pan.baidu.com" },
				{ text: "迅雷云盘", url: "https://pan.xunlei.com" },
			],
		},
		{
			title: "联系我们",
			links: [
				{ text: "微信公众号", url: "/contact" },
				{ text: "邮箱", url: "mailto:i@xiaozi.cc" },
			],
		},
		{
			title: "社媒",
			links: [{ text: "Twitter", url: "https://x.com/towelong" }],
		},
	],
	copyright = "© 2026 盘小子. All rights reserved.",
	bottomLinks = [
		// { text: "Terms and Conditions", url: "#" },
		// { text: "Privacy Policy", url: "#" },
	],
}: FooterProps) => {
	return (
		<section
			className={cn("px-4 py-4 flex justify-center items-center", className)}
		>
			<div className="container">
				<footer className="mt-18">
					<div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
						<div className="col-span-2 mb-8 lg:mb-0">
							<div className="flex items-center gap-2 lg:justify-start">
								<a href={logo.url} className="flex items-center gap-2">
									<img
										src={logo.src}
										alt={logo.alt}
										title={logo.title}
										width={40}
										height={40}
										className="h-10"
									/>
									<p className="text-base">{logo.title}</p>
								</a>
							</div>
							<p className="mt-4 text-sm">{tagline}</p>
						</div>
						{menuItems.map((section, idx) => (
							<div key={idx} className="text-sm">
								<h3 className="mb-4 font-bold">{section.title}</h3>
								<ul className="space-y-4 text-muted-foreground">
									{section.links.map((link) => (
										<li
											key={link.text}
											className="font-medium hover:text-primary"
										>
											<a href={link.url}>{link.text}</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
					<div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
						<p>{copyright}</p>
						<ul className="flex gap-4">
							{bottomLinks.map((link) => (
								<li key={link.text} className="underline hover:text-primary">
									<a href={link.url}>{link.text}</a>
								</li>
							))}
						</ul>
					</div>
				</footer>
			</div>
		</section>
	);
};

export default Footer;
