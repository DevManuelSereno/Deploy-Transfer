import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import TableDriver from "@/app/[locale]/driver/components/table/table-driver";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Sidebar");

	return {
		title: t("items.driver"),
	};
}

export default async function DriverPage() {
	return (
		<div className="flex flex-col">
			<TableDriver />
		</div>
	);
}
