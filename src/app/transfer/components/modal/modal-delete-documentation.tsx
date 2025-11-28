import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDocumentationFormContext } from "@/app/transfer/context/documentation-context";
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
import type { DeleteData, DocumentationType } from "@/types/models";

type ModalFormProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

export function ModalDeleteDocumentation({ open, setOpen }: ModalFormProps) {
	const { editingDocumentation, setEditingDocumentation } =
		useDocumentationFormContext();
	const { editingVehicle } = useVehicleFormContext();
	const queryClient = useQueryClient();

	const {
		mutateAsync: mutateDeleteDocumentation,
		isPending: isLoadingDeleteDocumentation,
	} = useMutation({
		mutationFn: (val: DeleteData) => deleteData<DocumentationType>(val),
		mutationKey: ["documentation-delete", editingDocumentation?.id],
	});

	const handleDeleteDocumentation = async () => {
		if (!editingDocumentation?.id) return;
		try {
			await mutateDeleteDocumentation({
				url: "/documentation",
				id: editingDocumentation?.id,
			});

			if (editingVehicle)
				await queryClient.invalidateQueries({
					queryKey: ["documentation-get", editingVehicle?.id],
				});

			setEditingDocumentation(undefined);
			toast.success("Documento deletado com sucesso");
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
							<p className="mb-0.5 text-muted-foreground">Tipo</p>
							<span className="text-foreground">
								{editingDocumentation?.type}
							</span>
						</div>
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">Vencimento</p>
							<span className="text-foreground">
								{editingDocumentation
									? new Date(editingDocumentation?.expiryAt).toLocaleDateString(
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
					</div>
				</div>
				<DialogFooter className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					{isLoadingDeleteDocumentation ? (
						<Skeleton className="rounded-md w-full h-8" />
					) : (
						<Button
							variant="destructive"
							type="button"
							onClick={handleDeleteDocumentation}
						>
							Excluir
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
