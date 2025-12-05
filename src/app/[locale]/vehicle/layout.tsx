import { DocumentationFormProvider } from "@/app/[locale]/vehicle/context/documentation-context";
import { GasSupplyFormProvider } from "@/app/[locale]/vehicle/context/gas-supply-context";
import { ModalTableVehicleProvider } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { OccurrenceFormProvider } from "@/app/[locale]/vehicle/context/occurrence-context";
import { VehicleFormProvider } from "@/app/[locale]/vehicle/context/vehicle-context";

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
