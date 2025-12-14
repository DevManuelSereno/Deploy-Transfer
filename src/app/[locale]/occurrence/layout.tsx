import { ModalTableOccurrenceProvider } from "@/app/[locale]/occurrence/context/modal-table-occurrence";
import { OccurrenceFormProvider } from "@/app/[locale]/occurrence/context/occurrence-context";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<OccurrenceFormProvider>
			<ModalTableOccurrenceProvider>{children}</ModalTableOccurrenceProvider>
		</OccurrenceFormProvider>
	);
}
