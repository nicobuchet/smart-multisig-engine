import SafeApiKit from "@safe-global/api-kit";
import type { SafeMultisigTransactionResponse } from "@safe-global/types-kit";

export interface FetchPendingTransactionsParams {
  chainId: bigint;
  safeAddress: string;
  txServiceUrl?: string;
  apiKey?: string;
}

export async function fetchPendingTransactions(
  params: FetchPendingTransactionsParams,
): Promise<SafeMultisigTransactionResponse[]> {
  const apiKit = new SafeApiKit({
    chainId: params.chainId,
    ...(params.txServiceUrl && { txServiceUrl: params.txServiceUrl }),
    apiKey: params.apiKey,
  });

  const response = await apiKit.getPendingTransactions(params.safeAddress);
  return response.results;
}
