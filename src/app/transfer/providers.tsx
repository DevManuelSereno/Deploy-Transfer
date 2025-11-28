import { DocumentationFormProvider } from "@/app/transfer/context/documentation-context";
import { GasSupplyFormProvider } from "@/app/transfer/context/gas-supply-context";
import { ModalProvider } from "@/app/transfer/context/modal-context";
import { OccurrenceFormProvider } from "@/app/transfer/context/occurrence-context";
import { VehicleFormProvider } from "@/app/transfer/context/vehicle-context";

export default async function Providers({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<VehicleFormProvider>
			<DocumentationFormProvider>
				<OccurrenceFormProvider>
					<GasSupplyFormProvider>
						<ModalProvider>{children}</ModalProvider>
					</GasSupplyFormProvider>
				</OccurrenceFormProvider>
			</DocumentationFormProvider>
		</VehicleFormProvider>
	);
}
