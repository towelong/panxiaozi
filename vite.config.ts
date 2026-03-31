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
			includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
			manifest: {
				name: "盘小子 - 免费网盘资源搜索引擎 | 夸克网盘 百度网盘 阿里云盘一站式搜索平台",
				short_name: "盘小子",
				description:
					"盘小子是一个一站式网盘资源搜索引擎，支持夸克网盘、百度网盘、阿里云盘等多平台，快速精准搜索，一键直达",
				start_url: "/",
				display: "standalone",
				background_color: "#ffffff",
				theme_color: "#000000",
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
