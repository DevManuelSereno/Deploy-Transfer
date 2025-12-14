"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormOccurrenceData } from "@/app/[locale]/occurrence/components/form/form-occurrence-data";
import { useOccurrenceFormContext } from "@/app/[locale]/occurrence/context/occurrence-context";
import type {
	OccurrenceData,
	OccurrenceForm,
	OccurrencePayload,
} from "@/app/[locale]/occurrence/types/types-occurrence";
import {
	OccurrenceFormSchema,
	OccurrencePayloadSchema,
} from "@/app/[locale]/occurrence/validation/validation-occurrence";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import { FormErrorMessage } from "@/components/form/form-error-message";
import { FormFieldDate } from "@/components/form/form-field-date";
import { FormFieldSelect } from "@/components/form/form-field-select";
import { FormFieldText } from "@/components/form/form-field-text";
import { FormFieldTextarea } from "@/components/form/form-field-text-area";
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
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { postData, putData, toastErrorsApi } from "@/lib/functions.api";
import { cn } from "@/lib/utils";
import type { PostData, PutData } from "@/types/models";

type ModalFormProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	children?: React.ReactNode;
};

export function ModalFormOccurrence({ open, setOpen }: ModalFormProps) {
	const t = useTranslations("VehiclePage.Occurrence.modal");
	const tForm = useTranslations("Form");
	const { editingOccurrence, setEditingOccurrence } =
		useOccurrenceFormContext();

	const { editingVehicle } = useVehicleFormContext();

	const { setTabPanel } = useModalContext();

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
				<FormOccurrenceData />
				<DialogFooter className="flex gap-4 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 pt-6 pb-4">
					<DialogClose asChild>
						<Button variant="outline">{tForm("cancel")}</Button>
					</DialogClose>

					<Button type="submit" form="occurrence-form">
						{tForm("register")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
