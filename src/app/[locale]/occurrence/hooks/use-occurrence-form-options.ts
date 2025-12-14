"use client";
import { type QueryClientConfig, useQuery } from "@tanstack/react-query";
import { createOptionsMapper } from "@/app/[locale]/vehicle/hooks/use-vehicle-form-options";
import { getData } from "@/lib/functions.api";
import type { ClassificationType, SeriousnessType } from "@/types/models";

export function useOccurrenceFormOptions() {
	const queryConfig = {
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	} as QueryClientConfig;

	const { data: severityOptions, isLoading: isLoadingSeriousness } = useQuery({
		queryKey: ["severity-get"],
		queryFn: ({ signal }) =>
			getData<SeriousnessType[]>({ url: "severity", signal }),
		select: createOptionsMapper("id", "level"),
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

	const isLoading = isLoadingSeriousness || isLoadingClassification;
	return {
		severityOptions: severityOptions ?? [],
		classificationOptions: classificationOptions ?? [],
		isLoadingOptions: isLoading,
	};
}
