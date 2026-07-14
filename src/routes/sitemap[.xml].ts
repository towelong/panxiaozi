import { createFileRoute } from "@tanstack/react-router";
import { getResourceCount } from "#/db/queries/resource";
import { env } from "#/env";

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () => {
				const totalResources = await getResourceCount();
				const SITEMAP_SIZE = 30000;
				const baseUrl = env.BASE_URL.replace(/\/$/, "");
				const numberOfResourceSitemaps = Math.ceil(
					totalResources / SITEMAP_SIZE,
				);

				// 静态路由
				const staticRoutes = [
					{
						url: `${baseUrl}/sitemap/1.xml`,
					},
				];

				// 生成 resource sitemap 引用
				const resourceSitemaps = Array.from(
					{ length: numberOfResourceSitemaps },
					(_, i) => ({
						url: `${baseUrl}/sitemap/${i + 2}.xml`,
					}),
				);

				const allRoutes = [...staticRoutes, ...resourceSitemaps];

				const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
		.map(
			(page) => `
  <sitemap>
    <loc>${escapeXml(page.url)}</loc>
  </sitemap>`,
		)
		.join("")}
</sitemapindex>`;

				return new Response(xml, {
					status: 200,
					headers: {
						"Content-Type": "application/xml; charset=utf-8",
						"Cache-Control":
							"public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
						"X-Content-Type-Options": "nosniff",
					},
				});
			},
		},
	},
});

function escapeXml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}
