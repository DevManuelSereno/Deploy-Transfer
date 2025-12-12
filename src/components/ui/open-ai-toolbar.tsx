"use client";

import { Bot } from "lucide-react";
import { useTranslations } from "next-intl";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function OpenAiToolbar() {
	const t = useTranslations("OpenAiToolbar");

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					size="icon"
					className={cn(
						"gap-2 whitespace-nowrap cursor-pointer disabled:pointer-events-none disabled:opacity-50",
						"[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
						"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
						"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
						"hover:bg-primary/90 h-9 w-10 has-[>svg]:px-3 relative inline-flex items-center justify-center align-middle",
						"select-none font-sans font-medium text-center px-4 py-2 text-background text-sm rounded-md bg-primary",
						"backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.65),0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)]",
						"before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br",
						"before:from-white/20 before:via-transparent before:to-transparent before:opacity-70",
						"before:pointer-events-none after:absolute after:inset-0 after:rounded-md after:bg-gradient-to-tl",
						"after:from-white/15 after:via-transparent after:to-transparent after:opacity-50",
						"after:pointer-events-none transition-all duration-300 antialiased dark:text-white",
						"dark:bg-white/2.5 dark:hover:bg-white/5 dark:border-white/10",
					)}
				>
					<Bot />
				</Button>
			</TooltipTrigger>
			<TooltipContent
				sideOffset={12}
				side="bottom"
				align="start"
				className={cn(
					"bg-primary text-primary-foreground w-[310px] text-wrap",
					"dark:bg-primary dark:text-primary-foreground",
					"rounded-md border p-4 shadow-md outline-hidden",
				)}
			>
				<div className="flex items-start gap-4">
					<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white">
						<Icons.openAIblack size={24} />
					</div>
					<div className="space-y-1 font-normal">
						<p className="font-medium text-sm">{t("title")}</p>
						<p className="text-sm">{t("description")}</p>
						<p className="text-xs">{t("footer")}</p>
					</div>
				</div>
			</TooltipContent>
		</Tooltip>
	);
}
