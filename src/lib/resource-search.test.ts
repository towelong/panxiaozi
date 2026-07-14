import { describe, expect, it } from "vitest";
import { validateResourceSearch } from "./resource-search";

describe("validateResourceSearch", () => {
	it("accepts numeric page values produced by the router search parser", () => {
		expect(validateResourceSearch({ page: 2 })).toEqual({
			q: undefined,
			category: undefined,
			page: 2,
		});
	});

	it("accepts page values from a plain URLSearchParams parser", () => {
		expect(validateResourceSearch({ page: "3" }).page).toBe(3);
	});

	it("normalizes invalid or out-of-range page values", () => {
		expect(validateResourceSearch({ page: 0 }).page).toBe(1);
		expect(validateResourceSearch({ page: 2.8 }).page).toBe(2);
		expect(validateResourceSearch({ page: "invalid" }).page).toBeUndefined();
	});

	it("preserves resource filters", () => {
		expect(
			validateResourceSearch({ q: "电影", category: "movie", page: 4 }),
		).toEqual({ q: "电影", category: "movie", page: 4 });
	});
});
