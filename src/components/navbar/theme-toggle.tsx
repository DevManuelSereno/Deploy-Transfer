"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	function toggleTheme() {
		setTheme(theme === "dark" ? "light" : "dark");
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
					{theme === "light" ? (
						<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90" />
					) : (
						<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:rotate-0" />
					)}

					<span className="sr-only">Alternar tema</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent hasArrow className="font-normal text-sm">
				Alternar tema
			</TooltipContent>
		</Tooltip>
	);
}
