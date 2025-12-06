"use client";
import { type QueryClientConfig, useQuery } from "@tanstack/react-query";
import { getData } from "@/lib/functions.api";
import type { BrandPassType } from "@/types/models";

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

export function useVehiclePassFormOptions() {
	const queryConfig = {
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	} as QueryClientConfig;

	// const { data: companyOptions, isLoading: isLoadingCompany } = useQuery({
	// 	queryKey: ["company-get"],
	// 	queryFn: ({ signal }) => getData<CompanyType[]>({ url: "company", signal }),
	// 	select: createOptionsMapper("id", "name"),
	// 	...queryConfig,
	// });

	const { data: brandOptions, isLoading: isLoadingBrand } = useQuery({
		queryKey: ["brand-get"],
		queryFn: ({ signal }) => getData<BrandPassType[]>({ url: "brand", signal }),
		select: createOptionsMapper("IDB", "Title"),
		...queryConfig,
	});
	const isLoading = isLoadingBrand;
	return {
		// companyOptions: companyOptions ?? [],
		brandOptions: brandOptions ?? [],
		isLoadingOptions: isLoading,
	};
}
