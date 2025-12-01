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
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	async function toggleTheme() {
		const newTheme = theme === "dark" ? "light" : "dark";

		// Verificação de suporte (Feature Detection)
		if (!document.startViewTransition) {
			// Fallback: Se não suportar, apenas troca o tema instantaneamente
			setTheme(newTheme);
			document.documentElement.classList.toggle("dark", newTheme === "dark");
			return;
		}

		const x = 40;
		const y = 28;

		const endRadius = Math.hypot(window.innerWidth, window.innerHeight);

		// Captura do estado (Snapshot) e aplicação das mudanças
		const transition = document.startViewTransition(() => {
			setTheme(newTheme);
			document.documentElement.classList.toggle("dark", newTheme === "dark");
		});

		// Animação customizada (Manipulação do DOM)
		try {
			await transition.ready;

			// Anima o pseudo-elemento ::view-transition-new(root)
			document.documentElement.animate(
				{
					clipPath: [
						`circle(0px at ${x}px ${y}px)`,
						`circle(${endRadius}px at ${x}px ${y}px)`,
					],
				},
				{
					duration: 700,
					easing: "ease-in-out",
					pseudoElement: "::view-transition-new(root)",
				},
			);
		} catch (error) {
			// Em caso de erro, não faz nada - a transição padrão será aplicada
			console.error("Erro na animação de transição:", error);
		}
	}

	if (!mounted) {
		return (
			<Button
				variant="ghost"
				className="rounded-full [&>svg]:text-muted-foreground/80 hover:[&>svg]:text-foreground"
				size="icon"
				disabled
			>
				<Sun className="h-[1.2rem] w-[1.2rem]" />
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
					{theme === "light" ? (
						<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90" />
					) : (
						<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:rotate-0" />
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
