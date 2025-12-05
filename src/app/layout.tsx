import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Transfer",
    default: "Transfer",
  },
  description: "Sistema completo para gestão de logística de passageiros, ideal para empresas de turismo, transporte corporativo e eventos.",
};

export default async function RootLayout({
	children,
	 params,
}: Readonly<{
	children: React.ReactNode;
	 params: Promise<{ locale: string }>
}>) {
	 const { locale } = await params
	return (
		<html lang={locale} suppressHydrationWarning >
			<body className={`${geistSans.className}  antialiased font-medium`} suppressHydrationWarning>
				{children}
			</body>
		</html>
	);
}
