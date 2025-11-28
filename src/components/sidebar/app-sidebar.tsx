"use client";

import { NavItems } from "@/components/sidebar/nav-items";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { navbarItems } from "@/lib/sidebar-menu-list";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={navbarItems.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavItems
					data={navbarItems.principal}
					groupLabel="Principal"
					// className="group-data-[collapsible=icon]:hidden"
				/>
				<NavItems data={navbarItems.services} groupLabel="Serviços" />
				<NavItems data={navbarItems.comercial} groupLabel="Comercial" />
				<NavItems data={navbarItems.compliments} groupLabel="Complementos" />
				<NavItems data={navbarItems.organization} groupLabel="Organização" />
			</SidebarContent>
		</Sidebar>
	);
}
