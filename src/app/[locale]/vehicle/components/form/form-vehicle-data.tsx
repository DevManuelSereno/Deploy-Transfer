"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import { useVehicleFormOptions } from "@/app/[locale]/vehicle/hooks/use-vehicle-form-options";
import type {
	VehicleData,
	VehicleForm,
	VehiclePayload,
} from "@/app/[locale]/vehicle/types/types-vehicle";
import { VehicleFormSchema } from "@/app/[locale]/vehicle/validation/validation-vehicle";
import { FormFieldNumber } from "@/components/form/form-field-number";
import { FormFieldSelect } from "@/components/form/form-field-select";
import { FormFieldText } from "@/components/form/form-field-text";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { postData, putData, toastErrorsApi } from "@/lib/functions.api";
import type { PostData, PutData, VehicleType } from "@/types/models";

export function FormVehicleData() {
	const t = useTranslations("VehiclePage.Form");
	const { editingVehicle, setEditingVehicle } = useVehicleFormContext();
	const { setShowTabs, setTabPanel } = useModalContext();

	const buildDefaultValues = (vehicle?: VehicleData): VehicleForm => {
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
				LuggageCapacity: 30,
				Category: "Sedan",
				RegistrationCode: "00512345678",
				Amenities: "Ar-condicionado",
				InspectionInterval: 10000,
				CompanyId: "12",
				BrandId: "Scania",
			};
		}

		return {
			Plate: vehicle.Plate,
			Model: vehicle.Model,
			Year: vehicle.Year,
			Color: vehicle.Color ?? "",
			Seats: vehicle.Seats,
			Chassis: vehicle.Chassis,
			Fuel: vehicle.Fuel,
			Status: vehicle.Status ?? "",
			Location: vehicle.Location,
			Door: vehicle.Door,
			LuggageCapacity: vehicle.LuggageCapacity ?? 0,
			Category: vehicle.Category,
			RegistrationCode: vehicle.RegistrationCode,
			Amenities: vehicle.Amenities ?? "",
			InspectionInterval: vehicle.InspectionInterval ?? 0,
			CompanyId: String(vehicle.CompanyId),
			BrandId: String(vehicle.BrandId),
		};
	};

	const form = useForm<VehicleForm>({
		resolver: zodResolver(VehicleFormSchema),
		defaultValues: buildDefaultValues(editingVehicle),
	});

	// const { mutateAsync: mutatePostVehicle, isPending: isLoadingPostVehicle } =
	// 	useMutation({
	// 		mutationFn: async (val: PostData<VehiclePayload>) =>
	// 			postData<VehicleType, VehiclePayload>(val),
	// 		mutationKey: ["vehicle-post"],
	// 	});
	//
	// const { mutateAsync: mutatePutVehicle, isPending: isLoadingPutVehicle } =
	// 	useMutation({
	// 		mutationFn: (val: PutData<VehiclePayload>) =>
	// 			putData<VehicleType, VehiclePayload>(val),
	// 		mutationKey: ["vehicle-put"],
	// 	});
	//
	// const { isLoadingOptions } = useVehicleFormOptions();

	const brandOptions = ["Scania", "Mercedes-Benz", "Volvo", "Ford"].map(
		(option) => ({
			label: option,
			value: option,
		}),
	);
	const statusOptions = ["pending", "released", "maintenance", "block"].map(
		(option) => ({
			label: t(`statusValues.${option}` as any),
			value: option,
		}),
	);

	const categoryOptions = ["Sedan", "SUV", "Van", "Micro-ônibus"].map(
		(option) => ({
			label: option,
			value: option,
		}),
	);

	const colorOptions = ["Verde", "Preto", "Amarelo", "Prata", "Branco"].map(
		(option) => ({
			label: option,
			value: option,
		}),
	);

	const fuelOptions = ["Diesel", "Etanol", "Gasolina", "GNV", "GLP"].map(
		(option) => ({
			label: option,
			value: option,
		}),
	);

	const amenitiesOptions = ["Ar-condicionado", "Wi-Fi", "Carregador USB"].map(
		(option) => ({
			label: option,
			value: option,
		}),
	);

	// const loading =
	// 	isLoadingPostVehicle || isLoadingPutVehicle || isLoadingOptions;
	const loading = false;

	const onErrors = (error: any) => {
		console.log(error);
		toast.error({
			title: t("errorMessage"),
		});
	};

	const onSubmit = async (data: VehicleForm) => {
		try {
			let savedVehicle: VehicleType;

			console.log(data);

			// const parseData = VehiclePayloadSchema.parse(data);
			//
			// if (!editingVehicle) {
			// 	savedVehicle = await mutatePostVehicle({
			// 		url: "/vehicle",
			// 		data: parseData,
			// 	});
			// } else {
			// 	// UPDATE
			// 	savedVehicle = await mutatePutVehicle({
			// 		url: "/vehicle",
			// 		id: Number(editingVehicle.IDV),
			// 		data: parseData,
			// 	});
			// }
			//
			// setEditingVehicle(savedVehicle as any);
			//
			// const normalized = buildDefaultValues(savedVehicle as any);

			// form.reset(normalized);
			toast.success({
				title: editingVehicle ? t("successUpdate") : t("successCreate"),
			});

			// Enable tabs mode after successful save and navigate to next tab
			if (!editingVehicle) {
				setShowTabs(true);
				setTabPanel("tab-documentation");
			}
		} catch (error: any) {
			toastErrorsApi(error);
		}
	};
	return (
		<Form {...form}>
			<form
				autoComplete="off"
				onSubmit={form.handleSubmit(onSubmit, onErrors)}
				className="space-y-5 p-6"
				id="vehicle-form"
			>
				<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-4">
					<Controller
						name="Model"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<FormFieldText
									{...field}
									label={t("model")}
									control={form.control}
									aria-invalid={fieldState.invalid}
									placeholder="Buss Vissta 340"
									className="col-span-2"
								/>
							)
						}
					/>
					<Controller
						name="Year"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<FormFieldNumber
									{...field}
									label={t("year")}
									control={form.control}
									aria-invalid={fieldState.invalid}
									placeholder="41"
									formatOptions={{ useGrouping: false }}
								/>
							)
						}
					/>
					<Controller
						name="BrandId"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-10" />
							) : (
								<FormFieldSelect
									label={t("brand")}
									value={field.value ?? ""}
									onValueChange={field.onChange}
									aria-invalid={fieldState.invalid}
									options={brandOptions}
									placeholder={t("selectBrand")}
									className="w-full"
									name={field.name}
									control={form.control}
								/>
							)
						}
					/>
				</div>
				<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-4">
					<Controller
						name="Seats"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<FormFieldNumber
									{...field}
									label={t("seats")}
									control={form.control}
									aria-invalid={fieldState.invalid}
									placeholder="41"
								/>
							)
						}
					/>
					<Controller
						name="Door"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<FormFieldNumber
									{...field}
									label={t("doors")}
									control={form.control}
									aria-invalid={fieldState.invalid}
									placeholder="4"
								/>
							)
						}
					/>
					<Controller
						name="Category"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-10" />
							) : (
								<FormFieldSelect
									label={t("category")}
									value={field.value ?? ""}
									onValueChange={field.onChange}
									aria-invalid={fieldState.invalid}
									options={categoryOptions}
									placeholder={t("selectCategory")}
									className="w-full"
									name={field.name}
									control={form.control}
								/>
							)
						}
					/>
					<Controller
						name="Status"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-10" />
							) : (
								<FormFieldSelect
									label={t("status")}
									value={field.value ?? ""}
									onValueChange={field.onChange}
									aria-invalid={fieldState.invalid}
									options={statusOptions}
									placeholder={t("selectStatus")}
									className="w-full"
									name={field.name}
									control={form.control}
								/>
							)
						}
					/>
				</div>

				<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-4">
					<Controller
						name="LuggageCapacity"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<FormFieldNumber
									{...field}
									label={t("luggageCapacity")}
									control={form.control}
									aria-invalid={fieldState.invalid}
									placeholder="50"
									value={field.value ?? 0}
								/>
							)
						}
					/>
					<Controller
						name="InspectionInterval"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<FormFieldNumber
									{...field}
									label={t("inspectionInterval")}
									control={form.control}
									aria-invalid={fieldState.invalid}
									placeholder="9400 km"
									value={field.value ?? 0}
									formatOptions={{
										style: "unit",
										unit: "kilometer",
										unitDisplay: "short",
									}}
								/>
							)
						}
					/>
					<Controller
						name="Color"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-10" />
							) : (
								<FormFieldSelect
									label={t("color")}
									value={field.value ?? ""}
									onValueChange={field.onChange}
									aria-invalid={fieldState.invalid}
									options={colorOptions}
									placeholder={t("selectColor")}
									className="w-full"
									name={field.name}
									control={form.control}
								/>
							)
						}
					/>
					<Controller
						name="Fuel"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-10" />
							) : (
								<FormFieldSelect
									label={t("fuel")}
									value={field.value ?? ""}
									onValueChange={field.onChange}
									aria-invalid={fieldState.invalid}
									options={fuelOptions}
									placeholder={t("selectFuel")}
									className="w-full"
									name={field.name}
									control={form.control}
								/>
							)
						}
					/>
				</div>
				<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-4">
					<Controller
						name="Location"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<FormFieldText
									{...field}
									label={t("uf")}
									control={form.control}
									aria-invalid={fieldState.invalid}
									placeholder="SP"
								/>
							)
						}
					/>
					<Controller
						name="Plate"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<FormFieldText
									{...field}
									label={t("plate")}
									control={form.control}
									aria-invalid={fieldState.invalid}
									placeholder="ABC1D23"
								/>
							)
						}
					/>
					<Controller
						name="RegistrationCode"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<FormFieldText
									{...field}
									label={t("renavam")}
									control={form.control}
									aria-invalid={fieldState.invalid}
									placeholder="00512345678"
								/>
							)
						}
					/>

					<Controller
						name="Chassis"
						control={form.control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<FormFieldText
									{...field}
									label={t("chassi")}
									control={form.control}
									aria-invalid={fieldState.invalid}
									placeholder="9BWZZZ377VT004251"
								/>
							)
						}
					/>
				</div>
				<Controller
					name="Amenities"
					control={form.control}
					render={({ field, fieldState }) =>
						loading ? (
							<Skeleton className="rounded-md w-full h-10" />
						) : (
							<FormFieldSelect
								label={t("amenities")}
								value={field.value ?? ""}
								onValueChange={field.onChange}
								aria-invalid={fieldState.invalid}
								options={amenitiesOptions}
								placeholder={t("selectAmenities")}
								className="w-full"
								name={field.name}
								control={form.control}
							/>
						)
					}
				/>
			</form>
			<DialogFooter className="flex gap-4 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 pt-6 pb-4">
				<DialogClose asChild>
					<Button variant="outline">{t("cancel")}</Button>
				</DialogClose>
				{loading ? (
					<Skeleton className="rounded-md w-full h-8" />
				) : (
					<Button type="submit" form="vehicle-form">
						{t("continue")}
					</Button>
				)}
			</DialogFooter>
		</Form>
	);
}
