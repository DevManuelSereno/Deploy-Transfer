import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider as Provider } from "@tanstack/react-query";
import { queryClientConfig } from "@/lib/query-config";

const queryClient = new QueryClient(queryClientConfig);

export function QueryClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Provider client={queryClient}>{children}</Provider>;
}
