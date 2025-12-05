"use client";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryClientProvider } from "./query-client-provider";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
		</QueryClientProvider>
	);
}
