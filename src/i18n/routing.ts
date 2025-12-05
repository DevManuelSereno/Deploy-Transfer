import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["pt-br", "en-us", "es-es"],
	defaultLocale: "pt-br",
});
