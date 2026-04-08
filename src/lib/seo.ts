export const SITE_URL = "https://pan.xiaozi.cc";
export const SITE_NAME = "盘小子";
export const NETDISK_TITLE_FILLERS = ["夸克网盘", "百度网盘", "阿里云盘"];
const TITLE_BRAND_SUFFIX = ` - ${SITE_NAME}`;
const TITLE_MIN_LENGTH = 15;

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

export function buildSeoTitle(title: string, fillers: string[] = []) {
	let normalizedTitle = title.trim();
	const minContentLength = TITLE_MIN_LENGTH - Array.from(TITLE_BRAND_SUFFIX).length;

	for (const filler of fillers) {
		if (Array.from(normalizedTitle).length >= minContentLength) {
			break;
		}

		const normalizedFiller = filler.trim();
		if (!normalizedFiller || normalizedTitle.includes(normalizedFiller)) {
			continue;
		}

		normalizedTitle = `${normalizedTitle}_${normalizedFiller}`;
	}

	return `${normalizedTitle} - ${SITE_NAME}`;
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
