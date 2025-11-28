"use client";

import { Grip } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import React from "react";
import balanceImg from "@/assets/images/balance.webp";
import channelImg from "@/assets/images/channel.webp";
import connectImg from "@/assets/images/connect.webp";
import flowImg from "@/assets/images/flow.webp";
import marketplaceImg from "@/assets/images/marketplace.webp";
import officeImg from "@/assets/images/office.webp";
import transferImg from "@/assets/images/transfer.webp";
import workspaceImg from "@/assets/images/workspace.webp";
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

	const apps = [
		{ src: workspaceImg, label: "Workspace" },
		{ src: transferImg, label: "Transfer" },
		{ src: marketplaceImg, label: "Marketplace" },
		{ src: flowImg, label: "Flow" },
		{ src: balanceImg, label: "Balance" },
		{ src: officeImg, label: "Office" },
		{ src: channelImg, label: "Channel" },
		{ src: connectImg, label: "Connect" },
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
						<TooltipContent hasArrow>Pass Apps</TooltipContent>
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
