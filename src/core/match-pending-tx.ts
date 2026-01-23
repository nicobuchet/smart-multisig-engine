import type { SafePendingTransaction, TxMatchCriteria } from "./types.js";

export function matchPendingTransaction(
  pendingTxs: SafePendingTransaction[],
  criteria: TxMatchCriteria,
): SafePendingTransaction | undefined {
  return pendingTxs.find(
    (tx) =>
      tx.to.toLowerCase() === criteria.to.toLowerCase() &&
      tx.value === String(criteria.value) &&
      tx.data?.toLowerCase() === criteria.data.toLowerCase(),
  );
}
