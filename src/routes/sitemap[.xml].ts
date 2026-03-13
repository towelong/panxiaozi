import { createFileRoute } from "@tanstack/react-router";
import { getResourceCount } from "#/db/queries/resource";
import { env } from "#/env";

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const totalResources = await getResourceCount();
				const SITEMAP_SIZE = 30000;
				const numberOfResourceSitemaps = Math.ceil(
					totalResources / SITEMAP_SIZE,
				);

				// 静态路由
				const staticRoutes = [
					{
						url: `${env.BASE_URL}/sitemap/1.xml`,
					},
				];

				// 生成 resource sitemap 引用
				const resourceSitemaps = Array.from(
					{ length: numberOfResourceSitemaps },
					(_, i) => ({
						url: `${env.BASE_URL}/sitemap/${i + 2}.xml`,
					}),
				);

				const allRoutes = [...staticRoutes, ...resourceSitemaps];

				const xml = `
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
		.map(
			(page) => `
  <sitemap>
    <loc>${page.url}</loc>
  </sitemap>`,
		)
		.join("")}
</sitemapindex>`;

				return new Response(xml, {
					status: 200,
					headers: {
						"Content-Type": "application/xml",
						"Cache-Control": "public, max-age=3600",
					},
				});
			},
		},
	},
});
