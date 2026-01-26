import { describe, it, expect } from "vitest";
import { matchPendingTransaction } from "../match-pending-tx.js";
import type { SafeMultisigTransactionResponse } from "@safe-global/types-kit";

const makeTx = (
  overrides: Partial<SafeMultisigTransactionResponse> = {},
): SafeMultisigTransactionResponse =>
  ({
    safeTxHash: "0xabc123",
    to: "0x1111111111111111111111111111111111111111",
    value: "0",
    data: "0xdeadbeef",
    operation: 0,
    nonce: "1",
    submissionDate: "2024-01-01T00:00:00Z",
    isExecuted: false,
    ...overrides,
  }) as SafeMultisigTransactionResponse;

describe("matchPendingTransaction", () => {
  it("finds a matching transaction", () => {
    const txs = [
      makeTx({ safeTxHash: "0x111" }),
      makeTx({
        safeTxHash: "0x222",
        to: "0x2222222222222222222222222222222222222222",
        value: "1000",
        data: "0xcafebabe",
      }),
    ];

    const result = matchPendingTransaction(txs, {
      to: "0x2222222222222222222222222222222222222222",
      value: 1000n,
      data: "0xcafebabe",
    });

    expect(result?.safeTxHash).toBe("0x222");
  });

  it("returns undefined when no match", () => {
    const txs = [makeTx()];

    const result = matchPendingTransaction(txs, {
      to: "0x9999999999999999999999999999999999999999",
      value: 0n,
      data: "0xdeadbeef",
    });

    expect(result).toBeUndefined();
  });

  it("matches addresses case-insensitively", () => {
    const txs = [
      makeTx({ to: "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" }),
    ];

    const result = matchPendingTransaction(txs, {
      to: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      value: 0n,
      data: "0xdeadbeef",
    });

    expect(result).toBeDefined();
  });

  it("compares value as bigint to string", () => {
    const txs = [makeTx({ value: "1000000000000000000" })];

    const result = matchPendingTransaction(txs, {
      to: "0x1111111111111111111111111111111111111111",
      value: 1000000000000000000n,
      data: "0xdeadbeef",
    });

    expect(result).toBeDefined();
  });

  it("returns undefined when data is undefined on the pending tx", () => {
    const txs = [makeTx({ data: undefined })];

    const result = matchPendingTransaction(txs, {
      to: "0x1111111111111111111111111111111111111111",
      value: 0n,
      data: "0xdeadbeef",
    });

    expect(result).toBeUndefined();
  });
});
