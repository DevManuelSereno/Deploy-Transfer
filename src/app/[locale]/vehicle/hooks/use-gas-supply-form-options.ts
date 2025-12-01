"use client";
import { type QueryClientConfig, useQuery } from "@tanstack/react-query";
import { createOptionsMapper } from "@/app/[locale]/vehicle/hooks/use-vehicle-form-options";
import { getData } from "@/lib/functions.api";
import type { GasStationType, GasType } from "@/types/models";

export function useGasSupplyFormOptions() {
	const queryConfig = {
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	} as QueryClientConfig;

	const { data: gasStationOptions, isLoading: isLoadingGasStation } = useQuery({
		queryKey: ["gasStation-get"],
		queryFn: ({ signal }) =>
			getData<GasStationType[]>({ url: "gasStation", signal }),
		select: createOptionsMapper("id", "name"),
		...queryConfig,
	});

	const { data: gasOptions, isLoading: isLoadingGas } = useQuery({
		queryKey: ["gas-get"],
		queryFn: ({ signal }) => getData<GasType[]>({ url: "gas", signal }),
		select: createOptionsMapper("id", "type"),
		...queryConfig,
	});

	const isLoading = isLoadingGasStation || isLoadingGas;
	return {
		gasStationOptions: gasStationOptions ?? [],
		gasOptions: gasOptions ?? [],
		isLoadingOptions: isLoading,
	};
}
