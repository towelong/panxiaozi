import { env } from "#/env";
import { formatTime } from "./time";

export const notice = async (msg: string) => {
	if (!env.NOTICE_API) {
		return;
	}
	const timeStr = formatTime(new Date().toISOString());
	await fetch(env.NOTICE_API, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			title: "转存失败",
			subtitle: "转存失败",
			body: `${msg}\n时间：${timeStr}`,
		}),
	});
};
