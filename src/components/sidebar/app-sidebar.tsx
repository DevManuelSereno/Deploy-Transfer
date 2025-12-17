"use client";

import { NavItems } from "@/components/sidebar/nav-items";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { sidebarItems, teamsItems } from "@/lib/sidebar-menu-list";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={teamsItems} />
			</SidebarHeader>
			<SidebarContent>
				<NavItems data={sidebarItems.principal} groupKey="principal" />
				<NavItems data={sidebarItems.frota} groupKey="frota" />
				<NavItems data={sidebarItems.organization} groupKey="organization" />
			</SidebarContent>
		</Sidebar>
	);
}
