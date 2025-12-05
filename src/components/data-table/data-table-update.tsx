import { RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function DataTableUpdate({
	handleUpdate,
}: {
	handleUpdate: () => void;
}) {
	const t = useTranslations("DataTable.DataTableUpdate");

	return (
		<Button size="default" variant="outline" onClick={handleUpdate}>
			<RotateCw />
			{t("update")}
		</Button>
	);
}
