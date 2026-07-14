export const SITE_URL = "https://pan.xiaozi.cc";
export const SITE_NAME = "盘小子";
const TITLE_BRAND_SUFFIX = ` - ${SITE_NAME}`;
const DESCRIPTION_MAX_LENGTH = 160;

export function buildCanonicalUrl(
	pathname: string,
	search?: object,
) {
	const url = new URL(pathname === "/" ? SITE_URL : `${SITE_URL}${pathname}`);

	if (search) {
		appendSearchParams(url.searchParams, search);
	}

	return pathname === "/" && !url.search ? SITE_URL : url.toString();
}

export function buildSeoTitle(title: string) {
	const normalizedTitle = normalizePlainText(title);
	return normalizedTitle.endsWith(TITLE_BRAND_SUFFIX)
		? normalizedTitle
		: `${normalizedTitle}${TITLE_BRAND_SUFFIX}`;
}

export function buildSeoDescription(
	content: string | null | undefined,
	fallback: string,
) {
	const normalized = normalizePlainText(content || fallback);
	const characters = Array.from(normalized);

	if (characters.length <= DESCRIPTION_MAX_LENGTH) {
		return normalized;
	}

	return `${characters.slice(0, DESCRIPTION_MAX_LENGTH - 1).join("")}…`;
}

export function serializeJsonLd(value: unknown) {
	return JSON.stringify(value)
		.replaceAll("<", "\\u003c")
		.replaceAll(">", "\\u003e")
		.replaceAll("&", "\\u0026");
}

function normalizePlainText(value: string) {
	return value.replace(/\s+/g, " ").trim();
}

function appendSearchParams(
	params: URLSearchParams,
	search: object,
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
