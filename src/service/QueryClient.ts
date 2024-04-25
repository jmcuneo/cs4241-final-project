import {QueryClient} from "@tanstack/react-query";

export const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            staleTime: twentyFourHoursInMs
        }
    }
});
