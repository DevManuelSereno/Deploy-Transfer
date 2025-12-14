import { ModalTableVehicleProvider } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { VehicleFormProvider } from "@/app/[locale]/vehicle/context/vehicle-context";
import { DocumentationFormProvider } from "@/app/[locale]/vehicle/context/vehicle-documentation-context";
import { FuelingFormProvider } from "@/app/[locale]/vehicle/context/vehicle-fueling-context";
import { OccurrenceFormProvider } from "@/app/[locale]/vehicle/context/vehicle-occurrence-context";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<VehicleFormProvider>
			<DocumentationFormProvider>
				<FuelingFormProvider>
					<OccurrenceFormProvider>
						<ModalTableVehicleProvider>{children}</ModalTableVehicleProvider>
					</OccurrenceFormProvider>
				</FuelingFormProvider>
			</DocumentationFormProvider>
		</VehicleFormProvider>
	);
}
