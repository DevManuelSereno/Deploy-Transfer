import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
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
import { cn } from "@/lib/utils";

type ModalFormProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	children?: React.ReactNode;
};

export function ModalTableDocumentation({ open, setOpen, children }: ModalFormProps) {
	const t = useTranslations("DocumentationPage.Modal");
	const tForm = useTranslations("Form");

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className={cn(
					"flex flex-col gap-0 p-0 rounded-xl sm:max-w-2xl! max-h-[calc(100dvh-2rem)] overflow-hidden",
				)}
			>
				<div className="flex items-center gap-3 px-6 pt-6 mb-4">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-full border">
						<FileText size={16} className="opacity-80" />
					</div>
					<DialogHeader className="gap-1">
						<DialogTitle>{t("title")}</DialogTitle>
						<DialogDescription>{t("description")}</DialogDescription>
					</DialogHeader>
				</div>
				{children}
				<DialogFooter className="flex gap-4 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 pt-6 pb-4">
					<DialogClose asChild>
						<Button variant="outline">{tForm("cancel")}</Button>
					</DialogClose>

					<Button type="submit" form="documentation-form">
						{tForm("register")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
