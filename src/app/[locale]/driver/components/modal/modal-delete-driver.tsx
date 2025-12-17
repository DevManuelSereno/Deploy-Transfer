"use client";

import { useTranslations } from "next-intl";
import { useDriverFormContext } from "@/app/[locale]/driver/context/driver-context";
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

interface ModalDeleteDriverProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export function ModalDeleteDriver({ open, setOpen }: ModalDeleteDriverProps) {
	const t = useTranslations("DriverPage.Delete");
	const { editingDriver, setEditingDriver } = useDriverFormContext();

	const handleDelete = () => {
		// Delete logic will be implemented here
		console.log("Deleting driver:", editingDriver);

		toast.success({
			title: t("successMessage"),
		});

		setOpen(false);
		setEditingDriver(undefined);
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
					<div className="grid gap-2">
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">{t("name")}</p>
							<span className="text-foreground">
								{`${editingDriver?.FirstName} ${editingDriver?.LastName}`}
							</span>
						</div>
						<div className="truncate">
							<p className="mb-0.5 text-muted-foreground">{t("email")}</p>
							<span className="text-foreground">{editingDriver?.Email}</span>
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
