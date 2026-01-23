export const SAFE_TX_SERVICE_URLS: Record<number, string> = {
  1: "https://safe-transaction-mainnet.safe.global",
  10: "https://safe-transaction-optimism.safe.global",
  56: "https://safe-transaction-bsc.safe.global",
  100: "https://safe-transaction-gnosis-chain.safe.global",
  137: "https://safe-transaction-polygon.safe.global",
  8453: "https://safe-transaction-base.safe.global",
  42161: "https://safe-transaction-arbitrum.safe.global",
  11155111: "https://safe-transaction-sepolia.safe.global",
  84532: "https://safe-transaction-base-sepolia.safe.global",
};

export function getSafeServiceUrl(chainId: number): string {
  const url = SAFE_TX_SERVICE_URLS[chainId];
  if (!url) {
    throw new Error(
      `No Safe Transaction Service URL known for chain ID ${chainId}. ` +
        `Known chains: ${Object.keys(SAFE_TX_SERVICE_URLS).join(", ")}. ` +
        `Provide a custom serviceUrl instead.`,
    );
  }
  return url;
}
