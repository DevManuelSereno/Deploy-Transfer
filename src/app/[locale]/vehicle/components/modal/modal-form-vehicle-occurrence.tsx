"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookmarkIcon, BusFront, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Controller, FieldValue, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import { useOccurrenceFormContext } from "@/app/[locale]/vehicle/context/vehicle-occurrence-context";
import { useOccurrenceFormOptions } from "@/app/[locale]/vehicle/hooks/use-vehicle-form-occurrence-options";
import type {
	OccurrenceData,
	OccurrenceForm,
	OccurrencePayload,
} from "@/app/[locale]/vehicle/types/types-vehicle-occurrence";
import {
	OccurrenceFormSchema,
	OccurrencePayloadSchema,
} from "@/app/[locale]/vehicle/validation/validation-vehicle-occurrence";
import { FormFieldDateRange } from "@/components/form/form-field-date-range";
import { FormFieldSelect } from "@/components/form/form-field-select";
import { FormFieldText } from "@/components/form/form-field-text";
import { FormFieldTime } from "@/components/form/form-field-time";
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
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { FilePreviewList } from "@/components/ui/file-preview-list";
import { Form } from "@/components/ui/form";
import { FormBooleanButton } from "@/components/ui/form-boolean-button";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { FormSelect } from "@/components/ui/form-select";
import { FormToggleGroup } from "@/components/ui/form-toggle-group";
import { InputFile } from "@/components/ui/input-file";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
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

	const queryClient = useQueryClient();

	const buildDefaultValues = useCallback(
		(occurrence?: OccurrenceData): OccurrenceForm => {
			if (occurrence) {
				return {
					OccurrenceAt: occurrence.OccurrenceAt
						? new Date(occurrence.OccurrenceAt).toISOString()
						: new Date().toISOString(),
					Severity: occurrence.Severity,
					Description: occurrence.Description,
					VehicleId: occurrence.VehicleId ?? editingVehicle?.IDV,
					Classification: occurrence.Classification,
					CaseNumber: occurrence.CaseNumber,
				};
			}

			return {
				OccurrenceAt: new Date().toISOString(),
				Description: "",
				VehicleId: editingVehicle?.IDV ?? 0,
				CaseNumber: "",
				Classification: "",
				Severity: "",
			};
		},
		[editingVehicle],
	);

	const form = useForm<OccurrenceForm>({
		resolver: zodResolver(OccurrenceFormSchema),
		defaultValues: buildDefaultValues(editingOccurrence),
	});

	const {
		mutateAsync: mutatePostOccurrence,
		isPending: isLoadingPostOccurrence,
	} = useMutation({
		mutationFn: async (val: PostData<OccurrencePayload>) =>
			postData<OccurrenceData, OccurrencePayload>(val),
		mutationKey: ["occurrence-post"],
	});

	const {
		mutateAsync: mutatePutOccurrence,
		isPending: isLoadingPutOccurrence,
	} = useMutation({
		mutationFn: (val: PutData<OccurrencePayload>) =>
			putData<OccurrenceData, OccurrencePayload>(val),
		mutationKey: ["occurrence-put"],
	});

	// const { severityOptions, classificationOptions, isLoadingOptions } =
	// 	useOccurrenceFormOptions();

	const loading = isLoadingPostOccurrence || isLoadingPutOccurrence;

	const severityOptions = ["Baixa", "Média", "Alta", "Grave"].map((option) => ({
		label: option,
		value: option,
	}));

	const classificationOptions = ["Premium", "Master", "Standard"].map(
		(option) => ({
			label: option,
			value: option,
		}),
	);

	const onErrors = (err: any) => {
		toast.error(t("errorMessage"));
	};

	const onSubmit = async (data: OccurrenceForm) => {
		try {
			if (!form.formState.isDirty && editingOccurrence) {
				setTabPanel("tab-occurrence");
				return;
			}

			let savedOccurrence: OccurrenceData;

			const parseData = OccurrencePayloadSchema.parse({
				...data,
				// OccurrenceAt: data.OccurrenceAt?.toISOString(),
				VehicleId: editingVehicle?.IDV,
				file: undefined,
				// document: [],
			});

			if (!editingOccurrence) {
				savedOccurrence = await mutatePostOccurrence({
					url: "/occurrence",
					data: parseData,
				});
			} else {
				savedOccurrence = await mutatePutOccurrence({
					url: "/occurrence",
					id: Number(editingOccurrence.IDO),
					data: parseData,
				});
			}

			setEditingOccurrence(undefined);

			if (editingVehicle)
				await queryClient.invalidateQueries({
					queryKey: ["occurrence-get", editingVehicle?.IDV],
				});
			form.reset();
			toast.success(
				editingOccurrence ? t("successUpdate") : t("successCreate"),
			);
			setOpen(false);
		} catch (error: any) {
			toastErrorsApi(error);
		}
	};

	useEffect(() => {
		form.reset(buildDefaultValues(editingOccurrence));
	}, [editingOccurrence, form.reset, buildDefaultValues]);

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
				<ScrollArea className="flex flex-col">
					<Form {...form}>
						<form
							autoComplete="off"
							onSubmit={form.handleSubmit(onSubmit, onErrors)}
							className="overflow-hidden"
							id="vehicle-form"
						>
							<div className="flex flex-col gap-4 px-6 pb-6">
								<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
									<Controller
										name="Severity"
										control={form.control}
										render={({ field, fieldState }) =>
											loading ? (
												<Skeleton className="rounded-md w-full h-10" />
											) : (
												<FormFieldSelect
													label={t("severityLabel")}
													value={field.value ?? ""}
													onValueChange={field.onChange}
													aria-invalid={fieldState.invalid}
													options={severityOptions}
													placeholder={t("selectSeverity")}
													className="w-full col-span-6"
													name={field.name}
													control={form.control}
												/>
											)
										}
									/>
									<Controller
										name="Classification"
										control={form.control}
										render={({ field, fieldState }) =>
											loading ? (
												<Skeleton className="rounded-md w-full h-10" />
											) : (
												<FormFieldSelect
													label={t("classificationLabel")}
													value={field.value ?? ""}
													onValueChange={field.onChange}
													aria-invalid={fieldState.invalid}
													options={classificationOptions}
													placeholder={t("selectClassification")}
													className="w-full col-span-6"
													name={field.name}
													control={form.control}
												/>
											)
										}
									/>
								</div>
								<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
									<Controller
										name="CaseNumber"
										control={form.control}
										render={({ field, fieldState }) =>
											loading ? (
												<Skeleton className="rounded-md w-full h-8" />
											) : (
												<FormFieldText
													{...field}
													label={t("caseNumberLabel")}
													control={form.control}
													aria-invalid={fieldState.invalid}
													placeholder="562040"
													className="col-span-6"
													value={field.value ?? ""}
												/>
											)
										}
									/>
									{/*<Controller*/}
									{/*	name="OccurrenceAt"*/}
									{/*	control={form.control}*/}
									{/*	render={({ field, fieldState }) =>*/}
									{/*		loading ? (*/}
									{/*			<Skeleton className="rounded-md w-full h-10" />*/}
									{/*		) : (*/}
									{/*      <FormFieldDate*/}
									{/*        {...field}*/}
									{/*        label={t("caseNumberLabel")}*/}
									{/*        control={form.control}*/}
									{/*        aria-invalid={fieldState.invalid}*/}
									{/*        placeholder="Buss Vissta 340"*/}
									{/*        className="col-span-6"*/}
									{/*        value={field.value ?? ""}*/}
									{/*      />*/}
									{/*		)*/}
									{/*	}*/}
									{/*/>*/}
								</div>
								<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
									<Controller
										name="Description"
										control={form.control}
										render={({ field, fieldState }) =>
											loading ? (
												<Skeleton className="rounded-md w-full h-8" />
											) : (
												<FormFieldText
													{...field}
													label={t("descriptionLabel")}
													control={form.control}
													aria-invalid={fieldState.invalid}
													placeholder="Houve uma tentativa de roubo"
													className="col-span-12"
													value={field.value ?? ""}
												/>
											)
										}
									/>
								</div>
							</div>
						</form>
					</Form>
				</ScrollArea>
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
