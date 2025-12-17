"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import type {
	DocumentationData,
	DocumentationForm,
} from "@/app/[locale]/documentation/types/types-documentation";
import { DocumentationFormSchema } from "@/app/[locale]/documentation/validation/validation-documentation";
import { FormErrorMessage } from "@/components/form/form-error-message";
import { FormFieldDate } from "@/components/form/form-field-date";
import { FormFieldSelect } from "@/components/form/form-field-select";
import { FilePreviewList } from "@/components/ui/file-preview-list";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { InputFile } from "@/components/ui/input-file";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { toastErrorsApi } from "@/lib/functions.api";
import { cn } from "@/lib/utils";

interface FormDocumentationProps {
	editingDocumentation?: DocumentationData;
}

export function FormDocumentationData({ editingDocumentation }: FormDocumentationProps) {
	const t = useTranslations("DocumentationPage.Form");

	const buildDefaultValues = (documentation?: DocumentationData): DocumentationForm => {
		if (!documentation) {
			return {
				VehicleId: "1",
				Type: "CNH",
				ExpiryAt: new Date().toISOString().split('T')[0],
				File: undefined,
			};
		}

		return {
			VehicleId: String(documentation.VehicleId),
			Type: documentation.Type,
			ExpiryAt: documentation.ExpiryAt,
			File: undefined,
		};
	};

	const form = useForm<DocumentationForm>({
		resolver: zodResolver(DocumentationFormSchema),
		defaultValues: buildDefaultValues(editingDocumentation),
	});
	const hasErrors = Object.keys(form.formState.errors)?.length > 0;

	const loading = false;

	const vehicleOptions = [
		{ label: "ABC1D23 - Corolla", value: "1" },
		{ label: "XYZ9F88 - Sprinter", value: "2" },
		{ label: "JKL3E55 - HB20", value: "3" },
	];

	const documentTypeOptions = [
		{ label: "CNH", value: "CNH" },
		{ label: "CRLV", value: "CRLV" },
		{ label: "Seguro", value: "Seguro" },
		{ label: "IPVA", value: "IPVA" },
		{ label: "Licenciamento", value: "Licenciamento" },
	];

	const onSubmit = async (data: DocumentationForm) => {
		try {
			console.log(data);

			toast.success({
				title: editingDocumentation ? t("successUpdate") : t("successCreate"),
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
					className={cn("overflow-hidden", hasErrors && "h-[280px]")}
					id="documentation-form"
				>
					<div className="flex flex-col gap-4 px-6 pb-6">
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
						<Controller
							name="VehicleId"
							control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-10" />
									) : (
										<FormFieldSelect
											label={t("vehicle")}
											value={field.value ?? ""}
											onValueChange={field.onChange}
											aria-invalid={fieldState.invalid}
											options={vehicleOptions}
											placeholder={t("selectVehicle")}
											className="w-full col-span-6"
											name={field.name}
											control={form.control}
										/>
									)
								}
							/>
						<Controller
							name="Type"
							control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldSelect
											label={t("type")}
											value={field.value ?? ""}
											onValueChange={field.onChange}
											aria-invalid={fieldState.invalid}
											options={documentTypeOptions}
											placeholder={t("selectType")}
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
							name="ExpiryAt"
							control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-10" />
									) : (
										<FormFieldDate
											name={field.name}
											form={form}
											control={form.control}
											label={t("expiryDate")}
											aria-invalid={fieldState.invalid}
											placeholder="15/12/2025"
											formItemClassName="w-full col-span-12"
										/>
									)
								}
							/>
						</div>
						
						{/* Upload de arquivo */}
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
						<Controller
							name="File"
							control={form.control}
								render={({ field, fieldState }) => {
									const files = Array.isArray(field.value) ? field.value : field.value ? [field.value] : [];
									return loading ? (
										<Skeleton className="rounded-md w-full h-20" />
									) : (
										<FormItem className="col-span-12">
											<FormLabel>{t("document")}</FormLabel>
											<FormControl>
												<div className="space-y-3">
													<InputFile
														id={field.name}
														name={field.name}
														value={files.filter((f) => f)}
														onChange={(val) => {
															const next = Array.isArray(val) ? val : val ? [val] : [];
															field.onChange(next);
														}}
														ref={field.ref}
														accept="image/*,application/pdf"
														maxFiles={1}
														disabled={files.length >= 1}
													/>
													<FilePreviewList
														files={files.filter((f) => f)}
														onRemove={(id) => {
															const current = Array.isArray(field.value) ? field.value : field.value ? [field.value] : [];
															const next = current.filter((f: any) => f.id !== id);
															field.onChange(next);
														}}
													/>
												</div>
											</FormControl>
										</FormItem>
									);
								}}
							/>
						</div>
					</div>
					{hasErrors && (
						<FormErrorMessage
							message={t("errorMessage")}
						/>
					)}
				</form>
			</Form>
		</ScrollArea>
	);
}
