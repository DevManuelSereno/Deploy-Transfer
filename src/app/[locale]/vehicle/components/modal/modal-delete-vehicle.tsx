import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
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
import type { DeleteData, VehicleType } from "@/types/models";

type ModalFormProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

export function ModalDeleteVehicle({ open, setOpen }: ModalFormProps) {
	const t = useTranslations("VehiclePage.Delete");
	const { editingVehicle } = useVehicleFormContext();

	const queryClient = useQueryClient();

	const {
		mutateAsync: mutateDeleteVehicle,
		isPending: isLoadingDeleteVehicle,
	} = useMutation({
		mutationFn: (val: DeleteData) => deleteData<VehicleType>(val),
		mutationKey: ["vehicle-delete", editingVehicle?.id],
	});

	const handleDeleteVehicle = async () => {
		if (!editingVehicle?.id) return;
		try {
			await mutateDeleteVehicle({
				url: "/vehicle",
				id: editingVehicle?.id,
			});
			toast.success(t("successMessage"));
			await queryClient.invalidateQueries({ queryKey: ["vehicle-get"] });
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
					<p className="mb-2 font-medium">{t("vehicleInfo")}</p>
					<div className="grid gap-2">
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">{t("model")}</p>
							<span className="text-foreground">{editingVehicle?.model}</span>
						</div>
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">{t("plate")}</p>
							<span className="text-foreground">{editingVehicle?.plate}</span>
						</div>
					</div>
				</div>
				<DialogFooter className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
					<DialogClose asChild>
						<Button variant="outline">{t("cancel")}</Button>
					</DialogClose>
					{isLoadingDeleteVehicle ? (
						<Skeleton className="rounded-md w-full h-8" />
					) : (
						<Button
							variant="destructive"
							type="button"
							onClick={handleDeleteVehicle}
						>
							{t("delete")}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
