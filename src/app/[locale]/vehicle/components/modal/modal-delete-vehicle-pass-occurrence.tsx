import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useOccurrenceFormContext } from "@/app/[locale]/vehicle/context/vehicle-pass-occurrence-context";
import { useVehiclePassFormContext } from "@/app/[locale]/vehicle/context/vehicle-pass-context";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteData, toastErrorsApi } from "@/lib/functions.api";
import type { DeleteData, OccurrenceType } from "@/types/models";

type ModalFormProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

export function ModalDeleteOccurrence({ open, setOpen }: ModalFormProps) {
	const t = useTranslations("VehiclePage.Occurrence.delete");
	const { editingOccurrence, setEditingOccurrence } =
		useOccurrenceFormContext();
	const { editingVehicle } = useVehiclePassFormContext();
	const queryClient = useQueryClient();

	const {
		mutateAsync: mutateDeleteOccurrence,
		isPending: isLoadingDeleteOccurrence,
	} = useMutation({
		mutationFn: (val: DeleteData) => deleteData<OccurrenceType>(val),
		mutationKey: ["occurrence-delete", editingOccurrence?.id],
	});

	const handleDeleteOccurrence = async () => {
		if (!editingOccurrence?.id) return;
		try {
			await mutateDeleteOccurrence({
				url: "/occurrence",
				id: editingOccurrence?.id,
			});

		if (editingVehicle)
			await queryClient.invalidateQueries({
				queryKey: ["occurrence-get", editingVehicle?.IDV],
			});

			setEditingOccurrence(undefined);
			toast.success(t("successMessage"));
			setOpen(false);
		} catch (error: any) {
			toastErrorsApi(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className={
					"p-0 rounded-xl overflow-hidden focus-visible:outline-none sm:max-w-lg gap-4 " +
					"flex flex-col max-h-[90vh]"
				}
			>
				<div className="flex items-center gap-3 flex-shrink-0 px-6 pt-6">
					<DialogHeader>
						<DialogTitle>{t("title")}</DialogTitle>
						<DialogDescription>{t("description")}</DialogDescription>
					</DialogHeader>
				</div>
				<div className="text-sm px-6">
					<p className="mb-2 font-medium">{t("infoTitle")}</p>
					<div className="grid gap-2">
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">{t("seriousness")}</p>
							<span className="text-foreground">
								{editingOccurrence?.seriousnessId}
							</span>
						</div>
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">
								{t("occurrenceDate")}
							</p>
							<span className="text-foreground">
								{editingOccurrence
									? new Date(
											editingOccurrence?.registerDate,
										).toLocaleDateString("pt-BR", {
											day: "2-digit",
											month: "2-digit",
											year: "numeric",
										})
									: "-"}
							</span>
						</div>
					</div>
				</div>
				<DialogFooter className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
					<DialogClose asChild>
						<Button variant="outline">{t("cancel")}</Button>
					</DialogClose>
					{isLoadingDeleteOccurrence ? (
						<Skeleton className="rounded-md w-full h-8" />
					) : (
						<Button
							variant="destructive"
							type="button"
							onClick={handleDeleteOccurrence}
						>
							{t("delete")}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}