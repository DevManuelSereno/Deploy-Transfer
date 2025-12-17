"use client";

import { useTranslations } from "next-intl";
import { useDocumentationFormContext } from "@/app/[locale]/documentation/context/documentation-context";
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
import { toast } from "@/components/ui/sonner";

interface ModalDeleteDocumentationProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export function ModalDeleteDocumentation({ open, setOpen }: ModalDeleteDocumentationProps) {
	const t = useTranslations("DocumentationPage.Delete");
	const { editingDocumentation, setEditingDocumentation } = useDocumentationFormContext();

	const handleDelete = () => {
		console.log("Deleting documentation:", editingDocumentation);

		toast.success({
			title: t("successMessage"),
		});

		setOpen(false);
		setEditingDocumentation(undefined);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className={
					"p-0 rounded-xl overflow-hidden focus-visible:outline-none sm:max-w-lg gap-4 " +
					"flex flex-col max-h-[90vh]"
				}
			>
				<div className="flex items-center gap-3 p-6">
					<DialogHeader>
						<DialogTitle>{t("title")}</DialogTitle>
						<DialogDescription>{t("description")}</DialogDescription>
					</DialogHeader>
				</div>
				<div className="text-sm px-6">
					<p className="mb-2 font-medium">{t("documentationInfo")}</p>
					<div className="grid gap-2">
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">{t("type")}</p>
						<span className="text-foreground">
							{editingDocumentation?.Type || "-"}
						</span>
						</div>
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">{t("expiryDate")}</p>
						<span className="text-foreground">
							{editingDocumentation?.ExpiryAt
								? new Date(editingDocumentation.ExpiryAt).toLocaleDateString(
										"pt-BR",
									)
								: "-"}
						</span>
						</div>
					</div>
				</div>
				<DialogFooter className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
					<DialogClose asChild>
						<Button variant="outline">{t("cancel")}</Button>
					</DialogClose>
					<Button variant="destructive" type="button" onClick={handleDelete}>
						{t("delete")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
