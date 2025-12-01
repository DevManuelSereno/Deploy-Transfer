"use client";

import { Grip } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import React from "react";
import balanceImgDark from "@/assets/icons/dark/balance.png";
import channelImgDark from "@/assets/icons/dark/channel.png";
import connectImgDark from "@/assets/icons/dark/connect.png";
import flowImgDark from "@/assets/icons/dark/flow.png";
import marketplaceImgDark from "@/assets/icons/dark/marketplace.png";
import officeImgDark from "@/assets/icons/dark/office.png";
import transferImgDark from "@/assets/icons/dark/transfer.png";
import workspaceImgDark from "@/assets/icons/dark/workspace.png";
import balanceImgLight from "@/assets/icons/light/balance.png";
import channelImgLight from "@/assets/icons/light/channel.png";
import connectImgLight from "@/assets/icons/light/connect.png";
import flowImgLight from "@/assets/icons/light/flow.png";
import marketplaceImgLight from "@/assets/icons/light/marketplace.png";
import officeImgLight from "@/assets/icons/light/office.png";
import transferImgLight from "@/assets/icons/light/transfer.png";
import workspaceImgLight from "@/assets/icons/light/workspace.png";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const AppItem = ({ src, label }: { src: any; label: string }) => (
	<li className="relative size-[96px]">
		<a
			href="https://pass.ai/dashboard"
			className="absolute grid size-full place-items-center gap-1 rounded-lg p-1.5 text-center hover:bg-accent"
		>
			<Image src={src} alt="PASS Logo" className="h-10 w-10" />
			<span className="text-sm font-normal">{label}</span>
		</a>
	</li>
);

export function PassApps() {
	const [open, setOpen] = React.useState(false);
	const { theme } = useTheme();

	const apps = [
		{
			src: theme === "dark" ? workspaceImgDark : workspaceImgLight,
			label: "Workspace",
		},
		{
			src: theme === "dark" ? transferImgDark : transferImgLight,
			label: "Transfer",
		},
		{
			src: theme === "dark" ? marketplaceImgDark : marketplaceImgLight,
			label: "Marketplace",
		},
		{ src: theme === "dark" ? flowImgDark : flowImgLight, label: "Flow" },
		{
			src: theme === "dark" ? balanceImgDark : balanceImgLight,
			label: "Balance",
		},
		{ src: theme === "dark" ? officeImgDark : officeImgLight, label: "Office" },
		{
			src: theme === "dark" ? channelImgDark : channelImgLight,
			label: "Channel",
		},
		{
			src: theme === "dark" ? connectImgDark : connectImgLight,
			label: "Connect",
		},
	];

	return (
		<div className="inline-block">
			<Popover open={open} onOpenChange={setOpen}>
				{!open ? (
					<Tooltip>
						<TooltipTrigger asChild>
							<PopoverTrigger asChild>
								<Button
									variant="ghost"
									className="rounded-full [&>svg]:text-muted-foreground/80 hover:[&>svg]:text-foreground"
									size="icon"
									onClick={() => setOpen((op) => !op)}
								>
									<Grip />
								</Button>
							</PopoverTrigger>
						</TooltipTrigger>
						<TooltipContent>Pass Apps</TooltipContent>
					</Tooltip>
				) : (
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							className="rounded-full [&>svg]:text-muted-foreground/80 hover:[&>svg]:text-foreground"
							size="icon"
							onClick={() => setOpen((op) => !op)}
						>
							<Grip />
						</Button>
					</PopoverTrigger>
				)}

				<PopoverContent
					side="bottom"
					align="end"
					className="w-auto p-0 rounded-xl"
				>
					<ScrollArea className="relative overflow-hidden flex max-h-full flex-col px-5">
						<ul className="my-6 grid grid-cols-3 gap-y-3">
							{apps.map((app) => (
								<AppItem key={app.label} {...app} />
							))}
						</ul>
					</ScrollArea>
				</PopoverContent>
			</Popover>
		</div>
	);
}
