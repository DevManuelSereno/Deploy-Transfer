"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useModalContextPass } from "@/app/[locale]/vehicle/context/modal-table-vehicle-pass";
import { useVehiclePassFormContext } from "@/app/[locale]/vehicle/context/vehicle-pass-context";
import { useVehiclePassFormOptions } from "@/app/[locale]/vehicle/hooks/use-vehicle-pass-form-options";
import type {
	VehiclePassData,
	VehiclePassForm,
	VehiclePassPayload,
} from "@/app/[locale]/vehicle/types/types-vehicle-pass";
import {
	VehiclePassFormSchema,
	VehiclePassPayloadSchema,
} from "@/app/[locale]/vehicle/validation/validation-vehicle-pass";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { FormSelect } from "@/components/ui/form-select";
import { ImagePreviewGrid } from "@/components/ui/image-preview-grid";
import { Input } from "@/components/ui/input";
import { InputImage } from "@/components/ui/input-image";
import { InputNumber } from "@/components/ui/input-number";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { postData, putData, toastErrorsApi } from "@/lib/functions.api";
import {
	type PlateType,
	PlateTypeSchema,
} from "@/types/enums/PlateType.schema";
import type { PostData, PutData, VehicleType } from "@/types/models";

export function FormVehiclePassData() {
	const t = useTranslations("VehiclePage.Form");
	const { editingVehicle, setEditingVehicle } = useVehiclePassFormContext();

	const { setTabPanel } = useModalContextPass();

	const buildDefaultValues = (vehicle?: VehiclePassData): VehiclePassForm => {
		if (!vehicle) {
			return {
				Plate: "ABC1D23",
				Model: "Corolla XEi",
				Year: 2020,
				Color: "Prata",
				Seats: 5,
				Chassis: "9BWZZZ377VT004251",
				Fuel: "Gasolina",
				Status: "released",
				Location: "SP",
				Door: 4,
				LuggageCapacity: 3,
				Category: "Sedan",
				RegistrationCode: "00512345678",
				Amenities: "Ar-condicionado, Wi-Fi, Carregador USB",
				InspectionInterval: 10000,
				CompanyId: 12,
				BrandId: 7,
			};
		}

		return {
			Plate: "ABC1D23",
			Model: "Corolla XEi",
			Year: 2020,
			Color: "Prata",
			Seats: 5,
			Chassis: "9BWZZZ377VT004251",
			Fuel: "Gasolina",
			Status: "released",
			Location: "SP",
			Door: 4,
			LuggageCapacity: 3,
			Category: "Sedan",
			RegistrationCode: "00512345678",
			Amenities: "Ar-condicionado, Wi-Fi, Carregador USB",
			InspectionInterval: 10000,
			CompanyId: 12,
			BrandId: 7,
		};
	};

	const {
		handleSubmit,
		control,
		reset,
		formState: { isDirty },
	} = useForm<VehiclePassForm>({
		resolver: zodResolver(VehiclePassFormSchema),
		defaultValues: buildDefaultValues(editingVehicle),
	});

	const { mutateAsync: mutateUploadPhotos } = useMutation({
		mutationFn: async (params: { id: number; formData: FormData }) =>
			postData<VehicleType, FormData>({
				url: `/vehicle/${params.id}/photos`,
				data: params.formData,
			}),
		mutationKey: ["vehicle-upload-photos"],
	});

	const { mutateAsync: mutatePostVehicle, isPending: isLoadingPostVehicle } =
		useMutation({
			mutationFn: async (val: PostData<VehiclePassPayload>) =>
				postData<VehicleType, VehiclePassPayload>(val),
			mutationKey: ["vehicle-post"],
		});

	const { mutateAsync: mutatePutVehicle, isPending: isLoadingPutVehicle } =
		useMutation({
			mutationFn: (val: PutData<VehiclePassPayload>) =>
				putData<VehicleType, VehiclePassPayload>(val),
			mutationKey: ["vehicle-put"],
		});

	const { brandOptions, isLoadingOptions } = useVehiclePassFormOptions();

	const plateTypeOptions = PlateTypeSchema.options.map((option) => ({
		label: option,
		value: option,
	}));

	const loading =
		isLoadingPostVehicle || isLoadingPutVehicle || isLoadingOptions;
	// const loading = true;

	const onErrors = () => {
		toast.error(t("errorMessage"));
	};

	const onSubmit = async (data: VehiclePassForm) => {
		try {
			let savedVehicle: VehicleType;

			if (!isDirty && editingVehicle) {
				setTabPanel("tab-documentation");
				return;
			}

			const parseData = VehiclePassPayloadSchema.parse({
				...data,
				photos: undefined,
			});

			if (!editingVehicle) {
				savedVehicle = await mutatePostVehicle({
					url: "/vehicle",
					data: parseData,
				});
			} else {
				// UPDATE
				savedVehicle = await mutatePutVehicle({
					url: "/vehicle",
					id: Number(editingVehicle.IDV),
					data: parseData,
				});
			}

			setEditingVehicle(savedVehicle as any);

			const normalized = buildDefaultValues(savedVehicle as any);

			reset(normalized);
			toast.success(editingVehicle ? t("successUpdate") : t("successCreate"));
			setTabPanel("tab-documentation");
			// const tabElement = document.getElementById("documentation");
			// if (tabElement) {
			// 	tabElement.scrollIntoView({ behavior: "smooth" });
			// }
		} catch (error: any) {
			toastErrorsApi(error);
		}
	};
	return (
		<form autoComplete="off" onSubmit={handleSubmit(onSubmit, onErrors)}>
			<div className="flex w-full flex-col gap-4 space-y-5 p-6">
				<FieldGroup className="grid grid-cols-1 lg:grid-cols-4 gap-4">
					{/*	<Controller*/}
					{/*		name="CompanyId"*/}
					{/*		control={control}*/}
					{/*		render={({ field, fieldState }) =>*/}
					{/*			loading ? (*/}
					{/*				<Skeleton className="rounded-md w-full h-10" />*/}
					{/*			) : (*/}
					{/*				<Field data-invalid={fieldState.invalid}>*/}
					{/*					<FieldLabel htmlFor={field.name}>{t("company")}</FieldLabel>*/}
					{/*					<FormSelect*/}
					{/*						id={field.name}*/}
					{/*						value={field.value ?? ""}*/}
					{/*						onChange={field.onChange}*/}
					{/*						onBlur={field.onBlur}*/}
					{/*						aria-invalid={fieldState.invalid}*/}
					{/*						options={companyOptions}*/}
					{/*						placeholder={t("selectCompany")}*/}
					{/*						className="w-full"*/}
					{/*						name={field.name}*/}
					{/*					/>*/}

					{/*					{fieldState.invalid && (*/}
					{/*						<FieldError errors={[fieldState.error]} />*/}
					{/*					)}*/}
					{/*				</Field>*/}
					{/*			)*/}
					{/*		}*/}
					{/*	/>*/}
					{/*	<Controller*/}
					{/*		name="statusId"*/}
					{/*		control={control}*/}
					{/*		render={({ field, fieldState }) =>*/}
					{/*			loading ? (*/}
					{/*				<Skeleton className="rounded-md w-full h-10" />*/}
					{/*			) : (*/}
					{/*				<Field data-invalid={fieldState.invalid}>*/}
					{/*					<FieldLabel htmlFor={field.name}>{t("status")}</FieldLabel>*/}
					{/*					<FormSelect*/}
					{/*						id={field.name}*/}
					{/*						value={field.value ?? ""}*/}
					{/*						onChange={field.onChange}*/}
					{/*						onBlur={field.onBlur}*/}
					{/*						aria-invalid={fieldState.invalid}*/}
					{/*						options={statusOptions}*/}
					{/*						placeholder={t("selectStatus")}*/}
					{/*						className="w-full"*/}
					{/*						name={field.name}*/}
					{/*					/>*/}

					{/*					{fieldState.invalid && (*/}
					{/*						<FieldError errors={[fieldState.error]} />*/}
					{/*					)}*/}
					{/*				</Field>*/}
					{/*			)*/}
					{/*		}*/}
					{/*	/>*/}
				</FieldGroup>
				<FieldGroup className="grid grid-cols-1 lg:grid-cols-4 gap-4">
					<Controller
						name="Model"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<Field
									data-invalid={fieldState.invalid}
									className="lg:col-span-2"
								>
									<FieldLabel htmlFor={field.name}>{t("model")}</FieldLabel>
									<Input
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="Buss Vissta 340"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)
						}
					/>
				</FieldGroup>
			</div>
			<DialogFooter className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
				<DialogClose asChild>
					<Button variant="outline">{t("cancel")}</Button>
				</DialogClose>
				{loading ? (
					<Skeleton className="rounded-md w-full h-8" />
				) : (
					<Button type="submit">{t("continue")}</Button>
				)}
			</DialogFooter>
		</form>
	);
}
