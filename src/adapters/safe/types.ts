import type { Config } from "@wagmi/core";
import type { ContractCallParams } from "../../core/types.js";
import type { Address } from "viem";

export interface SafeServiceOptions {
  txServiceUrl?: string;
  apiKey?: string;
}

export interface SubmitAndFindSafeTxOptions extends ContractCallParams, SafeServiceOptions {
  safeAddress: Address;
  config: Config;
  pollingInterval?: number;
  maxAttempts?: number;
}

export interface SubmitAndFindSafeTxResult {
  safeTxHash: string;
}

export interface WaitForExecutionOptions extends SafeServiceOptions {
  safeTxHash: string;
  chainId: bigint;
  pollingInterval?: number;
  maxAttempts?: number;
}

export interface WaitForExecutionResult {
  transactionHash: string;
}
