import { describe, it, expect } from "vitest";
import { extractCallData } from "../extract-call-data.js";
import { encodeFunctionData } from "viem";

const TEST_ABI = [
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

describe("extractCallData", () => {
  it("encodes function call data correctly", () => {
    const result = extractCallData({
      abi: TEST_ABI,
      functionName: "transfer",
      args: ["0x1234567890abcdef1234567890abcdef12345678", 1000n],
      address: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    });

    expect(result.to).toBe("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    expect(result.value).toBe(0n);
    expect(result.data).toBe(
      encodeFunctionData({
        abi: TEST_ABI,
        functionName: "transfer",
        args: ["0x1234567890abcdef1234567890abcdef12345678", 1000n],
      }),
    );
  });

  it("uses provided value", () => {
    const result = extractCallData({
      abi: TEST_ABI,
      functionName: "transfer",
      args: ["0x1234567890abcdef1234567890abcdef12345678", 1000n],
      address: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      value: 5000n,
    });

    expect(result.value).toBe(5000n);
  });

  it("defaults value to 0n when not provided", () => {
    const result = extractCallData({
      abi: TEST_ABI,
      functionName: "transfer",
      args: ["0x1234567890abcdef1234567890abcdef12345678", 1000n],
      address: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    });

    expect(result.value).toBe(0n);
  });
});
