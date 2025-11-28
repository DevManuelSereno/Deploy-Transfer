import { cookies } from "next/headers";
import { AppNavbar } from "@/components/navbar/app-navbar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Providers from "./providers";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const sidebarState = (await cookies()).get("sidebar_state")?.value;

	const defaultOpen =
		sidebarState === undefined ? true : sidebarState === "true";
	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<div className="@container/main min-[56rem]:overflow-y-auto">
					<header
						className={cn(
							"sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2",
							"rounded-t-xl border-b bg-background/90 backdrop-blur-xs transition-[width,height] ease-linear",
						)}
					>
						<AppNavbar />
					</header>
					<Providers>
						<div className="flex flex-col p-6">{children}</div>
					</Providers>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
