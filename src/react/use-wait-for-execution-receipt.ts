import { useQuery } from "@tanstack/react-query";
import { waitForTransactionReceipt } from "@wagmi/core";
import type { Config } from "@wagmi/core";
import type { TransactionReceipt } from "viem";
import { waitForExecution } from "../adapters/index.js";
import type { WaitForExecutionOptions } from "../adapters/types.js";

export interface UseWaitForExecutionReceiptOptions
  extends Omit<WaitForExecutionOptions, "maxAttempts"> {
  /** Wagmi config for fetching the receipt. */
  config: Config;
  /** Enable/disable the query. Defaults to true. */
  enabled?: boolean;
  /** Polling interval in ms for Safe tx. Defaults to 5000. */
  pollingInterval?: number;
  /** Timeout in ms for Safe tx execution. Defaults to 120000 (2 min). */
  timeout?: number;
  /** Number of confirmations to wait for. Defaults to 1. */
  confirmations?: number;
}

export interface WaitForExecutionReceiptResult {
  /** The on-chain transaction hash. */
  transactionHash: string;
  /** The full transaction receipt with logs. */
  receipt: TransactionReceipt;
}

/**
 * Hook to wait for a Safe transaction to be executed and return the full receipt with logs.
 *
 * Combines waiting for Safe execution with fetching the transaction receipt:
 * 1. Polls Safe Transaction Service until the tx is executed
 * 2. Fetches the on-chain transaction receipt with logs
 *
 * @example
 * ```tsx
 * const { data, isLoading, isSuccess } = useWaitForExecutionReceipt({
 *   adapter: "safe",
 *   txHash: safeTxHash,
 *   chainId: 11155111n,
 *   config: wagmiConfig,
 * });
 *
 * if (isSuccess) {
 *   console.log("Logs:", data.receipt.logs);
 * }
 * ```
 */
export function useWaitForExecutionReceipt(
  options: UseWaitForExecutionReceiptOptions
) {
  const {
    config,
    enabled = true,
    pollingInterval = 5000,
    timeout = 120000,
    confirmations = 1,
    ...waitOptions
  } = options;

  const maxAttempts = Math.ceil(timeout / pollingInterval);

  return useQuery<WaitForExecutionReceiptResult, Error>({
    queryKey: [
      "adapter",
      options.adapter,
      "waitForExecutionReceipt",
      options.txHash,
      options.chainId.toString(),
      confirmations,
    ],
    queryFn: async () => {
      // Step 1: Wait for Safe tx to be executed
      const { transactionHash } = await waitForExecution({
        ...waitOptions,
        pollingInterval,
        maxAttempts,
      });

      // Step 2: Get the transaction receipt with logs
      const receipt = await waitForTransactionReceipt(config, {
        hash: transactionHash as `0x${string}`,
        confirmations,
      });

      return {
        transactionHash,
        receipt,
      };
    },
    enabled: enabled && !!options.txHash,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5,
  });
}
