"use client";
import { UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "@/components/navbar/language-toggle";
import { NavUser } from "@/components/navbar/nav-user";
import { PassApps } from "@/components/navbar/pass-apps";
import { SearchCommand } from "@/components/navbar/search-command";
import { ThemeToggle } from "@/components/navbar/theme-toggle";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "@/i18n/navigation";
import { navbarItems } from "@/lib/sidebar-menu-list";

export function AppNavbar() {
	const pathname = usePathname();
	const t = useTranslations("Navbar");

	function getLabelByPathname(pathname: string) {
		let key: string | undefined;
		const allItems = Object.values(navbarItems).flat();

		for (const category of allItems) {
			if (category.url === pathname) {
				key = category.key;
				break;
			}
		}
		if (key) return t(key as any);

		return t("defaultTitle");
	}

	return (
		<div className="flex w-full items-center justify-between px-4 @4xl/main:px-6">
			<div className="flex items-center gap-1">
				<SidebarTrigger className="-ml-1 rounded-full size-9 [&>svg]:text-muted-foreground/80 hover:[&>svg]:text-foreground" />
				<Separator
					orientation="vertical"
					className="mx-1.5 sm:mx-2.5 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbPage>{getLabelByPathname(pathname)}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="hidden @4xl/main:block">
				<SearchCommand />
			</div>
			<div className="flex items-center gap-2 sm:gap-2.5">
				<ThemeToggle />
				<LanguageToggle />
				<PassApps />
				<NavUser
					user={{
						avatar: "UserIcon",
						name: "Jonathan Doe",
						email: "jonathandoe@example.com",
					}}
				/>
			</div>
		</div>
	);
}
