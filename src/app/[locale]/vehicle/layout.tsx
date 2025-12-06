import { ModalTableVehiclePassProvider } from "@/app/[locale]/vehicle/context/modal-table-vehicle-pass";
import { VehiclePassFormProvider } from "@/app/[locale]/vehicle/context/vehicle-pass-context";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<VehiclePassFormProvider>
			<ModalTableVehiclePassProvider>{children}</ModalTableVehiclePassProvider>
		</VehiclePassFormProvider>
	);
}
