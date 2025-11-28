"use client";

import { BadgeCheck, CreditCard, LogOut } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				{/* Controlamos o DropdownMenu */}
				<DropdownMenu open={open} onOpenChange={setOpen}>
					{/* Usamos um wrapper <span> como filho do DropdownMenuTrigger (para evitar conflitos de asChild) */}
					<DropdownMenuTrigger asChild>
						<span>
							{/* Renderiza Tooltip apenas quando o dropdown está fechado */}
							{!open ? (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											aria-expanded={open}
											className="hover:bg-transparent dark:hover:bg-transparent"
										>
											<Avatar className="h-8 w-8 rounded-full">
												<AvatarImage src={user.avatar} alt={user.name} />
												<AvatarFallback className="flex size-full items-center justify-center rounded-full bg-sidebar-primary text-white text-xs">
													CN
												</AvatarFallback>
											</Avatar>
										</Button>
									</TooltipTrigger>
									<TooltipContent hasArrow className="font-normal text-sm">
										Perfil
									</TooltipContent>
								</Tooltip>
							) : (
								/* Quando aberto, só o botão (sem tooltip) */
								<Button
									variant="ghost"
									size="icon"
									aria-expanded={open}
									className="hover:bg-transparent dark:hover:bg-transparent"
								>
									<Avatar className="h-8 w-8 rounded-full">
										<AvatarImage src={user.avatar} alt={user.name} />
										<AvatarFallback className="flex size-full items-center justify-center rounded-full bg-sidebar-primary text-white text-xs">
											CN
										</AvatarFallback>
									</Avatar>
								</Button>
							)}
						</span>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-lg p-1"
						align="end"
						sideOffset={16}
					>
						<DropdownMenuLabel className="p-2 font-normal">
							<div className="flex items-center gap-2 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-full">
									<AvatarImage src={user.avatar} alt={user.name} />
									<AvatarFallback className="flex size-full items-center justify-center rounded-full bg-sidebar-primary text-white text-xs">
										CN
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<span className="truncate text-muted-foreground text-xs">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem className="h-9 px-2.5">
								<BadgeCheck />
								Conta
							</DropdownMenuItem>
							<DropdownMenuItem className="h-9 px-2.5">
								<CreditCard />
								Configuração
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuItem variant="destructive" className="h-9 px-2.5">
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
