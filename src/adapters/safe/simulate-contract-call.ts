import { simulateContract, type Config } from "@wagmi/core";
import type { ContractCallParams } from "../../core/types.js";

export async function simulateContractCall(
  config: Config,
  params: ContractCallParams,
) {
  return simulateContract(config, {
    address: params.address,
    abi: params.abi,
    functionName: params.functionName,
    args: params.args as unknown[],
    value: params.value,
    chainId: params.chainId,
    account: params.account,
  });
}
