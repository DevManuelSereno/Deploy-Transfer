"use client";

import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavItems({
	data,
	groupKey,
}: {
	data: {
		key: string;
		url: string;
		icon: LucideIcon;
	}[];
	groupKey: string;
}) {
	const t = useTranslations("Sidebar");

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{t(`groups.${groupKey}`)}</SidebarGroupLabel>
			<SidebarMenu className="gap-0.5">
				{data.map((item) => (
					<SidebarMenuItem key={item.key}>
						<SidebarMenuButton
							asChild
							className="h-9 text-sm px-4 text-muted-foreground gap-3"
						>
							<Link href={item.url}>
								<item.icon />
								<span>{t(`items.${item.key}`)}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
