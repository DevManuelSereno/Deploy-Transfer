import { setRequestLocale } from "next-intl/server";

export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	

	return (
		<div className="flex flex-1 flex-col gap-6">
			<h1>Dashboard</h1>
			{/*<TableVehicle />*/}
		</div>
	);
}
