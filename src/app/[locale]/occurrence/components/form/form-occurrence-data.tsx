"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import type {
	OccurrenceData,
	OccurrenceForm,
} from "@/app/[locale]/occurrence/types/types-occurrence";
import { OccurrenceFormSchema } from "@/app/[locale]/occurrence/validation/validation-occurrence";
import type { VehicleData } from "@/app/[locale]/vehicle/types/types-vehicle";
import { FormErrorMessage } from "@/components/form/form-error-message";
import { FormFieldDate } from "@/components/form/form-field-date";
import { FormFieldSelect } from "@/components/form/form-field-select";
import { FormFieldText } from "@/components/form/form-field-text";
import { FormFieldTextarea } from "@/components/form/form-field-text-area";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { toastErrorsApi } from "@/lib/functions.api";
import { cn } from "@/lib/utils";

interface FormOccurrenceProps {
	editingOccurrence?: OccurrenceData;
	editingVehicle?: VehicleData;
}

export function FormOccurrenceData({
	editingOccurrence,
	editingVehicle,
}: FormOccurrenceProps) {
	const t = useTranslations("OccurrencePage.Form");

	const buildDefaultValues = useCallback(
		(occurrence?: OccurrenceData): OccurrenceForm => {
			if (occurrence)
				return {
					OccurrenceAt: occurrence.OccurrenceAt
						? new Date(occurrence.OccurrenceAt).toISOString()
						: new Date().toISOString(),
					Severity: occurrence.Severity ?? "",
					Description: occurrence.Description ?? "",
					VehicleId: occurrence.VehicleId ?? editingVehicle?.IDV,
					Classification: occurrence.Classification ?? "",
					CaseNumber: occurrence.CaseNumber ?? "",
				};

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
	const hasErrors = Object.keys(form.formState.errors)?.length > 0;

	const loading = false;

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

	const onSubmit = async (data: OccurrenceForm) => {
		try {
			console.log(data);

			toast.success({
				title: editingOccurrence ? t("successUpdate") : t("successCreate"),
			});
		} catch (error: any) {
			toastErrorsApi(error);
		}
	};

	return (
		<ScrollArea className="flex flex-col">
			<Form {...form}>
				<form
					autoComplete="off"
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn("overflow-hidden", hasErrors && "h-[380px]")}
					id="occurrence-form"
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
							<Controller
								name="OccurrenceAt"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-10" />
									) : (
										<FormFieldDate
											{...field}
											label={t("occurrenceAtLabel")}
											aria-invalid={fieldState.invalid}
											placeholder="Buss Vissta 340"
											className="col-span-6"
											form={form}
											control={form.control}
										/>
									)
								}
							/>
						</div>
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
							<Controller
								name="Description"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldTextarea
											{...field}
											label={t("descriptionLabel")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="Houve uma tentativa de roubo"
											formItemClassName="col-span-12"
											value={field.value ?? ""}
										/>
									)
								}
							/>
						</div>
					</div>
					{hasErrors && (
						<FormErrorMessage
							message={"Por favor, preencha os campos obrigatórios."}
						/>
					)}
				</form>
			</Form>
		</ScrollArea>
	);
}
