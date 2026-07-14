export interface ResourceSearch {
	q?: string;
	category?: string;
	page?: number;
}

export function validateResourceSearch(
	search: { q?: unknown; category?: unknown; page?: unknown },
): ResourceSearch {
	const q = typeof search.q === "string" ? search.q : undefined;
	const category =
		typeof search.category === "string" ? search.category : undefined;
	const parsedPage =
		typeof search.page === "number"
			? search.page
			: typeof search.page === "string"
				? Number(search.page)
				: undefined;
	const page =
		parsedPage !== undefined && Number.isFinite(parsedPage)
			? Math.max(1, Math.floor(parsedPage))
			: undefined;

	return { q, category, page };
}
