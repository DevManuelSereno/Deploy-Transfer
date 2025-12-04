import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
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

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;

	// Validate that the incoming `locale` parameter is valid
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	// Enable static rendering
	setRequestLocale(locale);
	const messages = await getMessages();
	const sidebarState = (await cookies()).get("sidebar_state")?.value;
	const defaultOpen =
		sidebarState === undefined ? true : sidebarState === "true";

	return (
		<NextIntlClientProvider messages={messages}>
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
							<div className="flex flex-1 flex-col">{children}</div>
						</div>
					</SidebarInset>
				</SidebarProvider>
				<Toaster />
			</Providers>
		</NextIntlClientProvider>
	);
}
