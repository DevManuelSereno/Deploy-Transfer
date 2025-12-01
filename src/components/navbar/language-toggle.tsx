"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";

export function LanguageToggle() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const t = useTranslations("LanguageToggle");

	const handleLanguageChange = (newLocale: string) => {
		router.replace(pathname, { locale: newLocale });
	};

	const getLanguageLabel = (locale: string) => {
		switch (locale) {
			case "pt-br":
				return t("portuguese");
			case "en-us":
				return t("english");
			case "es-es":
				return t("spanish");
			default:
				return t("portuguese");
		}
	};

	return (
		<Select value={locale} onValueChange={handleLanguageChange}>
			<SelectTrigger className="w-fit rounded-full border-none hover:bg-input/30">
				<Globe />
				{getLanguageLabel(locale)}
			</SelectTrigger>
			<SelectContent className="bg-background">
				<SelectItem value="pt-br">{t("portuguese")}</SelectItem>
				<SelectItem value="en-us">{t("english")}</SelectItem>
				<SelectItem value="es-es">{t("spanish")}</SelectItem>
			</SelectContent>
		</Select>
	);
}
