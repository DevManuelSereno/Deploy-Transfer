import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useGasSupplyFormContext } from "@/app/[locale]/vehicle/context/gas-supply-context";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
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
import type { DeleteData, GasSupplyType } from "@/types/models";

type ModalFormProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

export function ModalDeleteGasSupply({ open, setOpen }: ModalFormProps) {
	const t = useTranslations("VehiclePage.GasSupply.delete");
	const { editingGasSupply, setEditingGasSupply } = useGasSupplyFormContext();
	const { editingVehicle } = useVehicleFormContext();
	const queryClient = useQueryClient();

	const {
		mutateAsync: mutateDeleteGasSupply,
		isPending: isLoadingDeleteGasSupply,
	} = useMutation({
		mutationFn: (val: DeleteData) => deleteData<GasSupplyType>(val),
		mutationKey: ["gas-supply-delete", editingGasSupply?.id],
	});

	const handleDeleteGasSupply = async () => {
		if (!editingGasSupply?.id) return;
		try {
			await mutateDeleteGasSupply({
				url: "/gasSupply",
				id: editingGasSupply?.id,
			});

			if (editingVehicle)
				await queryClient.invalidateQueries({
					queryKey: ["gas-supply-get", editingVehicle?.id],
				});

			setEditingGasSupply(undefined);
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
							<p className="mb-0.5 text-muted-foreground">{t("supplyDate")}</p>
							<span className="text-foreground">
								{editingGasSupply
									? new Date(editingGasSupply?.supplyAt).toLocaleDateString(
											"pt-BR",
											{
												day: "2-digit",
												month: "2-digit",
												year: "numeric",
											},
										)
									: "-"}
							</span>
						</div>
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">{t("station")}</p>
							<span className="text-foreground">
								{editingGasSupply?.gasStation?.name || "-"}
							</span>
						</div>
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">{t("fuel")}</p>
							<span className="text-foreground">
								{editingGasSupply?.gas?.type || "-"}
							</span>
						</div>
					</div>
				</div>
				<DialogFooter className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
					<DialogClose asChild>
						<Button variant="outline">{t("cancel")}</Button>
					</DialogClose>
					{isLoadingDeleteGasSupply ? (
						<Skeleton className="rounded-md w-full h-8" />
					) : (
						<Button
							variant="destructive"
							type="button"
							onClick={handleDeleteGasSupply}
						>
							{t("delete")}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
