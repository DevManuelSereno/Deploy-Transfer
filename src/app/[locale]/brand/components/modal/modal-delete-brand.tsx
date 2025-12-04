import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useBrandFormContext } from "@/app/[locale]/brand/context/brand-context";
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
import type { BrandType, DeleteData } from "@/types/models";

type ModalFormProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

export function ModalDeleteBrand({ open, setOpen }: ModalFormProps) {
	const { editingBrand } = useBrandFormContext();

	const queryClient = useQueryClient();

	const { mutateAsync: mutateDeleteBrand, isPending: isLoadingDeleteBrand } =
		useMutation({
			mutationFn: (val: DeleteData) => deleteData<BrandType>(val),
			mutationKey: ["brand-delete", editingBrand?.id],
		});

	const handleDeleteBrand = async () => {
		if (!editingBrand?.id) return;
		try {
			await mutateDeleteBrand({
				url: "/brand",
				id: editingBrand?.id,
			});
			toast.success("Marca deletada com sucesso");
			await queryClient.invalidateQueries({ queryKey: ["brand-get"] });
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
							Essa ação não pode ser desfeita. Isso excluirá permanentemente a
							marca de nossos servidores.
						</DialogDescription>
					</DialogHeader>
				</div>
				<div className="text-sm px-6">
					<p className="mb-2 font-medium">Informações da marca:</p>
					<div className="grid gap-2">
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">Nome</p>
							<span className="text-foreground">{editingBrand?.name}</span>
						</div>
					</div>
				</div>
				<DialogFooter className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					{isLoadingDeleteBrand ? (
						<Skeleton className="rounded-md w-full h-8" />
					) : (
						<Button
							variant="destructive"
							type="button"
							onClick={handleDeleteBrand}
						>
							Excluir
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
