import type { QueryClientConfig } from "@tanstack/react-query";

export const queryClientConfig = {
	defaultOptions: {
		queries: {
			retry: 3,
			// staleTime: 5 * 1000,
			// networkMode: "offlineFirst",
		},
		mutations: {
			networkMode: "offlineFirst",
		},
	},
} as QueryClientConfig;
