import { BrandFormProvider } from "@/app/brand/context/brand-context";
import { ModalTableBrandProvider } from "@/app/brand/context/modal-table-brand";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<BrandFormProvider>
			<ModalTableBrandProvider>{children}</ModalTableBrandProvider>
		</BrandFormProvider>
	);
}
