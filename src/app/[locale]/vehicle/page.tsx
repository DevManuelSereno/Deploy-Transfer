import { getTranslations } from "next-intl/server";
import TableVehicle from "@/app/[locale]/vehicle/components/table/table-vehicle";

export async function generateMetadata() {
	const t = await getTranslations("Sidebar");

	return {
		title: t("items.vehicles"),
	};
}

export default async function VehiclePage() {
	return (
		<div className="flex flex-col p-6">
			<TableVehicle />
		</div>
	);
}
