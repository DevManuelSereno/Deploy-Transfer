import { setRequestLocale } from "next-intl/server";
import TableVehicle from "@/app/[locale]/vehicle/components/table/table-vehicle";

export default async function VehiclePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<div className="flex flex-1 flex-col gap-6">
			<TableVehicle />
		</div>
	);
}
