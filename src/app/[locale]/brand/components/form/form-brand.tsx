"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useBrandFormContext } from "@/app/[locale]/brand/context/brand-context";
import { useModalContext } from "@/app/[locale]/brand/context/modal-table-brand";
import type {
	BrandData,
	BrandForm,
	BrandPayload,
} from "@/app/[locale]/brand/types/types-brand";
import {
	BrandFormSchema,
	BrandPayloadSchema,
} from "@/app/[locale]/brand/validation/validation-brand";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { postData, putData, toastErrorsApi } from "@/lib/functions.api";
import type { BrandType, PostData, PutData } from "@/types/models";

export function FormBrand() {
	const t = useTranslations("BrandPage.Form");
	const { editingBrand, setEditingBrand } = useBrandFormContext();

	const { setIsModalEditOpen } = useModalContext();

	const buildDefaultValues = (brand?: BrandData): BrandForm => {
		if (!brand) {
			return {
				name: "Scania",
			};
		}

		return {
			name: brand.name ?? "",
		};
	};

	const { handleSubmit, control, reset } = useForm<BrandForm>({
		resolver: zodResolver(BrandFormSchema),
		defaultValues: buildDefaultValues(editingBrand),
	});

	const { mutateAsync: mutatePostBrand, isPending: isLoadingPostBrand } =
		useMutation({
			mutationFn: async (val: PostData<BrandPayload>) =>
				postData<BrandType, BrandPayload>(val),
			mutationKey: ["brand-post"],
		});

	const { mutateAsync: mutatePutBrand, isPending: isLoadingPutBrand } =
		useMutation({
			mutationFn: (val: PutData<BrandPayload>) =>
				putData<BrandType, BrandPayload>(val),
			mutationKey: ["brand-put"],
		});

	const loading = isLoadingPostBrand || isLoadingPutBrand;

	const onErrors = () => {
		toast.error(t("errorMessage"));
	};

	const onSubmit = async (data: BrandForm) => {
		try {
			let savedBrand: BrandType;

			const parseData = BrandPayloadSchema.parse(data);

			if (!editingBrand) {
				savedBrand = await mutatePostBrand({
					url: "/brand",
					data: parseData,
				});
			} else {
				// UPDATE
				savedBrand = await mutatePutBrand({
					url: "/brand",
					id: Number(editingBrand.id),
					data: parseData,
				});
			}

			setEditingBrand(savedBrand as any);

			const normalized = buildDefaultValues(savedBrand as any);

			reset(normalized);
			toast.success(
				editingBrand ? t("successUpdate") : t("successCreate"),
			);
			setIsModalEditOpen(false);
		} catch (error: any) {
			toastErrorsApi(error);
		}
	};
	return (
		<form autoComplete="off" onSubmit={handleSubmit(onSubmit, onErrors)}>
			<div className="flex w-full flex-col gap-4 space-y-5 p-6">
				<Controller
					name="name"
					control={control}
					render={({ field, fieldState }) =>
						loading ? (
							<Skeleton className="rounded-md w-full h-8" />
						) : (
							<Field
								data-invalid={fieldState.invalid}
								className="lg:col-span-2"
							>
								<FieldLabel htmlFor={field.name}>{t("name")}</FieldLabel>
								<Input
									{...field}
									aria-invalid={fieldState.invalid}
									placeholder={t("namePlaceholder")}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)
					}
				/>
			</div>
			<DialogFooter className="flex gap-2 sm:flex-row sm:justify-end flex-row justify-between! border-t rounded-b-xl px-6 py-4">
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
	);
}
