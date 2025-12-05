import { BusFront, LucidePlus } from "lucide-react";
import { useTranslations } from "next-intl";
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
	const t = useTranslations("VehiclePage.Modal");

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/*<DialogTrigger asChild>*/}
			{/*	<Button>*/}
			{/*		<LucidePlus />*/}
			{/*		Adicionar*/}
			{/*	</Button>*/}
			{/*</DialogTrigger>*/}
			<DialogContent
				className="p-0 rounded-xl overflow-hidden gap-0 focus-visible:outline-none sm:max-w-4xl
        flex flex-col max-h-[90vh]"
			>
				<div className="flex items-center gap-3 p-6 flex-shrink-0">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-full border">
						<BusFront size={16} className="opacity-80" />
					</div>
					<DialogHeader>
						<DialogTitle>{t("title")}</DialogTitle>
						<DialogDescription>{t("description")}</DialogDescription>
					</DialogHeader>
				</div>
				{children}
			</DialogContent>
		</Dialog>
	);
}
