import { ModalTableVehiclePassProvider } from "@/app/[locale]/vehicle/context/modal-table-vehicle-pass";
import { VehiclePassFormProvider } from "@/app/[locale]/vehicle/context/vehicle-pass-context";
import { DocumentationFormProvider } from "@/app/[locale]/vehicle/context/vehicle-pass-documentation-context";
import { GasSupplyFormProvider } from "@/app/[locale]/vehicle/context/vehicle-pass-gas-supply-context";
import { OccurrenceFormProvider } from "@/app/[locale]/vehicle/context/vehicle-pass-occurrence-context";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<VehiclePassFormProvider>
			<DocumentationFormProvider>
				<GasSupplyFormProvider>
					<OccurrenceFormProvider>
						<ModalTableVehiclePassProvider>
							{children}
						</ModalTableVehiclePassProvider>
					</OccurrenceFormProvider>
				</GasSupplyFormProvider>
			</DocumentationFormProvider>
		</VehiclePassFormProvider>
	);
}
