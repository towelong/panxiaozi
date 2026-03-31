import { config as loadEnv } from "dotenv";

// 直接在这里维护你的标题样本
const TITLE_SAMPLES: string[] = [
	"永不磨灭的番号 (2011) 4K 全集",
	"魔天记 (2025)动画 奇幻 冒险 4K高码 更14集",
	"刺客伍六七 5季全 4K",
	"【日漫】怪兽8号 第二季 (2025)【更新至7集】【高码率】【1.5G/集】附第一季",
	"归队（2025）4K60帧更14",
	"仙武传(2025)4KHQ更130",
	"武神归来为护妻威震全场（63集） /最新 短剧",
	"有病才会喜欢你 有病才會喜歡你 (2025)",
	"2025手机剪映剪辑从零到爆款",
	"我成杀猪匠了你说我是真千金（79集）董玥妤&徐扬灏 /最新 短剧",
	"我很在乎 I Care a Lot (2021) 1080p 原盘Remux 中文字幕 【19.33GB】已刮削"
];

// 期望结果（顺序需与 TITLE_SAMPLES 一致）
const EXPECTED_RESULTS: string[] = [
	"永不磨灭的番号",
	"魔天记",
	"刺客伍六七",
	"怪兽8号",
	"归队",
	"仙武传",
	"武神归来为护妻威震全场",
	"有病才会喜欢你",
	"2025手机剪映剪辑从零到爆款",
	"我成杀猪匠了你说我是真千金",
	"我很在乎"
];

loadEnv({ path: ".env.local", override: false });
loadEnv({ path: ".env", override: false });

const { extractPrimaryTitle } = await import("../src/db/queries/resource.ts");

if (TITLE_SAMPLES.length !== EXPECTED_RESULTS.length) {
	throw new Error("TITLE_SAMPLES 与 EXPECTED_RESULTS 长度不一致");
}

let passed = 0;
for (const [index, title] of TITLE_SAMPLES.entries()) {
	const extracted = extractPrimaryTitle(title);
	const expected = EXPECTED_RESULTS[index];
	const ok = extracted === expected;
	if (ok) passed += 1;

	console.log(`${index + 1}. 原始: ${title}`);
	console.log(`   提取: ${extracted || "(空)"}`);
	console.log(`   期望: ${expected}`);
	console.log(`   结果: ${ok ? "PASS" : "FAIL"}`);
}

console.log(`\n汇总: ${passed}/${TITLE_SAMPLES.length} PASS`);
