import { createFileRoute } from "@tanstack/react-router";
import llmsFullText from "#/content/llms-full.txt?raw";

export const Route = createFileRoute("/llms-full.txt")({
	server: {
		handlers: {
			GET: async () => textResponse(llmsFullText),
			HEAD: async () => textResponse(null),
		},
	},
});

function textResponse(content: string | null) {
	return new Response(content, {
		status: 200,
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Content-Language": "zh-CN",
			"Content-Disposition": "inline",
			"Cache-Control":
				"public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
			"X-Content-Type-Options": "nosniff",
		},
	});
}
