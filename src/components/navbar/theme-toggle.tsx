"use client";

import { Moon, Sun } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useThemeToggle } from "@/hooks/use-theme-toggle";

export function ThemeToggle() {
	const { toggleTheme, isDark } = useThemeToggle();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button
				variant="ghost"
				className="rounded-full [&>svg]:text-muted-foreground/80 hover:[&>svg]:text-foreground disabled:opacity-100" // para não renderizar com opacity menor
				size="icon"
				disabled
			>
				<Moon className="h-[1.2rem] w-[1.2rem]" />
				<span className="sr-only">Alternar tema</span>
			</Button>
		);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					className="rounded-full [&>svg]:text-muted-foreground/80 hover:[&>svg]:text-foreground"
					size="icon"
					onClick={toggleTheme}
				>
					{isDark ? (
						<Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all dark:rotate-0" />
					) : (
						<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90" />
					)}

					<span className="sr-only">Alternar tema</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent className="font-normal text-sm">
				Alternar tema
			</TooltipContent>
		</Tooltip>
	);
}
