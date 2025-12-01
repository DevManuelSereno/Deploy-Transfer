import { BusFront, LucidePlus } from "lucide-react";
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

export function ModalTableVehicle({ open, setOpen, children }: ModalFormProps) {
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
						<BusFront size={16} className="opacity-80" />
					</div>
					<DialogHeader>
						<DialogTitle>Novo veículo</DialogTitle>
						<DialogDescription>
							Preencha os campos abaixo para cadastrar um novo véiculo.
						</DialogDescription>
					</DialogHeader>
				</div>
				{children}
			</DialogContent>
		</Dialog>
	);
}
