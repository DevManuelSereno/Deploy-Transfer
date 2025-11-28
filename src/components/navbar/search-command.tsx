"use client";

import {
	Calculator,
	Calendar,
	CreditCard,
	Search,
	Settings,
	Smile,
	User,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function SearchCommand() {
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	function handleOpenCommandDialog() {
		setOpen(true);
	}

	return (
		<>
			<Tooltip>
				<TooltipTrigger
					onClick={handleOpenCommandDialog}
					className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 px-4 py-2 has-[>svg]:px-3 group size-9 rounded-full @4xl/main:w-[200px] @4xl/main:border @4xl/main:rounded-md @5xl/main:w-[300px] @4xl/main:shadow-xs"
				>
					<span className="flex grow items-center">
						<Search className="size-4 text-muted-foreground/80 group-hover:text-foreground @4xl/main:-ms-1 @4xl/main:me-3" />
						<span className="hidden @4xl/main:block text-muted-foreground/70 font-normal">
							Buscar...
						</span>
					</span>
					<kbd className="hidden bg-background text-muted-foreground/70 ms-12 -me-1 @4xl/main:inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] leading-0 font-medium">
						CTRL+K
					</kbd>
					{/*<InputGroup className="bg-input/50">*/}
					{/*	<InputGroupInput placeholder="Buscar..." />*/}
					{/*	<InputGroupAddon>*/}
					{/*		<Search />*/}
					{/*	</InputGroupAddon>*/}
					{/*	<InputGroupAddon align="inline-end">*/}

					{/*	</InputGroupAddon>*/}
					{/*</InputGroup>*/}
				</TooltipTrigger>
				<TooltipContent>Buscar</TooltipContent>
			</Tooltip>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Digite um comando para buscar..." />
				<CommandList>
					<CommandEmpty>Nenhum resultado.</CommandEmpty>
					<CommandGroup heading="Suggestions">
						<CommandItem>
							<Calendar />
							<span>Calendar</span>
						</CommandItem>
						<CommandItem>
							<Smile />
							<span>Search Emoji</span>
						</CommandItem>
						<CommandItem>
							<Calculator />
							<span>Calculator</span>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Settings">
						<CommandItem>
							<User />
							<span>Profile</span>
							<CommandShortcut>⌘P</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<CreditCard />
							<span>Billing</span>
							<CommandShortcut>⌘B</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<Settings />
							<span>Settings</span>
							<CommandShortcut>⌘S</CommandShortcut>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
