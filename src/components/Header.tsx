import { IconMenu2 } from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

const navItems = [
	{ label: "首页", href: "/" },
	{ label: "资源", href: "/resource" },
	{ label: "联系我们", href: "/contact" },
];

export default function Header() {

	const [open, setOpen] = useState(false);
	const { pathname } = useLocation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: no
	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background flex h-16 items-center justify-between px-2 md:px-0">
			<div className="container mx-auto flex items-center justify-between">
				<div className="flex items-center gap-6">
					<Link title="盘小子" className="flex items-center gap-2" to={"/"}>
						<img src="/logo.svg" alt="盘小子" className="h-8 w-8" />
						<span className="text-xl font-bold text-primary">盘小子</span>
					</Link>
					<nav className="hidden md:flex">
						<ul className="flex gap-5">
							{navItems.map((item) => {
								const isActive =
									pathname === item.href ||
									(item.href !== "/" && pathname?.startsWith(item.href));

								return (
									<li key={item.href}>
										<Link
											to={item.href}
											title={item.label}
											className={`text-sm font-medium ${
												isActive
													? "text-primary font-semibold"
													: "text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
											}`}
										>
											{item.label}
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>
				</div>
				<div className="flex items-center gap-2">
					{/* 主题切换：右侧按钮 */}
					<ThemeToggle />
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild className="sm:hidden flex justify-center items-center">
							<Button variant="ghost" size="icon" aria-label="菜单">
								<IconMenu2 className="h-4 w-4" />
							</Button>
						</SheetTrigger>
						<SheetContent
							side="top"
							showCloseButton={false}
							className="min-h-[20vh] overflow-hidden border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80"
						>
							<SheetHeader>
								<SheetTitle>盘小子</SheetTitle>
							</SheetHeader>
							<div className="overflow-y-auto px-6 pb-2">
								<ul className="space-y-8">
									{navItems.map((item) => {
										const isActive =
											pathname === item.href ||
											(item.href !== "/" && pathname?.startsWith(item.href));

										return (
											<li key={item.href}>
												<Link
													to={item.href}
													title={item.label}
													className={`font-medium text-base py-1 ${
														isActive
															? "text-primary font-bold"
															: "text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
													}`}
												>
													{item.label}
												</Link>
											</li>
										);
									})}
								</ul>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
