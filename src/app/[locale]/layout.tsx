import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { type Locale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AppNavbar } from "@/components/navbar/app-navbar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		template: "%s | Transfer",
		default: "Transfer",
	},
	description:
		"Sistema completo para gestão de logística de passageiros, ideal para empresas de turismo, transporte corporativo e eventos.",
};

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;

	if (!routing.locales.includes(locale as Locale)) {
		notFound();
	}

	// Enable static rendering
	const messages = await getMessages();
	const sidebarState = (await cookies()).get("sidebar_state")?.value;
	const defaultOpen =
		sidebarState === undefined ? true : sidebarState === "true";

	return (
		<html lang={locale} suppressHydrationWarning>
			<body
				className={`${geistSans.className}  antialiased font-medium`}
				suppressHydrationWarning
			>
				<NextIntlClientProvider messages={messages}>
					<Providers>
						<SidebarProvider defaultOpen={defaultOpen}>
							<AppSidebar variant="inset" />
							<SidebarInset>
								<div className="@container/main overflow-y-auto">
									<header
										className={cn(
											"sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2",
											"rounded-t-xl border-b bg-background/90 backdrop-blur-xs transition-[width,height] ease-linear",
										)}
									>
										<AppNavbar />
									</header>
									<div className="flex flex-1 flex-col p-2 sm:p-4 md:p-6">
										{children}
									</div>
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
