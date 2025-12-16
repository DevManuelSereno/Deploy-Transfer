"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import type {
	FuelingData,
	FuelingForm,
} from "@/app/[locale]/fueling/types/types-fueling";
import { FuelingFormSchema } from "@/app/[locale]/fueling/validation/validation-fueling";
import { FormErrorMessage } from "@/components/form/form-error-message";
import { FormFieldDate } from "@/components/form/form-field-date";
import { FormFieldNumber } from "@/components/form/form-field-number";
import { FormFieldSelect } from "@/components/form/form-field-select";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { toastErrorsApi } from "@/lib/functions.api";
import { cn } from "@/lib/utils";

interface FormFuelingProps {
	editingFueling?: FuelingData;
}

export function FormFuelingData({ editingFueling }: FormFuelingProps) {
	const t = useTranslations("FuelingPage.Form");

	const buildDefaultValues = (fueling?: FuelingData): FuelingForm => {
		if (!fueling) {
			return {
				FuelingAt: new Date().toISOString(),
				DriverId: "Maria Oliveira",
				VehicleId: "1",
				ProviderId: "Posto BR",
				MaintenanceDue: null,
				Odometer: 0,
				Fuel: "Gasolina",
				Total: 0,
			};
		}

		return {
			FuelingAt: fueling.FuelingAt,
			DriverId: String(fueling.DriverId),
			VehicleId: String(fueling.VehicleId),
			ProviderId: String(fueling.ProviderId),
			MaintenanceDue: fueling.MaintenanceDue ?? null,
			Odometer: fueling.Odometer,
			Fuel: fueling.Fuel,
			Total: fueling.Total,
		};
	};

	const form = useForm<FuelingForm>({
		resolver: zodResolver(FuelingFormSchema),
		defaultValues: buildDefaultValues(editingFueling),
	});
	const hasErrors = Object.keys(form.formState.errors)?.length > 0;

	const loading = false;

	const vehicleOptions = [
		{ label: "ABC1D23 - Corolla", value: "1" },
		{ label: "XYZ9F88 - Sprinter", value: "2" },
		{ label: "JKL3E55 - HB20", value: "3" },
	];

	const fuelOptions = [
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

	const driverOptions = [
		{ label: "João Silva", value: "João Silva" },
		{ label: "Maria Oliveira", value: "Maria Oliveira" },
		{ label: "Carlos Santos", value: "Carlos Santos" },
		{ label: "Ana Pereira", value: "Ana Pereira" },
		{ label: "Rafael Costa", value: "Rafael Costa" },
		{ label: "Fernanda Lima", value: "Fernanda Lima" },
		{ label: "Lucas Almeida", value: "Lucas Almeida" },
		{ label: "Beatriz Rocha", value: "Beatriz Rocha" },
	];

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
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn("overflow-hidden", hasErrors && "h-[280px]")}
					id="fueling-form"
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
								name="DriverId"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldSelect
											label={t("driver")}
											value={field.value ?? ""}
											onValueChange={field.onChange}
											aria-invalid={fieldState.invalid}
											options={driverOptions}
											placeholder={t("selectDriver")}
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
								name="FuelingAt"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-10" />
									) : (
										<FormFieldDate
											name={field.name}
											form={form}
											control={form.control}
											label={t("date")}
											aria-invalid={fieldState.invalid}
											placeholder="15/12/2024"
											formItemClassName="w-full col-span-6"
										/>
									)
								}
							/>

							<Controller
								name="ProviderId"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-10" />
									) : (
										<FormFieldSelect
											label={t("station")}
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
						</div>

						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
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
											className="w-full col-span-3"
											name={field.name}
											control={form.control}
										/>
									)
								}
							/>
							<Controller
								name="MaintenanceDue"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldNumber
											{...field}
											label={t("maintenanceDue")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="0"
											value={field.value ?? 0}
											formItemClassName="col-span-3"
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
											formItemClassName="col-span-3"
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
								name="Total"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldNumber
											{...field}
											label={t("total")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="0"
											formItemClassName="col-span-3"
											formatOptions={{
												style: "currency",
												currency: "BRL",
											}}
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
