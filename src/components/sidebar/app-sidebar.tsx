"use client";

import { NavItems } from "@/components/sidebar/nav-items";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { navbarItems, teamsItems } from "@/lib/sidebar-menu-list";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
		return (
			<Sidebar collapsible="icon" {...props}>
				<SidebarHeader>
					<TeamSwitcher teams={teamsItems} />
				</SidebarHeader>
				<SidebarContent>
					<NavItems data={navbarItems.principal} groupKey="principal" />
					<NavItems data={navbarItems.frota} groupKey="frota" />
					<NavItems data={navbarItems.organization} groupKey="organization" />
				</SidebarContent>
			</Sidebar>
		);
}
