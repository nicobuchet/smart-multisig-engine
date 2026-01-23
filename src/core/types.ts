import type { Abi, Address, Hex } from "viem";

export interface ContractCallParams {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
  value?: bigint;
  chainId?: number;
  account?: Address;
}

export interface EncodedCallData {
  to: Address;
  data: Hex;
  value: bigint;
}

export interface SafePendingTransaction {
  safeTxHash: string;
  to: Address;
  value: string;
  data: Hex | null;
  operation: number;
  nonce: number;
  submissionDate: string;
  confirmations: Array<{
    owner: Address;
    signature: string;
    submissionDate: string;
  }>;
  isExecuted: boolean;
}

export interface TxMatchCriteria {
  to: Address;
  value: bigint;
  data: Hex;
}
