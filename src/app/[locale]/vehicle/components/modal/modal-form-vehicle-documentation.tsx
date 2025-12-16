"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookmarkIcon, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Controller, FieldValue, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import { useDocumentationFormContext } from "@/app/[locale]/vehicle/context/vehicle-documentation-context";
import {
	type DocumentationData,
	type DocumentationForm,
	type DocumentationPayload,
	documentationTypes,
	type FileValue,
} from "@/app/[locale]/vehicle/types/types-vehicle-documentation";
import {
	DocumentationFormSchema,
	DocumentationPayloadSchema,
} from "@/app/[locale]/vehicle/validation/validation-vehicle-documentation";
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
import { FormBooleanButton } from "@/components/ui/form-boolean-button";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { FormSelect } from "@/components/ui/form-select";
import { FormToggleGroup } from "@/components/ui/form-toggle-group";
import { InputFile } from "@/components/ui/input-file";
import { Skeleton } from "@/components/ui/skeleton";
import { postData, putData, toastErrorsApi } from "@/lib/functions.api";
import type { PostData, PutData } from "@/types/models";

type ModalFormProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	children?: React.ReactNode;
};

export function ModalFormDocumentation({ open, setOpen }: ModalFormProps) {
	const t = useTranslations("VehiclePage.Documentation.modal");
	const tForm = useTranslations("Form");
	const { editingDocumentation, setEditingDocumentation } =
		useDocumentationFormContext();

	const { editingVehicle } = useVehicleFormContext();

	const { setTabPanel } = useModalContext();

	const queryClient = useQueryClient();

	const buildDefaultValues = useCallback(
		(documentation?: DocumentationData): DocumentationForm => {
			if (documentation) {
				return {
					days: documentation.days ?? [],
					type: documentation.type ?? "",
					anticipateRenewal: documentation.anticipateRenewal ?? false,
					file: documentation.file ? [documentation.file] : [],
					expiryAt: documentation.expiryAt
						? new Date(documentation.expiryAt)
						: new Date(),
					vehicleId: String(
						documentation.vehicleId ?? editingVehicle?.IDV ?? "",
					),
				};
			}

			return {
				days: ["seg", "qua"],
				type: "Tacógrafo",
				anticipateRenewal: false,
				file: [],
				expiryAt: new Date(),
				vehicleId: String(editingVehicle?.IDV ?? ""),
			};
		},
		[editingVehicle],
	);

	const {
		handleSubmit,
		control,
		reset,
		formState: { isDirty },
	} = useForm<DocumentationForm>({
		resolver: zodResolver(DocumentationFormSchema),
		defaultValues: buildDefaultValues(editingDocumentation),
	});

	const { mutateAsync: mutateUploadDoc } = useMutation({
		mutationFn: async (params: { id: number; formData: FormData }) =>
			postData<DocumentationData, FormData>({
				url: `/documentation/${params.id}/docs`,
				data: params.formData,
			}),
		mutationKey: ["documentation-upload-docs"],
	});

	const {
		mutateAsync: mutatePostDocumentation,
		isPending: isLoadingPostDocumentation,
	} = useMutation({
		mutationFn: async (val: PostData<DocumentationPayload>) =>
			postData<DocumentationData, DocumentationPayload>(val),
		mutationKey: ["documentation-post"],
	});

	const {
		mutateAsync: mutatePutDocumentation,
		isPending: isLoadingPutDocumentation,
	} = useMutation({
		mutationFn: (val: PutData<DocumentationPayload>) =>
			putData<DocumentationData, DocumentationPayload>(val),
		mutationKey: ["documentation-put"],
	});

	const typeOptions = documentationTypes.map((option) => ({
		label: option,
		value: option,
	}));

	const daysOfWeekOptions = [
		"dom",
		"seg",
		"ter",
		"qua",
		"qui",
		"sex",
		"sáb",
	].map((day) => ({
		label: day.charAt(0).toUpperCase(),
		value: day,
	}));

	const loading = isLoadingPostDocumentation || isLoadingPutDocumentation;

	const onErrors = (err: any) => {
		toast.error(t("errorMessage"));
	};

	const onSubmit = async (data: DocumentationForm) => {
		try {
			if (!isDirty && editingDocumentation) {
				setTabPanel("tab-documentation");
				return;
			}

			let savedDocumentation: DocumentationData;

			const parseData = DocumentationPayloadSchema.parse({
				...data,
				expiryAt: data.expiryAt?.toISOString(),
				vehicleId: editingVehicle?.IDV,
				file: undefined,
				// document: [],
			});

			if (!editingDocumentation) {
				savedDocumentation = await mutatePostDocumentation({
					url: "/documentation",
					data: parseData,
				});
			} else {
				savedDocumentation = await mutatePutDocumentation({
					url: "/documentation",
					id: Number(editingDocumentation.id),
					data: parseData,
				});
			}

			const hasNewFiles =
				data.file?.some(
					(doc: FileValue) =>
						doc?.fileName !== editingDocumentation?.file?.fileName,
				) ?? false;

			if (hasNewFiles) {
				const formData = new FormData();

				for (const doc of data.file ?? []) {
					if (doc) {
						formData.append("files", doc.file);
					}
				}

				await mutateUploadDoc({
					id: savedDocumentation.id,
					formData,
				});
			}

			setEditingDocumentation(undefined);

			if (editingVehicle)
				await queryClient.invalidateQueries({
					queryKey: ["documentation-get", editingVehicle?.IDV],
				});
			reset();
			toast.success(
				editingDocumentation ? t("successUpdate") : t("successCreate"),
			);
			setOpen(false);
		} catch (error: any) {
			toastErrorsApi(error);
		}
	};

	useEffect(() => {
		reset(buildDefaultValues(editingDocumentation));
	}, [editingDocumentation, reset, buildDefaultValues]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className="p-0 rounded-xl overflow-hidden gap-0 focus-visible:outline-none sm:max-w-5xl
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

				<form
					autoComplete="off"
					onSubmit={handleSubmit(onSubmit, onErrors)}
					className="flex w-full flex-col gap-4 p-6 overflow-hidden flex-1 overflow-y-auto"
					id="documentation-form"
				>
					<FieldGroup className="grid grid-cols-1 lg:grid-cols-9 gap-4">
						<Controller
							name="days"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-8" />
								) : (
									<Field
										data-invalid={fieldState.invalid}
										className="col-span-3"
									>
										<FieldLabel htmlFor={field.name}>
											{t("daysLabel")}
										</FieldLabel>
										<FormToggleGroup
											id={field.name}
											value={field.value}
											onChange={field.onChange}
											onBlur={field.onBlur}
											aria-invalid={fieldState.invalid}
											options={daysOfWeekOptions}
											className="w-full"
											type="multiple"
										/>

										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)
							}
						/>
						<Controller
							name="type"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-10" />
								) : (
									<Field
										data-invalid={fieldState.invalid}
										className="col-span-3 lg:col-span-2"
									>
										<FieldLabel htmlFor={field.name}>
											{t("typeLabel")}
										</FieldLabel>
										<FormSelect
											id={field.name}
											value={field.value ?? ""}
											onChange={field.onChange}
											onBlur={field.onBlur}
											aria-invalid={fieldState.invalid}
											options={typeOptions}
											placeholder={t("typePlaceholder")}
											className="w-full"
											name={field.name}
										/>

										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)
							}
						/>
						<Controller
							name="expiryAt"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-10" />
								) : (
									<Field
										data-invalid={fieldState.invalid}
										className="col-span-3"
									>
										<FieldLabel htmlFor={field.name}>
											{t("expirationLabel")}
										</FieldLabel>
										<FormDatePicker
											id={field.name}
											value={field.value ?? ""}
											onChange={field.onChange}
											onBlur={field.onBlur}
											aria-invalid={fieldState.invalid}
											placeholder="15/05/2026"
											className="w-full"
											name={field.name}
										/>

										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)
							}
						/>
						<Controller
							name="anticipateRenewal"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-10" />
								) : (
									<Field
										// orientation="horizontal"
										data-invalid={fieldState.invalid}
									>
										<FieldLabel htmlFor={field.name}>
											{t("anticipateLabel")}
										</FieldLabel>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
										<FormBooleanButton
											id={field.name}
											value={field.value}
											onChange={field.onChange}
											onBlur={field.onBlur}
											aria-invalid={fieldState.invalid}
											className="w-full"
										>
											<BookmarkIcon />
											Bookmark
										</FormBooleanButton>
										{/*<Switch*/}
										{/*	id={field.name}*/}
										{/*	name={field.name}*/}
										{/*	checked={field.value}*/}
										{/*	onCheckedChange={field.onChange}*/}
										{/*	aria-invalid={fieldState.invalid}*/}
										{/*/>*/}
									</Field>
								)
							}
						/>
					</FieldGroup>
					<Controller
						name="file"
						control={control}
						render={({ field, fieldState }) => {
							const images: FileValue[] = Array.isArray(field.value)
								? field.value
								: field.value
									? [field.value]
									: [];
							return (
								<Field
									data-invalid={fieldState.invalid}
									className="md:col-span-2"
								>
									<FieldLabel htmlFor={field.name}>
										{t("documentLabel")}
									</FieldLabel>

									<InputFile
										id={field.name}
										name={field.name}
										value={images.filter((a) => a)}
										onChange={(val: FileValue[] | FileValue | undefined) => {
											const next = Array.isArray(val) ? val : val ? [val] : [];
											field.onChange(next);
										}}
										ref={field.ref}
										accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
										maxFiles={1}
										disabled={
											field.value === null ||
											(field.value?.filter((a) => a)?.length ?? 0) >= 1
										}
									/>

									<FilePreviewList
										files={images.filter((a) => a)}
										onRemove={(id) => {
											const current = Array.isArray(field.value)
												? field.value
												: field.value
													? [field.value]
													: [];
											const next = current.filter((img) => img.id !== id);
											field.onChange(next);
										}}
										className="mt-3"
									/>

									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							);
						}}
					/>
				</form>
				<DialogFooter className="flex gap-4 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 pt-6 pb-4">
					<DialogClose asChild>
						<Button variant="outline">{tForm("cancel")}</Button>
					</DialogClose>

					<Button type="submit" form="documentation-form">{tForm("register")}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
