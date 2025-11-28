"use client";
import { type QueryClientConfig, useQuery } from "@tanstack/react-query";
import { getData } from "@/lib/functions.api";
import type {
	BrandType,
	CategoryType,
	ClassificationType,
	CompanyType,
	DocumentationType,
	GasType,
	StatusType,
} from "@/types/models";

/**
 * Cria uma função 'select' para o useQuery que mapeia um array de objetos
 * para um formato de opções { value, label }.
 *
 * @param valueKey A chave do objeto a ser usada como 'value' (ex: "id")
 * @param labelKey A chave do objeto a ser usada como 'label' (ex: "name", "type")
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const createOptionsMapper = <T extends Record<string, any>>(
	valueKey: keyof T,
	labelKey: keyof T,
) => {
	return (data: T[]) =>
		data.map((item) => ({
			value: String(item[valueKey]),
			label: String(item[labelKey]),
		}));
};

export function useVehicleFormOptions() {
	const queryConfig = {
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	} as QueryClientConfig;

	const { data: statusOptions, isLoading: isLoadingStatus } = useQuery({
		queryKey: ["status-get"],
		queryFn: ({ signal }) => getData<StatusType[]>({ url: "status", signal }),
		select: createOptionsMapper("id", "name"),
		...queryConfig,
	});

	const { data: companyOptions, isLoading: isLoadingCompany } = useQuery({
		queryKey: ["company-get"],
		queryFn: ({ signal }) => getData<CompanyType[]>({ url: "company", signal }),
		select: createOptionsMapper("id", "name"),
		...queryConfig,
	});

	const { data: brandOptions, isLoading: isLoadingBrand } = useQuery({
		queryKey: ["brand-get"],
		queryFn: ({ signal }) => getData<BrandType[]>({ url: "brand", signal }),
		select: createOptionsMapper("id", "name"),
		...queryConfig,
	});

	const { data: categoryOptions, isLoading: isLoadingCategory } = useQuery({
		queryKey: ["category-get"],
		queryFn: ({ signal }) =>
			getData<CategoryType[]>({ url: "category", signal }),
		select: createOptionsMapper("id", "name"),
		...queryConfig,
	});

	const { data: classificationOptions, isLoading: isLoadingClassification } =
		useQuery({
			queryKey: ["classification-get"],
			queryFn: ({ signal }) =>
				getData<ClassificationType[]>({ url: "classification", signal }),
			select: createOptionsMapper("id", "description"),
			...queryConfig,
		});

	const { data: gasOptions, isLoading: isLoadingGas } = useQuery({
		queryKey: ["gas-get"],
		queryFn: ({ signal }) => getData<GasType[]>({ url: "gas", signal }),
		select: createOptionsMapper("id", "type"),
		...queryConfig,
	});

	const isLoading =
		isLoadingStatus ||
		isLoadingCompany ||
		isLoadingBrand ||
		isLoadingClassification ||
		isLoadingCategory ||
		isLoadingGas;

	return {
		statusOptions: statusOptions ?? [],
		companyOptions: companyOptions ?? [],
		brandOptions: brandOptions ?? [],
		categoryOptions: categoryOptions ?? [],
		classificationOptions: classificationOptions ?? [],
		gasOptions: gasOptions ?? [],
		isLoadingOptions: isLoading,
	};
}
