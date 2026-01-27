import { useQuery } from "@tanstack/react-query";
import { waitForExecution } from "../adapters/index.js";
import type { WaitForExecutionOptions, WaitForExecutionResult } from "../adapters/types.js";

export interface UseWaitForExecutionOptions extends Omit<WaitForExecutionOptions, "maxAttempts"> {
  /** Enable/disable the query. Defaults to true. */
  enabled?: boolean;
  /** Polling interval in ms. Defaults to 5000. */
  pollingInterval?: number;
  /** Timeout in ms. After this duration, the query will fail. Defaults to 120000 (2 min). */
  timeout?: number;
}

/**
 * Hook to wait for a Safe transaction to be executed on-chain.
 *
 * Unlike standard polling queries, this hook maintains a stable loading state
 * throughout the polling process (similar to wagmi's useWaitForTransactionReceipt):
 * - `isLoading` = true while waiting for execution
 * - `isSuccess` = true once transaction is executed
 * - `isError` = true if timeout is reached
 */
export function useWaitForExecution(options: UseWaitForExecutionOptions) {
  const {
    enabled = true,
    pollingInterval = 5000,
    timeout = 120000,
    ...waitOptions
  } = options;

  // Calculate max attempts from timeout and polling interval
  const maxAttempts = Math.ceil(timeout / pollingInterval);

  return useQuery<WaitForExecutionResult, Error>({
    queryKey: [
      "adapter",
      options.adapter,
      "waitForExecution",
      options.txHash,
      options.chainId.toString(),
    ],
    queryFn: () =>
      waitForExecution({
        ...waitOptions,
        pollingInterval,
        maxAttempts,
      }),
    enabled: enabled && !!options.txHash,
    // Don't refetch - the query handles polling internally
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    // Don't retry on error - timeout is intentional
    retry: false,
    // Keep data fresh
    staleTime: Infinity,
    // Cache result for this specific txHash
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}
