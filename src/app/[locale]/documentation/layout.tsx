import { ModalTableDocumentationProvider } from "@/app/[locale]/documentation/context/modal-table-documentation";
import { DocumentationFormProvider } from "@/app/[locale]/documentation/context/documentation-context";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<DocumentationFormProvider>
			<ModalTableDocumentationProvider>{children}</ModalTableDocumentationProvider>
		</DocumentationFormProvider>
	);
}
