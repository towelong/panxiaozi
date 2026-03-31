import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { env } from "#/env";
import Footer from "../components/Footer";
import Header from "../components/Header";
import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title:
					"盘小子 - 免费网盘资源搜索引擎 | 夸克网盘 百度网盘 阿里云盘一站式搜索平台",
			},
			{
				name: "description",
				content:
					"盘小子是专业的免费网盘资源搜索引擎，全面支持夸克网盘、百度网盘、阿里云盘等多个主流网盘平台的资源搜索与下载服务。提供快速精准的搜索体验，海量优质资源一键直达，界面简洁美观易用，完全免费且安全无广告无弹窗。立即体验高效便捷的网盘资源搜索服务，轻松快速找到您需要的各类文件、视频、文档等资源内容！",
			},
			{
				name: "keywords",
				content:
					"盘小子,网盘搜索,夸克网盘,百度网盘,阿里云盘,免费资源搜索,网盘资源下载,网盘搜索引擎,云盘搜索,网盘资源,资源分享,文件搜索,网盘聚合",
			},
			{ name: "robots", content: "index, follow" },
			{ name: "author", content: import.meta.env.VITE_SITE_NAME || "盘小子" },
			{
				property: "og:title",
				content:
					"盘小子 - 免费网盘资源搜索引擎 | 夸克网盘 百度网盘 阿里云盘一站式搜索平台",
			},
			{
				property: "og:description",
				content:
					"盘小子是专业的免费网盘资源搜索引擎，全面支持夸克网盘、百度网盘、阿里云盘等多个主流网盘平台的资源搜索与下载服务。提供快速精准的搜索体验，海量优质资源一键直达，界面简洁美观易用，完全免费且安全无广告无弹窗。",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:locale", content: "zh_CN" },
			{ property: "og:site_name", content: "盘小子" },
			{ property: "og:url", content: "https://pan.xiaozi.cc" },
			{ property: "og:image", content: "https://pan.xiaozi.cc/og.png" },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:site", content: "https://pan.xiaozi.cc" },
			{ name: "twitter:creator", content: "@towelong" },
			{
				name: "twitter:title",
				content:
					"盘小子 - 免费网盘资源搜索引擎 | 夸克网盘 百度网盘 阿里云盘一站式搜索平台",
			},
			{
				name: "twitter:description",
				content:
					"盘小子是专业的免费网盘资源搜索引擎，全面支持夸克网盘、百度网盘、阿里云盘等多个主流网盘平台的资源搜索与下载服务。提供快速精准的搜索体验，海量优质资源一键直达，界面简洁美观易用，完全免费且安全无广告无弹窗。",
			},
			{ name: "twitter:image", content: "https://pan.xiaozi.cc/og.png" },
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{ rel: "icon", href: "/favicon.ico" },
			{ rel: "apple-touch-icon", href: "/icons/icon-192x192.png" },
			{ rel: "manifest", href: "/manifest.json" },
		],
		scripts: [
			{
				children: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "um9zi4nqme");`,
				type: "text/javascript",
			},
		],
	}),
	notFoundComponent: () => <div>Not Found</div>,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="zh-CN" suppressHydrationWarning>
			<head>
				{/** biome-ignore lint/security/noDangerouslySetInnerHtml: We control this script */}
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				{env.VITE_UMAMI_API && env.VITE_UMAMI_ID && (
					<script
						defer
						src={env.VITE_UMAMI_API}
						data-website-id={env.VITE_UMAMI_ID}
					/>
				)}
				<HeadContent />
			</head>
			<body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
				<Header />
				{children}
				<Footer />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
