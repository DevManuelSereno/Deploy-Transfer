import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import TableDocumentation from "@/app/[locale]/documentation/components/table/table-documentation";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Sidebar");

	return {
		title: t("items.documentation"),
	};
}

export default async function DocumentationPage() {
	return (
		<div className="flex flex-col">
			<TableDocumentation />
		</div>
	);
}
