"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { subYears } from "date-fns";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import type {
	DriverData,
	DriverForm,
} from "@/app/[locale]/driver/types/types-driver";
import { DriverFormSchema } from "@/app/[locale]/driver/validation/validation-driver";
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

interface FormDriverProps {
	editingDriver?: DriverData;
	editingVehicle?: VehicleData;
}

export function FormDriverData({
	editingDriver,
	editingVehicle,
}: FormDriverProps) {
	const t = useTranslations("DriverPage.Form");

	const buildDefaultValues = useCallback((driver?: DriverData): DriverForm => {
		if (driver)
			return {
				Category: driver.Category ?? "",
				FirstName: driver.FirstName,
				LastName: driver.LastName,
				BirthDate: driver.BirthDate
					? new Date(driver.BirthDate).toISOString()
					: "",
				Email: driver.Email ?? "",
				Phone: driver.Phone ?? "",
				Street: driver.Street ?? "",
				Number: driver.Number ?? "",
				District: driver.District ?? "",
				City: driver.City ?? "",
				State: driver.State ?? "",
				Country: driver.Country ?? "",
				PostalCode: driver.PostalCode ?? "",

				Observation: driver.Observation ?? "",
			};

		return {
			FirstName: "",
			LastName: "",
			Category: "",
			BirthDate: "",
			Email: "",
			Phone: "",
			Street: "",
			Number: "",
			District: "",
			City: "",
			State: "",
			Country: "",
			PostalCode: "",
			Observation: "",
		};
	}, []);

	const form = useForm<DriverForm>({
		resolver: zodResolver(DriverFormSchema),
		defaultValues: buildDefaultValues(editingDriver),
	});
	const hasErrors = Object.keys(form.formState.errors)?.length > 0;

	const categoryOptions = ["A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"].map(
		(option) => ({
			label: option,
			value: option,
		}),
	);

	const loading = false;

	const onSubmit = async (data: DriverForm) => {
		try {
			console.log(data);

			toast.success({
				title: editingDriver ? t("successUpdate") : t("successCreate"),
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
					className={cn("overflow-hidden", hasErrors && "h-155")}
					id="driver-form"
				>
					<div className="flex flex-col gap-4 px-6 pb-6">
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
							<Controller
								name="FirstName"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldText
											{...field}
											label={t("firstNameLabel")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="John"
											className="col-span-6"
										/>
									)
								}
							/>
							<Controller
								name="LastName"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldText
											{...field}
											label={t("lastNameLabel")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="Smith"
											className="col-span-6"
										/>
									)
								}
							/>
						</div>
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
							<Controller
								name="Category"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-10" />
									) : (
										<FormFieldSelect
											label={t("categoryLabel")}
											value={field.value ?? ""}
											onValueChange={field.onChange}
											aria-invalid={fieldState.invalid}
											options={categoryOptions}
											placeholder={t("selectCategory")}
											className="w-full col-span-4"
											name={field.name}
											control={form.control}
										/>
									)
								}
							/>
							<Controller
								name="Email"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldText
											{...field}
											label={t("emailLabel")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="jonhdoe@gmail.com"
											className="col-span-4"
											type="email"
										/>
									)
								}
							/>
							<Controller
								name="BirthDate"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-10" />
									) : (
										<FormFieldDate
											{...field}
											label={t("birthDateLabel")}
											aria-invalid={fieldState.invalid}
											placeholder="04/09/1988"
											formItemClassName="col-span-4"
											form={form}
											control={form.control}
											presets={[
												{ label: "Há 10 anos", date: subYears(new Date(), 10) },
												{ label: "Há 20 anos", date: subYears(new Date(), 20) },
												{ label: "Há 30 anos", date: subYears(new Date(), 30) },
											]}
										/>
									)
								}
							/>
						</div>
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
							<Controller
								name="Phone"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldText
											{...field}
											label={t("phoneLabel")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="+55 9 98412-4482"
											className="col-span-6"
										/>
									)
								}
							/>
							<Controller
								name="Country"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldText
											{...field}
											label={t("countryLabel")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="Brasil"
											className="col-span-6"
										/>
									)
								}
							/>
						</div>
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
							<Controller
								name="PostalCode"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldText
											{...field}
											label={t("postalCodeLabel")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="60541-552"
											className="col-span-4"
										/>
									)
								}
							/>
							<Controller
								name="Street"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldText
											{...field}
											label={t("streetLabel")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="Avenida 13 de maio"
											className="col-span-6"
										/>
									)
								}
							/>
							<Controller
								name="Number"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldText
											{...field}
											label={t("numberLabel")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="42"
											className="col-span-2"
										/>
									)
								}
							/>
						</div>
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
							<Controller
								name="District"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldText
											{...field}
											label={t("districtLabel")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="Aldeota"
											className="col-span-4"
										/>
									)
								}
							/>
							<Controller
								name="City"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldText
											{...field}
											label={t("cityLabel")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="Maceió"
											className="col-span-4"
										/>
									)
								}
							/>
							<Controller
								name="State"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldText
											{...field}
											label={t("stateLabel")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="AL"
											className="col-span-4"
										/>
									)
								}
							/>
						</div>
						<div className="grid items-start gap-x-4 gap-y-4 sm:grid-cols-12">
							<Controller
								name="Observation"
								control={form.control}
								render={({ field, fieldState }) =>
									loading ? (
										<Skeleton className="rounded-md w-full h-8" />
									) : (
										<FormFieldTextarea
											{...field}
											label={t("observationLabel")}
											control={form.control}
											aria-invalid={fieldState.invalid}
											placeholder="Precisa usar óculos ao dirigir"
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
