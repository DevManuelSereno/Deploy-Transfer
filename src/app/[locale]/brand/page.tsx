import { setRequestLocale } from "next-intl/server";
import TableBrand from "@/app/[locale]/brand/components/table/table-brand";

export default async function BrandPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<div className="flex flex-1 flex-col gap-6">
			<TableBrand />
		</div>
	);
}
