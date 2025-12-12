import { ModalTableVehicleProvider } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { VehicleFormProvider } from "@/app/[locale]/vehicle/context/vehicle-context";
import { DocumentationFormProvider } from "@/app/[locale]/vehicle/context/vehicle-documentation-context";
import { GasSupplyFormProvider } from "@/app/[locale]/vehicle/context/vehicle-gas-supply-context";
import { OccurrenceFormProvider } from "@/app/[locale]/vehicle/context/vehicle-occurrence-context";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<VehicleFormProvider>
			<DocumentationFormProvider>
				<GasSupplyFormProvider>
					<OccurrenceFormProvider>
						<ModalTableVehicleProvider>{children}</ModalTableVehicleProvider>
					</OccurrenceFormProvider>
				</GasSupplyFormProvider>
			</DocumentationFormProvider>
		</VehicleFormProvider>
	);
}
