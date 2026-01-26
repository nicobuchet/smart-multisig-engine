import type { SafeMultisigTransactionResponse } from "@safe-global/types-kit";
import type { TxMatchCriteria } from "./types.js";

export function matchPendingTransaction(
  pendingTxs: SafeMultisigTransactionResponse[],
  criteria: TxMatchCriteria,
): SafeMultisigTransactionResponse | undefined {
  return pendingTxs.find(
    (tx) =>
      tx.to.toLowerCase() === criteria.to.toLowerCase() &&
      tx.value === String(criteria.value) &&
      tx.data?.toLowerCase() === criteria.data.toLowerCase(),
  );
}
