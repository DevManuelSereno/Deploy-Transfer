import { ChevronDownIcon, DownloadCloud } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function DataTableExport() {
	const t = useTranslations("DataTable.DataTableExport");

	return (
		<div className="inline-flex rounded-md shadow-xs">
			<Button
				variant="outline"
				className="rounded-none shadow-none first:border-r-0 first:rounded-s-md last:rounded-e-md focus-visible:z-10"
			>
				<DownloadCloud />
				{t("export")}
			</Button>
			<Button
				variant="outline"
				className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
				size="icon"
				aria-label="Options"
			>
				<ChevronDownIcon size={16} aria-hidden="true" />
			</Button>
		</div>
	);
}
