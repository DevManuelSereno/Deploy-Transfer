import { Bot } from "lucide-react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function OpenAiToolbar() {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					size="icon"
					className={cn(
						"cursor-pointer w-10 h-9 relative overflow-hidden",
						"before:absolute before:inset-0 before:rounded-[inherit] before:bg-[length:250%_250%,100%_100%]",
						"before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)]",
						"before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease]",
						"before:duration-1000 hover:before:bg-[position:-100%_0,0_0]",
						"dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]",
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
						<p className="font-medium text-sm">@passAI</p>
						<p className="text-sm">
							Use the AI assistant to generate reports directly from your
							dashboard.
						</p>
						<p className="text-xs">Powered by PASS — © 2025</p>
					</div>
				</div>
			</TooltipContent>
		</Tooltip>
	);
}
