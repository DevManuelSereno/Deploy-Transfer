"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGasSupplyFormContext } from "@/app/[locale]/vehicle/context/gas-supply-context";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import { useGasSupplyFormOptions } from "@/app/[locale]/vehicle/hooks/use-gas-supply-form-options";
import type {
	FileValue,
	GasSupplyData,
	GasSupplyForm,
	GasSupplyPayload,
} from "@/app/[locale]/vehicle/types/types-gas-supply";
import {
	GasSupplyFormSchema,
	GasSupplyPayloadSchema,
} from "@/app/[locale]/vehicle/validation/validation-gas-supply";
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
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { FormSelect } from "@/components/ui/form-select";
import { InputFile } from "@/components/ui/input-file";
import { InputNumber } from "@/components/ui/input-number";
import { Skeleton } from "@/components/ui/skeleton";
import { postData, putData, toastErrorsApi } from "@/lib/functions.api";
import type { PostData, PutData } from "@/types/models";

type ModalFormProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	children?: React.ReactNode;
};

export function ModalFormGasSupply({ open, setOpen }: ModalFormProps) {
	const t = useTranslations("VehiclePage.GasSupply.modal");
	const { editingGasSupply, setEditingGasSupply } = useGasSupplyFormContext();

	const { editingVehicle } = useVehicleFormContext();

	const { setTabPanel } = useModalContext();

	const queryClient = useQueryClient();

	const buildDefaultValues = useCallback(
		(gasSupply?: GasSupplyData): GasSupplyForm => {
			if (gasSupply) {
				return {
					supplyAt: gasSupply.supplyAt
						? new Date(gasSupply.supplyAt)
						: new Date(),
					kmToStop: gasSupply.kmToStop ?? 0,
					kmToReview: gasSupply.kmToReview ?? 0,
					quantity: gasSupply.quantity ?? 0,
					totalPrice: gasSupply.totalPrice ?? 0,
					file: gasSupply.file ? [gasSupply.file] : [],
					vehicleId: String(gasSupply.vehicleId ?? editingVehicle?.id ?? ""),
					gasStationId: String(gasSupply.gasStationId),
					gasId: String(gasSupply.gasId),
				};
			}

			return {
				supplyAt: new Date(),
				kmToStop: 0,
				kmToReview: 0,
				quantity: 0,
				totalPrice: 0,
				file: [],
				vehicleId: String(editingVehicle?.id ?? ""),
				gasStationId: "1",
				gasId: "1",
			};
		},
		[editingVehicle],
	);

	const {
		handleSubmit,
		control,
		reset,
		formState: { isDirty },
	} = useForm<GasSupplyForm>({
		resolver: zodResolver(GasSupplyFormSchema),
		defaultValues: buildDefaultValues(editingGasSupply),
	});

	const { mutateAsync: mutateUploadDoc } = useMutation({
		mutationFn: async (params: { id: number; formData: FormData }) =>
			postData<GasSupplyData, FormData>({
				url: `/gasSupply/${params.id}/receipt`,
				data: params.formData,
			}),
		mutationKey: ["gas-supply-upload-receipt"],
	});

	const {
		mutateAsync: mutatePostGasSupply,
		isPending: isLoadingPostGasSupply,
	} = useMutation({
		mutationFn: async (val: PostData<GasSupplyPayload>) =>
			postData<GasSupplyData, GasSupplyPayload>(val),
		mutationKey: ["gas-supply-post"],
	});

	const { mutateAsync: mutatePutGasSupply, isPending: isLoadingPutGasSupply } =
		useMutation({
			mutationFn: (val: PutData<GasSupplyPayload>) =>
				putData<GasSupplyData, GasSupplyPayload>(val),
			mutationKey: ["gas-supply-put"],
		});

	const { gasOptions, gasStationOptions, isLoadingOptions } =
		useGasSupplyFormOptions();

	const loading =
		isLoadingPostGasSupply || isLoadingPutGasSupply || isLoadingOptions;

	const onErrors = (err: any) => {
		toast.error(t("errorMessage"));
	};

	const onSubmit = async (data: GasSupplyForm) => {
		try {
			if (!isDirty && editingGasSupply) {
				setTabPanel("tab-gas-supply");
				return;
			}

			let savedGasSupply: GasSupplyData;

			const parseData = GasSupplyPayloadSchema.parse({
				...data,
				supplyAt: data.supplyAt?.toISOString(),
				vehicleId: editingVehicle?.id,
				file: undefined,
				// document: [],
			});

			if (!editingGasSupply) {
				savedGasSupply = await mutatePostGasSupply({
					url: "/gasSupply",
					data: parseData,
				});
			} else {
				savedGasSupply = await mutatePutGasSupply({
					url: "/gasSupply",
					id: Number(editingGasSupply.id),
					data: parseData,
				});
			}

			const hasNewFiles =
				data.file?.some(
					(doc: FileValue) =>
						doc?.fileName !== editingGasSupply?.file?.fileName,
				) ?? false;

			if (hasNewFiles) {
				const formData = new FormData();

				for (const doc of data.file ?? []) {
					if (doc) {
						formData.append("files", doc.file);
					}
				}

				await mutateUploadDoc({
					id: savedGasSupply.id,
					formData,
				});
			}

			setEditingGasSupply(undefined);

			if (editingVehicle)
				await queryClient.invalidateQueries({
					queryKey: ["gas-supply-get", editingVehicle?.id],
				});
			reset();
			toast.success(
				editingGasSupply
					? t("successUpdate")
					: t("successCreate"),
			);
			setOpen(false);
		} catch (error: any) {
			toastErrorsApi(error);
		}
	};

	useEffect(() => {
		reset(buildDefaultValues(editingGasSupply));
	}, [editingGasSupply, reset, buildDefaultValues]);

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
						<DialogTitle>{t("title")}</DialogTitle>
						<DialogDescription>
							{t("description")}
						</DialogDescription>
					</DialogHeader>
				</div>

				<form
					autoComplete="off"
					onSubmit={handleSubmit(onSubmit, onErrors)}
					className="flex w-full flex-col gap-4 p-6 overflow-hidden flex-1 overflow-y-auto"
				>
					<Controller
						name="gasStationId"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-10" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										{t("stationLabel")}
									</FieldLabel>
									<FormSelect
										id={field.name}
										value={field.value ?? ""}
										onChange={field.onChange}
										onBlur={field.onBlur}
										aria-invalid={fieldState.invalid}
										options={gasStationOptions}
										placeholder={t("stationPlaceholder")}
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
					<FieldGroup className="grid grid-cols-1 lg:grid-cols-4 gap-4">
						<Controller
							name="kmToReview"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-8" />
								) : (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											{t("kmToReviewLabel")}
										</FieldLabel>
										<InputNumber
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder="30"
											value={Number(field.value)}
											min={0}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)
							}
						/>
						<Controller
							name="kmToStop"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-8" />
								) : (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>{t("kmToStopLabel")}</FieldLabel>
										<InputNumber
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder="45"
											value={Number(field.value)}
											min={0}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)
							}
						/>
						<Controller
							name="gasId"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-10" />
								) : (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>{t("fuelLabel")}</FieldLabel>
										<FormSelect
											id={field.name}
											value={field.value ?? ""}
											onChange={field.onChange}
											onBlur={field.onBlur}
											aria-invalid={fieldState.invalid}
											options={gasOptions}
											placeholder={t("fuelPlaceholder")}
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
							name="quantity"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-8" />
								) : (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											{t("quantityLabel")}
										</FieldLabel>
										<InputNumber
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder="10"
											value={Number(field.value)}
											min={0}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)
							}
						/>
					</FieldGroup>
					<FieldGroup className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<Controller
							name="supplyAt"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-10" />
								) : (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											{t("supplyDateLabel")}
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
							name="totalPrice"
							control={control}
							render={({ field, fieldState }) =>
								loading ? (
									<Skeleton className="rounded-md w-full h-8" />
								) : (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>{t("totalPriceLabel")}</FieldLabel>
										<InputNumber
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder="108"
											value={Number(field.value)}
											min={0}
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
									<FieldLabel htmlFor={field.name}>{t("receiptLabel")}</FieldLabel>

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
					<DialogFooter className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl py-4">
						<DialogClose asChild>
							<Button variant="outline">{t("cancel")}</Button>
						</DialogClose>
						{loading ? (
							<Skeleton className="rounded-md w-full h-8" />
						) : (
							<Button type="submit">{t("save")}</Button>
						)}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
