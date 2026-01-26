import SafeApiKit from "@safe-global/api-kit";
import type {
  WaitForExecutionOptions,
  WaitForExecutionResult,
} from "./types.js";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForExecution(
  options: WaitForExecutionOptions,
): Promise<WaitForExecutionResult> {
  const {
    safeTxHash,
    chainId,
    txServiceUrl,
    apiKey,
    pollingInterval = 5000,
    maxAttempts = 60,
  } = options;

  const apiKit = new SafeApiKit({
    chainId,
    ...(txServiceUrl && { txServiceUrl }),
    apiKey,
  });

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const tx = await apiKit.getTransaction(safeTxHash);

    if (tx.isExecuted && tx.transactionHash) {
      return {
        transactionHash: tx.transactionHash,
      };
    }

    await delay(pollingInterval);
  }

  throw new Error(
    `Safe transaction ${safeTxHash} was not executed after ${maxAttempts} attempts`,
  );
}
