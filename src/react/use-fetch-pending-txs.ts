import { useQuery } from "@tanstack/react-query";
import { fetchPendingTxs } from "../adapters/index.js";
import type { FetchPendingOptions } from "../adapters/types.js";

export interface UseFetchPendingTxsOptions extends FetchPendingOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
}

export function useFetchPendingTxs(options: UseFetchPendingTxsOptions) {
  const { enabled = true, refetchInterval = false, ...fetchOptions } = options;

  return useQuery<unknown[], Error>({
    queryKey: [
      "adapter",
      options.adapter,
      "pendingTxs",
      options.walletAddress,
      options.chainId.toString(),
    ],
    queryFn: () => fetchPendingTxs(fetchOptions),
    enabled: enabled && !!options.walletAddress,
    refetchInterval,
  });
}
