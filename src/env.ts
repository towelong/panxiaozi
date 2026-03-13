import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		HOT_MOVIE_API: z.string(),
		DATABASE_HOST: z.string(),
		DATABASE_PORT: z.string(),
		DATABASE_USERNAME: z.string(),
		DATABASE_PASSWORD: z.string(),
		DATABASE_NAME: z.string(),
		QUARK_API: z.string(),
		BASE_URL: z.string(),
		NOTICE_API: z.string().optional(),
	},

	/**
	 * The prefix that client-side variables must have. This is enforced both at
	 * a type-level and at runtime.
	 */
	clientPrefix: "VITE_",

	client: {
		VITE_UMAMI_API: z.string().optional(),
		VITE_UMAMI_ID: z.string().optional(),
	},

	/**
	 * What object holds the environment variables at runtime. This is usually
	 * `process.env` or `import.meta.env`.
	 */
	runtimeEnv: process.env,

	/**
	 * By default, this library will feed the environment variables directly to
	 * the Zod validator.
	 *
	 * This means that if you have an empty string for a value that is supposed
	 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	 * it as a type mismatch violation. Additionally, if you have an empty string
	 * for a value that is supposed to be a string with a default value (e.g.
	 * `DOMAIN=` in an ".env" file), the default value will never be applied.
	 *
	 * In order to solve these issues, we recommend that all new projects
	 * explicitly specify this option as true.
	 */
	emptyStringAsUndefined: true,
});
