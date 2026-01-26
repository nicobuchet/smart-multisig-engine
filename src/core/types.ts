import type { Abi, Address, Hex } from "viem";
export type { SafeMultisigTransactionResponse } from "@safe-global/types-kit";

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

export interface TxMatchCriteria {
  to: Address;
  value: bigint;
  data: Hex;
}
