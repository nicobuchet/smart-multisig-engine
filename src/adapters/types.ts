import type { Config } from "@wagmi/core";
import type { Address } from "viem";
import type { ContractCallParams } from "../core/types.js";

export type AdapterType = "safe";

export interface AdapterServiceOptions {
  txServiceUrl?: string;
  apiKey?: string;
}

export interface SubmitTxOptions
  extends ContractCallParams,
    AdapterServiceOptions {
  adapter: AdapterType;
  walletAddress: Address;
  config: Config;
  pollingInterval?: number;
  maxAttempts?: number;
}

export interface SubmitTxResult {
  txHash: string;
}

export interface WaitExecutionOptions extends AdapterServiceOptions {
  adapter: AdapterType;
  txHash: string;
  chainId: bigint;
  pollingInterval?: number;
  maxAttempts?: number;
}

export interface WaitExecutionResult {
  transactionHash: string;
}

export interface FetchPendingOptions extends AdapterServiceOptions {
  adapter: AdapterType;
  walletAddress: string;
  chainId: bigint;
}

export interface SimulateOptions extends ContractCallParams {
  adapter: AdapterType;
  config: Config;
}

export interface WriteOptions {
  adapter: AdapterType;
  config: Config;
  request: unknown;
}
