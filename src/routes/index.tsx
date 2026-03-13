import { IconSearch } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/components/ui/input-group";
import { getHotResourceServer } from "@/server/resource";

const landingHighlights = [
	{
		title: "高质量筛选",
		description: "聚合高热度资源词，减少你在无效结果上的时间消耗。",
	},
	{
		title: "即时搜索",
		description: "输入关键词即可跳转结果页，专注查找，不被复杂流程打断。",
	},
	{
		title: "持续更新",
		description: "热门词每天滚动变化，帮你更快发现近期值得关注的内容。",
	},
];

const quickSteps = [
	{
		title: "输入关键词",
		description: "在首页搜索框中输入你要找的主题。",
	},
	{
		title: "查看结果",
		description: "进入资源页后按相关度快速筛选。",
	},
	{
		title: "持续追踪",
		description: "回到首页查看热门趋势，获取更多方向。",
	},
];

const faqItems = [
	{
		question: "盘小子的资源是怎么来的？",
		answer:
			"系统会基于站内热门搜索与资源趋势进行聚合整理，优先展示更受关注、相关性更高的关键词。",
	},
	{
		question: "搜索不到我想要的内容怎么办？",
		answer:
			"你可以尝试更换同义词、缩短关键词，或先从热门搜索中选择相关方向再逐步细化。",
	},
	{
		question: "首页的热门搜索会更新吗？",
		answer:
			"会，热门关键词会根据最新数据持续变化，建议定期回访首页获取新的资源线索。",
	},
	{
		question: "是否支持移动端使用？",
		answer: "支持，页面已适配移动端和桌面端，方便你在不同设备上快速搜索。",
	},
	{
		question: "使用盘小子需要注册账号吗？",
		answer: "目前首页搜索和热门浏览不需要额外注册，打开即可使用基础检索能力。",
	},
	{
		question: "搜索关键词有推荐写法吗？",
		answer:
			"建议优先使用核心名词，例如“AI 提示词”“设计素材包”，再逐步叠加限定词提升准确度。",
	},
	{
		question: "热门搜索里的排名代表什么？",
		answer: "排名反映近期关键词的热度表现，序号越靠前通常代表当前关注度越高。",
	},
	{
		question: "可以直接查看全部资源吗？",
		answer: "可以，点击页面里的“查看全部资源”按钮即可进入资源列表页继续筛选。",
	},
	{
		question: "如果发现关键词不准确，怎么反馈？",
		answer:
			"你可以通过站内联系方式反馈问题，我们会根据反馈持续优化资源词和排序质量。",
	},
];

export const Route = createFileRoute("/")({
	loader: async () => {
		const hotResources = await getHotResourceServer();
		return hotResources;
	},
	staleTime: 5 * 60 * 1000,
	gcTime: 5 * 60 * 1000,
	component: App,
});

function App() {
	const [keyword, setKeyword] = useState("");
	const navigate = Route.useNavigate();

	const data = Route.useLoaderData();

	return (
		<main className="bg-blue-50 dark:bg-blue-900/10 py-12 px-4 md:px-0 flex justify-center">
			<div className="container grid grid-cols-1 md:grid-cols-1 gap-8 items-center flex-col">
				<div className="space-y-6">
					<div className="space-y-6 ">
						<div className="flex items-center gap-2 justify-center">
							<img src={"/logo.svg"} alt="logo" className="w-8 h-8" />
							<h1 className="text-2xl font-bold text-primary">盘小子</h1>
							<span className="text-gray-700 dark:text-muted-foreground">
								已收录
							</span>
							<span className="text-primary font-bold">{data.count}</span>
							<span className="text-gray-700 dark:text-muted-foreground">
								个高质量资源
							</span>
						</div>
						<div className="flex items-center">
							<InputGroup>
								<InputGroupAddon align="inline-start">
									<IconSearch />
								</InputGroupAddon>
								<InputGroupInput
									value={keyword}
									onChange={(e) => setKeyword(e.target.value)}
									placeholder="请输入关键词搜索"
								/>
							</InputGroup>
							<Button
								onClick={() =>
									navigate({
										to: "/resource",
										search: {
											q: keyword,
										},
									})
								}
							>
								搜索
							</Button>
						</div>
					</div>
					<Card className="h-full">
						<CardContent className="h-full">
							<div className="flex items-center justify-between mb-4">
								<h2 className="font-bold">热门搜索</h2>
							</div>
							<ul className="grid grid-cols-2 gap-x-4 gap-y-3">
								{data.hotResources.map((item, index) => (
									<li key={item}>
										<Link
											to="/resource"
											search={{ q: item }}
											title={item}
											className="flex items-center gap-2 group"
										>
											<span className="text-xs block text-orange-500 font-bold min-w-4">
												{index + 1}
											</span>
											<h2 className="text-sm group-hover:text-primary text-gray-700 dark:text-muted-foreground line-clamp-1">
												{item}
											</h2>
										</Link>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</div>
				<div className="space-y-6">
					<h2 className="text-xl font-bold text-center">为什么使用盘小子</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
						{landingHighlights.map((item) => (
							<Card key={item.title}>
								<CardContent className="pt-2">
									<h3 className="font-semibold mb-2">{item.title}</h3>
									<p className="text-sm text-gray-600 dark:text-muted-foreground leading-6">
										{item.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
				<div className="space-y-6">
					<h2 className="text-xl font-bold text-center mt-2">3 步快速上手</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{quickSteps.map((step, index) => (
							<Card key={step.title}>
								<CardContent className="pt-6 space-y-2">
									<span className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
										{index + 1}
									</span>
									<h3 className="font-semibold">{step.title}</h3>
									<p className="text-sm text-gray-600 dark:text-muted-foreground leading-6">
										{step.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
				<div className="space-y-6">
					<h2 className="text-xl font-bold text-center mt-2">常见问题 FAQ</h2>
					<Accordion
						type="single"
						collapsible
						className="mx-auto w-full max-w-3xl rounded-lg border bg-card px-4"
					>
						{faqItems.map((item, index) => (
							<AccordionItem key={item.question} value={`faq-${index}`}>
								<AccordionTrigger className="text-base hover:no-underline">
									{item.question}
								</AccordionTrigger>
								<AccordionContent className="text-gray-600 dark:text-muted-foreground leading-6">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
				<div>
					<Card className="border-primary/20 bg-gradient-to-r from-blue-100/80 to-sky-100/80 dark:from-blue-900/30 dark:to-sky-900/20">
						<CardContent className="py-8 text-center space-y-4">
							<h2 className="text-2xl font-bold">开始下一次高效搜索</h2>
							<p className="text-sm text-gray-700 dark:text-muted-foreground">
								现在就搜索你的关键词，快速找到更有价值的资源。
							</p>
							<div className="flex items-center justify-center gap-3">
								<Button
									onClick={() =>
										navigate({
											to: "/resource",
											search: { q: keyword },
										})
									}
								>
									立即搜索
								</Button>
								<Button variant="outline" asChild>
									<Link to="/resource">查看全部资源</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
			<div></div>
		</main>
	);
}
