import { IconCheck, IconDeviceDesktop, IconMoon, IconRobot, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type ThemeMode = "light" | "dark" | "auto";

function getInitialMode(): ThemeMode {
	if (typeof window === "undefined") {
		return "auto";
	}

	const stored = window.localStorage.getItem("theme");
	if (stored === "light" || stored === "dark" || stored === "auto") {
		return stored;
	}

	return "auto";
}

function applyThemeMode(mode: ThemeMode) {
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;

	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(resolved);

	if (mode === "auto") {
		document.documentElement.removeAttribute("data-theme");
	} else {
		document.documentElement.setAttribute("data-theme", mode);
	}

	document.documentElement.style.colorScheme = resolved;
}

export default function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>("auto");

	useEffect(() => {
		const initialMode = getInitialMode();
		setMode(initialMode);
		applyThemeMode(initialMode);
	}, []);

	useEffect(() => {
		if (mode !== "auto") {
			return;
		}

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyThemeMode("auto");

		media.addEventListener("change", onChange);
		return () => {
			media.removeEventListener("change", onChange);
		};
	}, [mode]);

	function toggleMode(mode: ThemeMode) {
		setMode(mode);
		applyThemeMode(mode);
		window.localStorage.setItem("theme", mode);
	}

	const themes = [
		{ mode: "light", title: "浅色模式", icon: IconSun },
		{ mode: "dark", title: "深色模式", icon: IconMoon },
		{ mode: "auto", title: "跟随系统", icon: IconDeviceDesktop },
	];

	const getThemeIcon = () => {
		const theme = themes.find((t) => t.mode === mode);

		if (!theme) return <IconSun className="h-4 w-4" />;
		const Icon = theme.icon;
		return <Icon className="h-4 w-4" />;
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" aria-label="切换主题">
					{getThemeIcon()}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				{themes.map((item) => (
					<DropdownMenuItem
						key={item.mode}
						onClick={() => toggleMode(item.mode as ThemeMode)}
						className="flex items-center justify-between"
					>
						<div className="flex items-center gap-2">
							<item.icon className="h-4 w-4" />
							{item.title}
						</div>
						{mode === item.mode && <IconCheck className="h-4 w-4" />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
