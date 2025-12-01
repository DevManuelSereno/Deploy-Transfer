import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { AppNavbar } from "@/components/navbar/app-navbar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Transfer",
	description: "Pass",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();
	const sidebarState = (await cookies()).get("sidebar_state")?.value;
	const defaultOpen =
		sidebarState === undefined ? true : sidebarState === "true";

	return (
		<html suppressHydrationWarning lang={locale}>
			<body className={`${geistSans.className}  antialiased font-medium`}>
				<NextIntlClientProvider>
					<Providers>
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
									<div className="flex flex-col p-6">{children}</div>
								</div>
							</SidebarInset>
						</SidebarProvider>
						<Toaster />
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
