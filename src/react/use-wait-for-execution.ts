import { useQuery } from "@tanstack/react-query";
import { waitForExecution } from "../adapters/index.js";
import type { WaitForExecutionOptions, WaitForExecutionResult } from "../adapters/types.js";

export interface UseWaitForExecutionOptions extends WaitForExecutionOptions {
  enabled?: boolean;
  onSuccess?: (result: WaitForExecutionResult) => void;
}

export function useWaitForExecution(options: UseWaitForExecutionOptions) {
  const {
    enabled = true,
    pollingInterval = 5000,
    onSuccess,
    ...waitOptions
  } = options;

  return useQuery<WaitForExecutionResult, Error>({
    queryKey: [
      "adapter",
      options.adapter,
      "waitForExecution",
      options.txHash,
      options.chainId.toString(),
    ],
    queryFn: async () => {
      const result = await waitForExecution({
        ...waitOptions,
        pollingInterval,
        maxAttempts: 1, // Single attempt per query, let React Query handle retries
      });
      onSuccess?.(result);
      return result;
    },
    enabled: enabled && !!options.txHash,
    refetchInterval: pollingInterval,
    retry: false, // We handle polling via refetchInterval
    staleTime: 0,
  });
}
