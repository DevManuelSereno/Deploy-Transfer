"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookmarkIcon, FileText } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Controller, FieldValue, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useModalContext } from "@/app/context/modal-context";
import { useOccurrenceFormContext } from "@/app/context/occurrence-context";
import { useVehicleFormContext } from "@/app/context/vehicle-context";
import { useOccurrenceFormOptions } from "@/app/hooks/use-occurrence-form-options";
import { useVehicleFormOptions } from "@/app/hooks/use-vehicle-form-options";
import type {
	FileValue,
	OccurrenceData,
	OccurrenceForm,
	OccurrencePayload,
} from "@/app/types/types-occurrence";
import type { ImageValue } from "@/app/types/types-vehicle";
import {
	OccurrenceFormSchema,
	OccurrencePayloadSchema,
} from "@/app/validation/validation-occurrence";
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
import { Textarea } from "@/components/ui/textarea";
import { postData, putData, toastErrorsApi } from "@/lib/functions.api";
import type { PostData, PutData } from "@/types/models";

type ModalFormProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	children?: React.ReactNode;
};

export function ModalFormOccurrence({ open, setOpen }: ModalFormProps) {
	const { editingOccurrence, setEditingOccurrence } =
		useOccurrenceFormContext();

	const { editingVehicle } = useVehicleFormContext();

	const { setTabPanel } = useModalContext();

	const queryClient = useQueryClient();

	const buildDefaultValues = useCallback(
		(occurrence?: OccurrenceData): OccurrenceForm => {
			if (occurrence) {
				return {
					registerDate: occurrence.registerDate
						? new Date(occurrence.registerDate)
						: new Date(),
					occurrenceDate: occurrence.occurrenceDate
						? new Date(occurrence.occurrenceDate)
						: new Date(),
					description: occurrence.description ?? false,
					file: occurrence.file ? [occurrence.file] : [],
					vehicleId: String(occurrence.vehicleId ?? editingVehicle?.id ?? ""),
					seriousnessId: String(occurrence.seriousnessId),
					classificationId: String(occurrence.classificationId),
				};
			}

			return {
				registerDate: new Date(),
				occurrenceDate: new Date(),
				description: "",
				file: [],
				classificationId: "1",
				seriousnessId: "2",
				vehicleId: String(editingVehicle?.id ?? ""),
			};
		},
		[editingVehicle],
	);

	const {
		handleSubmit,
		control,
		reset,
		formState: { isDirty },
	} = useForm<OccurrenceForm>({
		resolver: zodResolver(OccurrenceFormSchema),
		defaultValues: buildDefaultValues(editingOccurrence),
	});

	const { mutateAsync: mutateUploadDoc } = useMutation({
		mutationFn: async (params: { id: number; formData: FormData }) =>
			postData<OccurrenceData, FormData>({
				url: `/occurrence/${params.id}/attachments`,
				data: params.formData,
			}),
		mutationKey: ["occurrence-upload-attachments"],
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

	const { seriousnessOptions, classificationOptions, isLoadingOptions } =
		useOccurrenceFormOptions();

	const loading =
		isLoadingPostOccurrence || isLoadingPutOccurrence || isLoadingOptions;

	const onErrors = (err: any) => {
		toast.error("Por favor, corrija os erros no formulário.");
	};

	const onSubmit = async (data: OccurrenceForm) => {
		try {
			if (!isDirty && editingOccurrence) {
				setTabPanel("tab-occurrence");
				return;
			}

			let savedOccurrence: OccurrenceData;

			const parseData = OccurrencePayloadSchema.parse({
				...data,
				registerDate: data.registerDate?.toISOString(),
				occurrenceDate: data.occurrenceDate?.toISOString(),
				vehicleId: editingVehicle?.id,
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
					id: Number(editingOccurrence.id),
					data: parseData,
				});
			}

			const hasNewFiles =
				data.file?.some(
					(doc: FileValue) =>
						doc?.fileName !== editingOccurrence?.file?.fileName,
				) ?? false;

			if (hasNewFiles) {
				const formData = new FormData();

				for (const doc of data.file ?? []) {
					if (doc) {
						formData.append("files", doc.file);
					}
				}

				await mutateUploadDoc({
					id: savedOccurrence.id,
					formData,
				});
			}

			setEditingOccurrence(undefined);

			if (editingVehicle)
				await queryClient.invalidateQueries({
					queryKey: ["occurrence-get", editingVehicle?.id],
				});
			reset();
			toast.success(
				editingOccurrence
					? "Ocorrência atualizada com sucesso"
					: "Ocorrência cadastrada com sucesso",
			);
			setOpen(false);
		} catch (error: any) {
			toastErrorsApi(error);
		}
	};

	useEffect(() => {
		reset(buildDefaultValues(editingOccurrence));
	}, [editingOccurrence, reset, buildDefaultValues]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className="p-0 rounded-xl overflow-hidden gap-0 focus-visible:outline-none sm:max-w-3xl
        flex flex-col max-h-[90vh]"
			>
				<div className="flex items-center gap-3 p-6 flex-shrink-0">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-full border">
						<FileText />
					</div>
					<DialogHeader>
						<DialogTitle>Adicionar ocorrência</DialogTitle>
						<DialogDescription>
							Preencha os campos abaixo para cadastrar uma nova ocorrência.
						</DialogDescription>
					</DialogHeader>
				</div>

				<form
					autoComplete="off"
					onSubmit={handleSubmit(onSubmit, onErrors)}
					className="flex w-full flex-col gap-4 p-6 overflow-hidden flex-1 overflow-y-auto"
				>
					<FieldGroup className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<Controller
							name="seriousnessId"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-10" />
								) : (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Seriedade</FieldLabel>
										<FormSelect
											id={field.name}
											value={field.value ?? ""}
											onChange={field.onChange}
											onBlur={field.onBlur}
											aria-invalid={fieldState.invalid}
											options={seriousnessOptions}
											placeholder="Selecione um combustível..."
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
							name="classificationId"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-10" />
								) : (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Classificação</FieldLabel>
										<FormSelect
											id={field.name}
											value={field.value ?? ""}
											onChange={field.onChange}
											onBlur={field.onBlur}
											aria-invalid={fieldState.invalid}
											options={classificationOptions}
											placeholder="Selecione um combustível..."
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
							name="occurrenceDate"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-10" />
								) : (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Data de Ocorrência
										</FieldLabel>
										<FormDatePicker
											id={field.name}
											value={field.value ?? ""}
											onChange={field.onChange}
											onBlur={field.onBlur}
											aria-invalid={fieldState.invalid}
											placeholder="14/05/2026"
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
							name="registerDate"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-10" />
								) : (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Registro da Ocorrência
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
					</FieldGroup>
					<Controller
						name="description"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Descrição</FieldLabel>
									<Textarea
										{...field}
										placeholder="Houve uma tentativa de roubo"
										rows={6}
										className="min-h-24"
										aria-invalid={fieldState.invalid}
										value={field.value ?? ""} // parse para caso seja null
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)
						}
					/>
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
									<FieldLabel htmlFor={field.name}>Anexo</FieldLabel>

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
										// files={images}
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
					<DialogFooter className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl py-4">
						<DialogClose asChild>
							<Button variant="outline">Cancelar</Button>
						</DialogClose>
						{loading ? (
							<Skeleton className="rounded-md w-full h-8" />
						) : (
							<Button type="submit">Salvar</Button>
						)}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
