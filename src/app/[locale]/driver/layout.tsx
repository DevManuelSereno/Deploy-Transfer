import { ModalTableDriverProvider } from "@/app/[locale]/driver/context/modal-table-driver";
import { DriverFormProvider } from "@/app/[locale]/driver/context/driver-context";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<DriverFormProvider>
			<ModalTableDriverProvider>{children}</ModalTableDriverProvider>
		</DriverFormProvider>
	);
}
