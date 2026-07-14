import { createFileRoute } from "@tanstack/react-router";
import { getResourceCount, getResourceRange } from "#/db/queries/resource";
import { env } from "#/env";
import { formatTime } from "#/utils/time";

export const Route = createFileRoute("/sitemap/$index.xml")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				const indexMatch = /^(\d+)\.xml$/.exec(params["index.xml"]);
				if (!indexMatch) {
					return notFoundResponse();
				}

				const index = Number(indexMatch[1]);
				const SITEMAP_SIZE = 30000;
				const baseUrl = env.BASE_URL.replace(/\/$/, "");
				const totalResources = await getResourceCount();
				const maxIndex = Math.ceil(totalResources / SITEMAP_SIZE) + 1;
				if (index < 1 || index > maxIndex) {
					return notFoundResponse();
				}

				let urls: Array<{ url: string; lastmod?: string }> = [];
				if (index === 1) {
					urls = [
						{
							url: baseUrl,
						},
						{
							url: `${baseUrl}/resource`,
						},
						{
							url: `${baseUrl}/guide`,
							lastmod: "2026-07-14",
						},
						{
							url: `${baseUrl}/about`,
							lastmod: "2026-07-14",
						},
						{
							url: `${baseUrl}/contact`,
							lastmod: "2026-07-14",
						},
					];
				} else {
					const start = (index - 2) * SITEMAP_SIZE;
					const end = start + SITEMAP_SIZE;
					// 其他 sitemap 只包含资源路由
					const resources = await getResourceRange(start, end);
					urls = resources.map((r) => ({
						url: `${baseUrl}/resource/${encodeURIComponent(r.pinyin)}`,
						lastmod: r.updatedAt
							? formatTime(r.updatedAt.toISOString(), "YYYY-MM-DD")
							: undefined,
					}));
				}
				const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
		.map(
			(u) => `
    <url>
      <loc>${escapeXml(u.url)}</loc>
      ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    </url>
  `,
		)
		.join("")}
</urlset>`;

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

function notFoundResponse() {
	return new Response("Sitemap not found", {
		status: 404,
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"X-Robots-Tag": "noindex",
		},
	});
}

function escapeXml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}
