import { describe, it, expect } from "vitest";
import { getSafeServiceUrl, SAFE_TX_SERVICE_URLS } from "../safe-tx-service-urls.js";

describe("getSafeServiceUrl", () => {
  it("returns mainnet URL for chain ID 1", () => {
    expect(getSafeServiceUrl(1)).toBe(
      "https://safe-transaction-mainnet.safe.global",
    );
  });

  it("returns sepolia URL for chain ID 11155111", () => {
    expect(getSafeServiceUrl(11155111)).toBe(
      "https://safe-transaction-sepolia.safe.global",
    );
  });

  it("throws for unknown chain ID", () => {
    expect(() => getSafeServiceUrl(999999)).toThrow(
      "No Safe Transaction Service URL known for chain ID 999999",
    );
  });
});

describe("SAFE_TX_SERVICE_URLS", () => {
  it("contains entries for major networks", () => {
    expect(SAFE_TX_SERVICE_URLS[1]).toBeDefined();
    expect(SAFE_TX_SERVICE_URLS[137]).toBeDefined();
    expect(SAFE_TX_SERVICE_URLS[42161]).toBeDefined();
    expect(SAFE_TX_SERVICE_URLS[8453]).toBeDefined();
  });
});
