import { Building2, BusFront, LucidePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

type ModalFormProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	children?: React.ReactNode;
};

export function ModalTableBrand({ open, setOpen, children }: ModalFormProps) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<LucidePlus />
					Adicionar
				</Button>
			</DialogTrigger>
			<DialogContent
				className="p-0 rounded-xl overflow-hidden gap-0 focus-visible:outline-none sm:max-w-4xl
        flex flex-col max-h-[90vh]"
			>
				<div className="flex items-center gap-3 p-6 flex-shrink-0">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-full border">
						<Building2 size={16} className="opacity-80" />
					</div>
					<DialogHeader>
						<DialogTitle>Nova marca</DialogTitle>
						<DialogDescription>
							Preencha os campos abaixo para cadastrar uma nova marca.
						</DialogDescription>
					</DialogHeader>
				</div>
				{children}
			</DialogContent>
		</Dialog>
	);
}
