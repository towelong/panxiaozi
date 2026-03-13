import { createFileRoute } from "@tanstack/react-router";
import { getResourceRange } from "#/db/queries/resource";
import { env } from "#/env";
import { formatTime } from "#/utils/time";

export const Route = createFileRoute("/sitemap/$index.xml")({
	server: {
		handlers: {
			GET: async ({ request, params }) => {
				const indexStr = params["index.xml"];
				const index = parseInt(indexStr.replaceAll(".xml", ""));
				let urls = [];
				if (index === 1) {
					const now = formatTime(new Date().toISOString(), "YYYY-MM-DD");
					urls = [
						{
							url: env.BASE_URL,
							lastmod: now,
							changefgefreqreq: "Daily",
							priority: 1.0,
						},
						{
							url: `${env.BASE_URL}/resource`,
							lastmod: now,
							changefreq: "Weekly",
							priority: 0.8,
						},
						{
							url: `${env.BASE_URL}/contact`,
							lastmod: now,
							changefreq: "Weekly",
							priority: 0.8,
						},
					];
				} else {
					const SITEMAP_SIZE = 30000;
					const start = (index - 2) * SITEMAP_SIZE;
					const end = start + SITEMAP_SIZE;
					// 其他 sitemap 只包含资源路由
					const resources = await getResourceRange(start, end);
					urls = resources.map((r) => ({
						url: `${env.BASE_URL}/resource/${r.pinyin}`,
						lastmod: formatTime(r.updatedAt?.toISOString() || new Date().toISOString(), "YYYY-MM-DD"),
						changefreq: "Weekly",
						priority: 0.7,
					}));
				}
				const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
		.map(
			(u) => `
    <url>
      <loc>${u.url}</loc>
      <lastmod>${u.lastmod}</lastmod>
      <changefreq>${u.changefreq}</changefreq>
      <priority>${u.priority}</priority>
    </url>
  `,
		)
		.join("")}
</urlset>`;

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
