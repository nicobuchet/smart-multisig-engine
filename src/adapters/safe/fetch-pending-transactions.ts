import type { Address } from "viem";
import type { SafePendingTransaction } from "../../core/types.js";

export async function fetchPendingTransactions(
  baseUrl: string,
  safeAddress: Address,
): Promise<SafePendingTransaction[]> {
  const url = `${baseUrl}/api/v1/safes/${safeAddress}/multisig-transactions/?executed=false&ordering=-nonce`;
  const response = await fetch(url);

  console.log(
    `Fetching pending transactions from ${url}, status: ${response.status}`,
    response.json(),
  );

  if (!response.ok) {
    throw new Error(
      `Safe Transaction Service returned ${response.status}: ${response.statusText}`,
    );
  }

  const json = (await response.json()) as { results: SafePendingTransaction[] };
  return json.results;
}
