import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { env } from "#/env";
import Footer from "../components/Footer";
import Header from "../components/Header";
import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;
const DEFAULT_TITLE = "盘小子 - 网盘资源搜索与发现";
const DEFAULT_DESCRIPTION =
	"盘小子提供夸克网盘、百度网盘等公开分享资源的聚合检索，展示资源分类、更新时间和网盘来源，帮助用户更快核对并找到所需内容。";

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
				name: "description",
				content: DEFAULT_DESCRIPTION,
			},
			{ name: "author", content: "盘小子" },
			{ name: "theme-color", content: "#ffffff" },
			{ name: "format-detection", content: "telephone=no" },
			{ name: "referrer", content: "strict-origin-when-cross-origin" },
			{
				property: "og:title",
				content: DEFAULT_TITLE,
			},
			{
				property: "og:description",
				content: DEFAULT_DESCRIPTION,
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
				content: DEFAULT_TITLE,
			},
			{
				name: "twitter:description",
				content: DEFAULT_DESCRIPTION,
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
			{
				rel: "alternate",
				type: "text/plain",
				href: "/llms.txt",
				title: "盘小子 LLM 站点说明",
			},
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
	notFoundComponent: NotFound,
	shellComponent: RootDocument,
});

function NotFound() {
	return (
		<main className="container mx-auto min-h-[60vh] px-4 py-16 text-center">
			<title>页面不存在 - 盘小子</title>
			<meta name="robots" content="noindex, follow" />
			<p className="text-sm font-medium text-primary">404</p>
			<h1 className="mt-3 text-3xl font-bold">页面不存在或已被移除</h1>
			<p className="mt-4 text-muted-foreground">
				请检查地址，或返回资源列表继续搜索。
			</p>
			<div className="mt-8 flex justify-center gap-3">
				<Link to="/" className="rounded-md border px-4 py-2 hover:bg-muted">
					返回首页
				</Link>
				<Link
					to="/resource"
					className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
				>
					浏览资源
				</Link>
			</div>
		</main>
	);
}

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
				{import.meta.env.DEV ? (
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
				) : null}
				<Scripts />
			</body>
		</html>
	);
}
