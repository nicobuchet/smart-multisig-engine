import type { Abi, Address } from "viem";
import { encodeFunctionData } from "viem";
import type { EncodedCallData } from "./types.js";

export function extractCallData(params: {
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
  address: Address;
  value?: bigint;
}): EncodedCallData {
  const data = encodeFunctionData({
    abi: params.abi,
    functionName: params.functionName,
    args: params.args as unknown[],
  });

  return {
    to: params.address,
    data,
    value: params.value ?? 0n,
  };
}
