import { ModalTableFuelingProvider } from "@/app/[locale]/fueling/context/modal-table-fueling";
import { FuelingFormProvider } from "@/app/[locale]/fueling/context/fueling-context";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<FuelingFormProvider>
			<ModalTableFuelingProvider>{children}</ModalTableFuelingProvider>
		</FuelingFormProvider>
	);
}
