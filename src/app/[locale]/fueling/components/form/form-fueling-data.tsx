"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { useFuelingFormContext } from "@/app/[locale]/fueling/context/fueling-context";
import type {
	FuelingData,
	FuelingForm,
} from "@/app/[locale]/fueling/types/types-fueling";
import { FuelingFormSchema } from "@/app/[locale]/fueling/validation/validation-fueling";
import { FormFieldNumber } from "@/components/form/form-field-number";
import { FormFieldSelect } from "@/components/form/form-field-select";
import { FormFieldText } from "@/components/form/form-field-text";
import { FilePreviewList } from "@/components/ui/file-preview-list";
import {
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { InputFile } from "@/components/ui/input-file";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { toastErrorsApi } from "@/lib/functions.api";

interface FormFuelingProps {
	editingFueling?: FuelingData;
}

export function FormFuelingData({ editingFueling }: FormFuelingProps) {
	const t = useTranslations("FuelingPage.Form");

	const buildDefaultValues = (fueling?: FuelingData): FuelingForm => {
		if (!fueling) {
			return {
				VehicleId: "",
				Date: new Date().toISOString().split("T")[0],
				Liters: 0,
				PricePerLiter: 0,
				TotalCost: 0,
				Odometer: 0,
				FuelType: "",
				Station: "",
				Location: "",
				Driver: "",
				Notes: "",
				file: [],
			};
		}

		return {
			VehicleId: String(fueling.VehicleId),
			Date: fueling.Date,
			Liters: fueling.Liters,
			PricePerLiter: fueling.PricePerLiter,
			TotalCost: fueling.TotalCost,
			Odometer: fueling.Odometer,
			FuelType: fueling.FuelType,
			Station: fueling.Station,
			Location: fueling.Location,
			Driver: fueling.Driver || "",
			Notes: fueling.Notes || "",
			file: [],
		};
	};

	const form = useForm<FuelingForm>({
		resolver: zodResolver(FuelingFormSchema),
		defaultValues: buildDefaultValues(editingFueling),
	});

	const loading = false;

	const vehicleOptions = [
		{ label: "ABC1D23 - Corolla", value: "1" },
		{ label: "XYZ9F88 - Sprinter", value: "2" },
		{ label: "JKL3E55 - HB20", value: "3" },
	];

	const fuelTypeOptions = [
		{ label: "Gasolina", value: "Gasolina" },
		{ label: "Diesel", value: "Diesel" },
		{ label: "Etanol", value: "Etanol" },
		{ label: "GNV", value: "GNV" },
		{ label: "Elétrico", value: "Elétrico" },
	];

	const stationOptions = [
		{ label: "Posto Ipiranga", value: "Posto Ipiranga" },
		{ label: "Posto Shell", value: "Posto Shell" },
		{ label: "Posto Petrobras", value: "Posto Petrobras" },
		{ label: "Posto BR", value: "Posto BR" },
		{ label: "Posto Ale", value: "Posto Ale" },
	];

	const onErrors = (error: any) => {
		console.log(error);
		toast.error({
			title: t("errorMessage"),
		});
	};

	const onSubmit = async (data: FuelingForm) => {
		try {
			console.log(data);

			toast.success({
				title: editingFueling ? t("successUpdate") : t("successCreate"),
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
					onSubmit={form.handleSubmit(onSubmit, onErrors)}
					className="overflow-hidden"
					id="fueling-form"
				>
					<div className="flex flex-col gap-4 px-6 pb-6">
						{/* Veículo */}
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
											className="w-full col-span-12"
											name={field.name}
											control={form.control}
										/>
									)
								}
							/>
						</div>

						{/* Data e Odômetro */}
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
							<Controller
								name="Date"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-10" />
									) : (
										<FormItem className="col-span-6">
											<FormLabel>{t("date")}</FormLabel>
											<FormControl>
												<FormDatePicker
													id={field.name}
													value={
														field.value ? new Date(field.value) : undefined
													}
													onChange={(date) =>
														field.onChange(date?.toISOString().split("T")[0])
													}
													onBlur={field.onBlur}
													aria-invalid={fieldState.invalid}
													placeholder="15/12/2024"
													className="w-full"
													name={field.name}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)
								}
							/>
							<Controller
								name="Odometer"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldNumber
											{...field}
											label={t("odometer")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="0"
											formItemClassName="col-span-6"
											formatOptions={{ useGrouping: false }}
										/>
									)
								}
							/>
						</div>

						{/* Tipo de combustível e Litros */}
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
							<Controller
								name="FuelType"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-10" />
									) : (
										<FormFieldSelect
											label={t("fuelType")}
											value={field.value ?? ""}
											onValueChange={field.onChange}
											aria-invalid={fieldState.invalid}
											options={fuelTypeOptions}
											placeholder={t("selectFuelType")}
											className="w-full col-span-6"
											name={field.name}
											control={form.control}
										/>
									)
								}
							/>
							<Controller
								name="Liters"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldNumber
											{...field}
											label={t("liters")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="0"
											formItemClassName="col-span-6"
										/>
									)
								}
							/>
						</div>

						{/* Preço por litro e Custo total */}
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
							<Controller
								name="PricePerLiter"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldNumber
											{...field}
											label={t("pricePerLiter")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="0"
											formItemClassName="col-span-6"
											formatOptions={{
												style: "currency",
												currency: "BRL",
											}}
										/>
									)
								}
							/>
							<Controller
								name="TotalCost"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldNumber
											{...field}
											label={t("totalCost")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="0"
											formItemClassName="col-span-6"
											formatOptions={{
												style: "currency",
												currency: "BRL",
											}}
										/>
									)
								}
							/>
						</div>

						{/* Posto e Localização */}
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
							<Controller
								name="Station"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-10" />
									) : (
										<FormFieldSelect
											label={t("station")}
											value={field.value ?? ""}
											onValueChange={field.onChange}
											aria-invalid={fieldState.invalid}
											options={stationOptions}
											placeholder="Selecione o posto..."
											className="w-full col-span-6"
											name={field.name}
											control={form.control}
										/>
									)
								}
							/>
							<Controller
								name="Location"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldText
											{...field}
											label={t("location")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="São Paulo - SP"
											className="col-span-6"
										/>
									)
								}
							/>
						</div>

						{/* Motorista */}
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
							<Controller
								name="Driver"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldText
											{...field}
											label={t("driver")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="João Silva"
											className="col-span-12"
										/>
									)
								}
							/>
						</div>

						{/* Nota Fiscal */}
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
							<Controller
								name="file"
								control={form.control}
								render={({ field, fieldState }) => {
									const files = Array.isArray(field.value)
										? field.value
										: field.value
											? [field.value]
											: [];
									return loading ? (
										<Skeleton className="rounded-md w-full h-20" />
									) : (
										<FormItem className="col-span-12">
											<FormLabel>{t("receipt")}</FormLabel>
											<FormControl>
												<div className="space-y-3">
													<InputFile
														id={field.name}
														name={field.name}
														value={files.filter((f) => f)}
														onChange={(val) => {
															const next = Array.isArray(val)
																? val
																: val
																	? [val]
																	: [];
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
															const current = Array.isArray(field.value)
																? field.value
																: field.value
																	? [field.value]
																	: [];
															const next = current.filter(
																(f: any) => f.id !== id,
															);
															field.onChange(next);
														}}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						</div>
					</div>
				</form>
			</Form>
		</ScrollArea>
	);
}
