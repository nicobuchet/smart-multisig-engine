import type { Config } from "@wagmi/core";
import type { ContractCallParams } from "../../core/types.js";
import type { Address } from "viem";

export interface SubmitAndFindSafeTxOptions extends ContractCallParams {
  safeAddress: Address;
  config: Config;
  serviceUrl?: string;
  pollingInterval?: number;
  maxAttempts?: number;
}

export interface SubmitAndFindSafeTxResult {
  safeTxHash: string;
  txHash: `0x${string}`;
}
