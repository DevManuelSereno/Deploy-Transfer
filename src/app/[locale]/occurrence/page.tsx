import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import TableOccurrence from "@/app/[locale]/occurrence/components/table/table-occurrence";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Sidebar");

	return {
		title: t("items.occurrence"),
	};
}

export default async function OccurrencePage() {
	return (
		<div className="flex flex-col p-6">
			<TableOccurrence />
		</div>
	);
}
