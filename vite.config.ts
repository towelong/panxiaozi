import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	plugins: [
		devtools(),
		nitro({
			preset: "node-server",
			rollupConfig: { external: [/^@sentry\//] },
		}),
		tsconfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "robots.txt", "llms.txt", "llms-full.txt"],
			manifest: {
				name: "盘小子 - 网盘资源搜索与发现",
				short_name: "盘小子",
				description:
					"聚合检索第三方网盘公开分享信息，查看资源分类、更新时间和网盘来源。",
				start_url: "/",
				display: "standalone",
				background_color: "#ffffff",
				theme_color: "#ffffff",
				icons: [
					{
						src: "/favicon.ico",
						sizes: "64x64 32x32 24x24 16x16",
						type: "image/x-icon",
					},
				],
				lang: "zh-CN",
				dir: "ltr",
				categories: ["productivity", "utilities", "search"],
			},
		}),
	],
	build: {
		rollupOptions: {
			external: ["VitePWA"],
		},
	},
});

export default config;
