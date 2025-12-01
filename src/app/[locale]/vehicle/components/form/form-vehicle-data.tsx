"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useModalContext } from "@/app/[locale]/vehicle/context/modal-table-vehicle";
import { useVehicleFormContext } from "@/app/[locale]/vehicle/context/vehicle-context";
import { useVehicleFormOptions } from "@/app/[locale]/vehicle/hooks/use-vehicle-form-options";
import type {
	ImageValue,
	VehicleData,
	VehicleForm,
	VehiclePayload,
} from "@/app/[locale]/vehicle/types/types-vehicle";
import {
	VehicleFormSchema,
	VehiclePayloadSchema,
} from "@/app/[locale]/vehicle/validation/validation-vehicle";
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

export function FormVehicleData() {
	const { editingVehicle, setEditingVehicle } = useVehicleFormContext();

	const { setTabPanel } = useModalContext();

	const buildDefaultValues = (vehicle?: VehicleData): VehicleForm => {
		if (!vehicle) {
			return {
				identifier: "001",
				model: "Buss Vista 340",
				year: "2023",
				capacity: 46,
				doors: 1,
				uf: "RJ",
				plateType: "MERCOSUL" as PlateType,
				plate: "SQX8A12",
				renavam: "13653733521",
				chassi: "9BD111060T5002156",
				review: 0,
				description: "",
				gasId: "1",
				brandId: "1",
				classificationId: "1",
				categoryId: "1",
				companyId: "1",
				statusId: "3",
				photos: [],
			};
		}

		return {
			identifier: vehicle.identifier ?? "",
			model: vehicle.model ?? "",
			year: vehicle.year ?? "",
			capacity: vehicle.capacity ?? 0,
			doors: vehicle.doors ?? 0,
			uf: vehicle.uf ?? "",
			plateType: (vehicle.plateType ?? "MERCOSUL") as PlateType,
			plate: vehicle.plate ?? "",
			renavam: vehicle.renavam ?? "",
			chassi: vehicle.chassi ?? "",
			review: vehicle.review ?? 0,
			description: vehicle.description ?? "",
			gasId: String(vehicle.gasId ?? ""),
			brandId: String(vehicle.brandId ?? ""),
			classificationId: String(vehicle.classificationId ?? ""),
			categoryId: String(vehicle.categoryId ?? ""),
			companyId: String(vehicle.companyId ?? ""),
			statusId: String(vehicle.statusId ?? ""),
			photos:
				vehicle.photos?.map((photo: string) => ({
					id: String(photo ?? crypto.randomUUID()),
					url: api.getUri() + photo,
					name: photo ?? undefined,
				})) ?? [],
		};
	};

	const {
		handleSubmit,
		control,
		reset,
		formState: { isDirty },
	} = useForm<VehicleForm>({
		resolver: zodResolver(VehicleFormSchema),
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
			mutationFn: async (val: PostData<VehiclePayload>) =>
				postData<VehicleType, VehiclePayload>(val),
			mutationKey: ["vehicle-post"],
		});

	const { mutateAsync: mutatePutVehicle, isPending: isLoadingPutVehicle } =
		useMutation({
			mutationFn: (val: PutData<VehiclePayload>) =>
				putData<VehicleType, VehiclePayload>(val),
			mutationKey: ["vehicle-put"],
		});

	const {
		statusOptions,
		companyOptions,
		brandOptions,
		classificationOptions,
		categoryOptions,
		gasOptions,
		isLoadingOptions,
	} = useVehicleFormOptions();

	const plateTypeOptions = PlateTypeSchema.options.map((option) => ({
		label: option,
		value: option,
	}));

	const loading =
		isLoadingPostVehicle || isLoadingPutVehicle || isLoadingOptions;
	// const loading = true;

	const onErrors = () => {
		toast.error("Por favor, corrija os erros no formulário.");
	};

	const onSubmit = async (data: VehicleForm) => {
		try {
			let savedVehicle: VehicleType;

			if (!isDirty && editingVehicle) {
				setTabPanel("tab-documentation");
				return;
			}

			const parseData = VehiclePayloadSchema.parse({
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
					id: Number(editingVehicle.id),
					data: parseData,
				});
			}

			const hasNewFiles =
				data.photos?.some((img: ImageValue) => !!img.file) ?? false;

			if (hasNewFiles) {
				const formData = new FormData();

				for (const img of data.photos ?? []) {
					if (img.file) {
						formData.append("photos", img.file);
					}
				}

				savedVehicle = await mutateUploadPhotos({
					id: savedVehicle.id,
					formData,
				});
			}

			setEditingVehicle(savedVehicle as any);

			const normalized = buildDefaultValues(savedVehicle as any);

			reset(normalized);
			toast.success(
				editingVehicle
					? "Veículo atualizado com sucesso"
					: "Veículo cadastrado com sucesso",
			);
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
					<Controller
						name="identifier"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<Field
									data-invalid={fieldState.invalid}
									className="lg:col-span-2"
								>
									<FieldLabel htmlFor={field.name}>Identificador</FieldLabel>
									<Input
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="Transfer Paulo"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)
						}
					/>
					<Controller
						name="companyId"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-10" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Companhia</FieldLabel>
									<FormSelect
										id={field.name}
										value={field.value ?? ""}
										onChange={field.onChange}
										onBlur={field.onBlur}
										aria-invalid={fieldState.invalid}
										options={companyOptions}
										placeholder="Selecione uma companhia..."
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
						name="statusId"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-10" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Status</FieldLabel>
									<FormSelect
										id={field.name}
										value={field.value ?? ""}
										onChange={field.onChange}
										onBlur={field.onBlur}
										aria-invalid={fieldState.invalid}
										options={statusOptions}
										placeholder="Selecione um status..."
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
				<FieldGroup className="grid grid-cols-1 lg:grid-cols-4 gap-4">
					<Controller
						name="model"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<Field
									data-invalid={fieldState.invalid}
									className="lg:col-span-2"
								>
									<FieldLabel htmlFor={field.name}>Modelo</FieldLabel>
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
					<Controller
						name="year"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Ano</FieldLabel>
									<Input
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="2012"
										maxLength={4}
										minLength={4}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)
						}
					/>
					<Controller
						name="brandId"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-10" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Marca</FieldLabel>
									<FormSelect
										id={field.name}
										value={field.value ?? ""}
										onChange={field.onChange}
										onBlur={field.onBlur}
										aria-invalid={fieldState.invalid}
										options={brandOptions}
										placeholder="Selecione uma marca..."
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
				<FieldGroup className="grid grid-cols-1 lg:grid-cols-4 gap-4">
					<Controller
						name="capacity"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Capacidade</FieldLabel>
									<InputNumber
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="45"
										value={Number(field.value)}
										min={1}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)
						}
					/>
					<Controller
						name="doors"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Portas</FieldLabel>
									<InputNumber
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="4"
										value={Number(field.value)}
										min={1}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)
						}
					/>
					<Controller
						name="categoryId"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-10" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Categoria</FieldLabel>
									<FormSelect
										id={field.name}
										value={field.value ?? ""}
										onChange={field.onChange}
										onBlur={field.onBlur}
										aria-invalid={fieldState.invalid}
										options={categoryOptions}
										placeholder="Selecione uma categoria..."
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
										placeholder="Selecione uma classificação..."
										className="w-full "
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
				<FieldGroup className="grid grid-cols-1 lg:grid-cols-4 gap-4">
					<Controller
						name="uf"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>UF</FieldLabel>
									<Input
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="SP"
										minLength={2}
										maxLength={2}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)
						}
					/>
					<Controller
						name="review"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Revisão</FieldLabel>
									<InputNumber
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="2400"
										decimalScale={3}
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
									<FieldLabel htmlFor={field.name}>Combustível</FieldLabel>
									<FormSelect
										id={field.name}
										value={field.value ?? ""}
										onChange={field.onChange}
										onBlur={field.onBlur}
										aria-invalid={fieldState.invalid}
										options={gasOptions}
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
						name="plateType"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-10" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Tipo de Placa</FieldLabel>
									<FormSelect
										id={field.name}
										value={field.value ?? ""}
										onChange={field.onChange}
										onBlur={field.onBlur}
										aria-invalid={fieldState.invalid}
										options={plateTypeOptions}
										placeholder="Selecione um tipo..."
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
				<FieldGroup className="grid grid-cols-1 lg:grid-cols-4 gap-4">
					<Controller
						name="plate"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Placa</FieldLabel>
									<Input
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="OCH1A34"
										minLength={7}
										maxLength={8}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)
						}
					/>
					<Controller
						name="renavam"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-8" />
							) : (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Renavam</FieldLabel>
									<Input
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="13248512471"
										maxLength={11}
										minLength={11}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)
						}
					/>
					<Controller
						name="chassi"
						control={control}
						render={({ field, fieldState }) =>
							loading ? (
								<Skeleton className="rounded-md w-full h-10" />
							) : (
								<Field
									data-invalid={fieldState.invalid}
									className="lg:col-span-2"
								>
									<FieldLabel htmlFor={field.name}>Chassi</FieldLabel>
									<Input
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="9BD111060T5002156"
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
									placeholder="316"
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
					name="photos"
					control={control}
					render={({ field, fieldState }) => {
						const images: ImageValue[] = field.value ?? [];

						return (
							<Field
								data-invalid={fieldState.invalid}
								className="lg:col-span-2"
							>
								<FieldLabel htmlFor={field.name}>Imagens</FieldLabel>

								<InputImage
									id={field.name}
									name={field.name}
									value={images}
									onChange={field.onChange}
									ref={field.ref}
									aria-invalid={fieldState.invalid}
									maxFiles={10} // opcional
								/>

								<ImagePreviewGrid
									images={images}
									onRemove={(id) => {
										const next = images.filter((img) => img.id !== id);
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
			</div>
			<DialogFooter className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
				<DialogClose asChild>
					<Button variant="outline">Cancelar</Button>
				</DialogClose>
				{loading ? (
					<Skeleton className="rounded-md w-full h-8" />
				) : (
					<Button type="submit">Continuar</Button>
				)}
			</DialogFooter>
		</form>
	);
}
