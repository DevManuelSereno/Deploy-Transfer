import TableVehicle from "@/app/components/table/table-vehicle";

export default async function Home() {
	return (
		<div className="flex flex-1 flex-col gap-6">
			<TableVehicle />
		</div>
	);
}
