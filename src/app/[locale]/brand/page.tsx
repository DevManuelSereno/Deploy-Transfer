import TableBrand from "@/app/[locale]/brand/components/table/table-brand";

export default async function BrandPage() {
	return (
		<div className="flex flex-col p-6">
			<TableBrand />
		</div>
	);
}
