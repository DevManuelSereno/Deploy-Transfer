"use client";

import type { LucideIcon } from "lucide-react";
import type React from "react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface CardInsightProps {
	Icon: LucideIcon;
	title: string;
	value: string | React.ReactNode;
	description?: string;
}

export function CardInsight({
	title,
	value,
	Icon,
	description,
}: CardInsightProps) {
	return (
		<Card
			className={cn(
				"h-full w-[20rem] select-none border-0 p-4 shadow-custom! bg-[linear-gradient(to_bottom,#ffffff_0%,#fcfcfc_50%,#fafafa_100%)] dark:bg-[linear-gradient(to_top,#232323_0%,#1c1c1c_30%,#161616_100%)] dark:border dark:border-[#262626]",
			)}
		>
			<CardHeader className="w-full px-0">
				<Icon className="size-6 text-purple-500 dark:text-purple-400" />
				<div className="font-semibold text-base">{title}</div>
				<CardTitle className="text-2xl">{value}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
		</Card>
	);
}

interface CarouselCardInsightProps {
	cardData: CardInsightProps[];
}

export function CarouselCardInsight({ cardData }: CarouselCardInsightProps) {
	return (
		<Carousel
			opts={{ dragFree: true }}
			className="-mb-3.5 cursor-grab active:cursor-grabbing"
		>
			<CarouselContent className="mx-px mb-3.5 mt-px gap-4">
				{cardData.map((stat) => (
					<CarouselItem className="basis-auto pl-0" key={stat.title}>
						<CardInsight {...stat} />
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}
