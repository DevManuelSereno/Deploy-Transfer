"use client";

import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";

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
	const pathname = usePathname();
	return (
		<SidebarGroup>
			<SidebarGroupLabel>{t(`groups.${groupKey}` as any)}</SidebarGroupLabel>
			<SidebarMenu className="gap-0.5">
				{data.map((item) => {
					const isActive = pathname === item.url;
					return (
						<SidebarMenuItem key={item.key}>
							<SidebarMenuButton
								asChild
								className="h-9 text-sm px-4 text-muted-foreground gap-3"
								isActive={isActive}
							>
								<Link href={item.url}>
									<item.icon />
									<span>{t(`items.${item.key}` as any)}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
