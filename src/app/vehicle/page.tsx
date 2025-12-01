import TableVehicle from "@/app/vehicle/components/table/table-vehicle";

export default async function VehiclePage() {
	return (
		<div className="flex flex-1 flex-col gap-6">
			<TableVehicle />
		</div>
	);
}
