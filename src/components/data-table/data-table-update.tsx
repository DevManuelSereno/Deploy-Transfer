import { RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function DataTableUpdate() {
	const t = useTranslations("DataTable.DataTableUpdate");

	return (
		<Button size="default" variant="outline">
			<RotateCw />
			{t("update")}
		</Button>
	);
}
