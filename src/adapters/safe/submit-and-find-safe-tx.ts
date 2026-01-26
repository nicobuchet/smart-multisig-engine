import { extractCallData } from "../../core/extract-call-data.js";
import { matchPendingTransaction } from "../../core/match-pending-tx.js";
import { fetchPendingTransactions } from "./fetch-pending-transactions.js";
import { simulateContractCall } from "./simulate-contract-call.js";
import { writeContractCall } from "./write-contract-call.js";
import type {
  SubmitAndFindSafeTxOptions,
  SubmitAndFindSafeTxResult,
} from "./types.js";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitAndFindSafeTx(
  options: SubmitAndFindSafeTxOptions,
): Promise<SubmitAndFindSafeTxResult> {
  const {
    config,
    safeAddress,
    txServiceUrl,
    apiKey,
    pollingInterval = 3000,
    maxAttempts = 20,
    ...callParams
  } = options;

  const callData = extractCallData(callParams);

  const simulation = await simulateContractCall(config, callParams);

  await writeContractCall(config, simulation.request as Parameters<typeof writeContractCall>[1]);

  const chainId = BigInt(callParams.chainId ?? (await getChainId(config)));

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await delay(pollingInterval);

    const pendingTxs = await fetchPendingTransactions({
      chainId,
      safeAddress,
      txServiceUrl,
      apiKey,
    });
    const match = matchPendingTransaction(pendingTxs, callData);

    if (match) {
      return {
        safeTxHash: match.safeTxHash,
      };
    }
  }

  throw new Error(
    `Could not find matching Safe transaction after ${maxAttempts} attempts`,
  );
}

async function getChainId(config: Parameters<typeof simulateContractCall>[0]): Promise<number> {
  const { getChainId: wagmiGetChainId } = await import("@wagmi/core");
  return wagmiGetChainId(config);
}
