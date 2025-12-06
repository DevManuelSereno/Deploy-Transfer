import { getTranslations } from "next-intl/server";
import TableVehiclePass from "@/app/[locale]/vehicle/components/table/table-vehicle-pass";

export async function generateMetadata() {
	const t = await getTranslations("Sidebar");

	return {
		title: t("items.vehicles"),
	};
}

export default async function VehiclePage() {
	return (
		<div className="flex flex-col p-6">
			<TableVehiclePass />
		</div>
	);
}
