import { writeContract, type Config } from "@wagmi/core";
import type { Hex } from "viem";

export async function writeContractCall(
  config: Config,
  request: Parameters<typeof writeContract>[1],
): Promise<Hex> {
  return writeContract(config, request);
}
