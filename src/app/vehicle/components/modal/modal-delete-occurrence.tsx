import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useOccurrenceFormContext } from "@/app/vehicle/context/occurrence-context";
import { useVehicleFormContext } from "@/app/vehicle/context/vehicle-context";
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
	const { editingOccurrence, setEditingOccurrence } =
		useOccurrenceFormContext();
	const { editingVehicle } = useVehicleFormContext();
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
					queryKey: ["occurrence-get", editingVehicle?.id],
				});

			setEditingOccurrence(undefined);
			toast.success("Ocorrência deletado com sucesso");
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
					<p className="mb-2 font-medium">Informações da ocorrência:</p>
					<div className="grid gap-2">
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">Seriedade</p>
							<span className="text-foreground">
								{editingOccurrence?.seriousnessId}
							</span>
						</div>
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">Registrada em</p>
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
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					{isLoadingDeleteOccurrence ? (
						<Skeleton className="rounded-md w-full h-8" />
					) : (
						<Button
							variant="destructive"
							type="button"
							onClick={handleDeleteOccurrence}
						>
							Excluir
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
