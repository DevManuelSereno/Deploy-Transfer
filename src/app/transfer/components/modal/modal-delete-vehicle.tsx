import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useVehicleFormContext } from "@/app/transfer/context/vehicle-context";
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
			toast.success("Veículo deletado com sucesso");
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
						<DialogTitle>Tem certeza</DialogTitle>
						<DialogDescription>
							Essa ação não pode ser desfeita. Isso excluirá permanentemente o
							veículo de nossos servidores.
						</DialogDescription>
					</DialogHeader>
				</div>
				<div className="text-sm px-6">
					<p className="mb-2 font-medium">Informações do veículo:</p>
					<div className="grid gap-2">
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">Modelo</p>
							<span className="text-foreground">{editingVehicle?.model}</span>
						</div>
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">Placa</p>
							<span className="text-foreground">{editingVehicle?.plate}</span>
						</div>
					</div>
				</div>
				<DialogFooter className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					{isLoadingDeleteVehicle ? (
						<Skeleton className="rounded-md w-full h-8" />
					) : (
						<Button
							variant="destructive"
							type="button"
							onClick={handleDeleteVehicle}
						>
							Excluir
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
