import { IconSearch } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/components/ui/input-group";
import { getHotResourceServer } from "@/server/resource";

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
		<main className="py-12 px-4 md:px-0 bg-blue-50 dark:bg-blue-900/10 flex justify-center">
			<div className="container grid grid-cols-1 md:grid-cols-1 gap-8 items-center flex-col">
				<div className="space-y-6">
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
				<div>
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
			</div>
			<div>
				
			</div>
		</main>
	);
}
