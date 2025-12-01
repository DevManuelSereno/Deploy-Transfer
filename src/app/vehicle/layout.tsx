import { DocumentationFormProvider } from "@/app/vehicle/context/documentation-context";
import { GasSupplyFormProvider } from "@/app/vehicle/context/gas-supply-context";
import { ModalTableVehicleProvider } from "@/app/vehicle/context/modal-table-vehicle";
import { OccurrenceFormProvider } from "@/app/vehicle/context/occurrence-context";
import { VehicleFormProvider } from "@/app/vehicle/context/vehicle-context";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<VehicleFormProvider>
			<DocumentationFormProvider>
				<OccurrenceFormProvider>
					<GasSupplyFormProvider>
						<ModalTableVehicleProvider>{children}</ModalTableVehicleProvider>
					</GasSupplyFormProvider>
				</OccurrenceFormProvider>
			</DocumentationFormProvider>
		</VehicleFormProvider>
	);
}
