export const SITE_URL = "https://pan.xiaozi.cc";

export function buildCanonicalUrl(
	pathname: string,
	search?: Record<string, unknown>,
) {
	const url = new URL(pathname === "/" ? SITE_URL : `${SITE_URL}${pathname}`);

	if (search) {
		appendSearchParams(url.searchParams, search);
	}

	return pathname === "/" && !url.search ? SITE_URL : url.toString();
}

function appendSearchParams(
	params: URLSearchParams,
	search: Record<string, unknown>,
) {
	for (const [key, value] of Object.entries(search)) {
		if (value === undefined || value === null || value === "") {
			continue;
		}

		if (Array.isArray(value)) {
			for (const item of value) {
				if (item === undefined || item === null || item === "") {
					continue;
				}
				params.append(key, String(item));
			}
			continue;
		}

		params.set(key, String(value));
	}
}
