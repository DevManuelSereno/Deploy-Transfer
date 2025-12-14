import { getTranslations } from "next-intl/server";
import TableFueling from "@/app/[locale]/fueling/components/table/table-fueling";

export async function generateMetadata() {
	const t = await getTranslations("Sidebar");

	return {
		title: t("items.refueling"),
	};
}

export default async function FuelingPage() {
	return (
		<div className="flex flex-col p-6">
			<TableFueling />
		</div>
	);
}
