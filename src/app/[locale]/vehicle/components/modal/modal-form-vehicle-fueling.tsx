"use client";

import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormFuelingData } from "@/app/[locale]/fueling/components/form/form-fueling-data";
import { useFuelingFormContext } from "@/app/[locale]/fueling/context/fueling-context";
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

type ModalFormProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	children?: React.ReactNode;
};

export function ModalFormFueling({ open, setOpen }: ModalFormProps) {
	const t = useTranslations("VehiclePage.Fueling.modal");
	const tForm = useTranslations("Form");
	const { editingFueling } = useFuelingFormContext();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className="p-0 rounded-xl overflow-hidden gap-0 focus-visible:outline-none sm:max-w-3xl
        flex flex-col max-h-[90vh]"
			>
				<div className="flex items-center gap-3 p-6 shrink-0">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-full border">
						<FileText />
					</div>
					<DialogHeader>
						<DialogTitle>{t("title")}</DialogTitle>
						<DialogDescription>{t("description")}</DialogDescription>
					</DialogHeader>
				</div>

				<FormFuelingData editingFueling={editingFueling} />
				<DialogFooter className="flex gap-4 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 pt-6 pb-4">
					<DialogClose asChild>
						<Button variant="outline">{tForm("cancel")}</Button>
					</DialogClose>

					<Button type="submit" form="fueling-form">
						{tForm("register")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
