# smart-multisig-engine

A TypeScript utility library for submitting transactions to Safe multisig wallets and retrieving their `safeTxHash` from the Safe Transaction Service.

Built on [wagmi](https://wagmi.sh) and [viem](https://viem.sh).

## Install

```bash
pnpm add smart-multisig-engine
```

Peer dependencies: `@wagmi/core`, `viem`.

## Quick Start

Use `submitAndFindSafeTx` to simulate, submit, and find the Safe transaction hash in one call:

```typescript
import { submitAndFindSafeTx } from "smart-multisig-engine";
import { config } from "./wagmi-config";

const { safeTxHash, txHash } = await submitAndFindSafeTx({
  config,
  safeAddress: "0xYourSafeAddress",
  address: "0xTargetContract",
  abi: contractAbi,
  functionName: "transfer",
  args: [recipientAddress, amount],
  value: 0n,
  chainId: 1,
});

console.log("Safe TX Hash:", safeTxHash);
console.log("On-chain TX Hash:", txHash);
```

## Architecture

The library follows a **core/adapter** pattern:

- **Core** — Pure functions with no I/O. Can be used independently for encoding, matching, or URL resolution.
- **Adapter (Safe)** — I/O functions that wrap wagmi contract calls and the Safe Transaction Service API.

## API Reference

### Orchestrator

#### `submitAndFindSafeTx(options): Promise<SubmitAndFindSafeTxResult>`

Full flow: simulate → write → poll Safe TX Service → match → return `safeTxHash`.

```typescript
interface SubmitAndFindSafeTxOptions {
  config: Config;              // wagmi Config instance
  safeAddress: Address;        // The Safe wallet address to poll
  address: Address;            // Target contract address
  abi: Abi;                    // Contract ABI
  functionName: string;        // Function to call
  args?: readonly unknown[];   // Function arguments
  value?: bigint;              // ETH value (default: 0n)
  chainId?: number;            // Chain ID (auto-detected from config if omitted)
  account?: Address;           // Signer address
  serviceUrl?: string;         // Override Safe TX Service URL
  pollingInterval?: number;    // Polling interval in ms (default: 3000)
  maxAttempts?: number;        // Max poll attempts (default: 20)
}

interface SubmitAndFindSafeTxResult {
  safeTxHash: string;          // The Safe transaction hash
  txHash: `0x${string}`;      // The on-chain transaction hash
}
```

---

### Core Utilities

#### `extractCallData(params): EncodedCallData`

Encodes a contract function call into `{ to, data, value }` using viem's `encodeFunctionData`. Pure function, no network calls.

```typescript
import { extractCallData } from "smart-multisig-engine";

const callData = extractCallData({
  abi: myAbi,
  functionName: "transfer",
  args: [recipient, amount],
  address: "0xContractAddress",
  value: 0n,
});
// { to: "0x...", data: "0x...", value: 0n }
```

#### `matchPendingTransaction(pendingTxs, criteria): SafePendingTransaction | undefined`

Finds a pending Safe transaction matching `{ to, value, data }`. Comparison is case-insensitive for addresses and converts `bigint` value to string for matching.

```typescript
import { matchPendingTransaction } from "smart-multisig-engine";

const match = matchPendingTransaction(pendingTransactions, {
  to: "0xContractAddress",
  value: 0n,
  data: "0xEncodedCalldata",
});
```

#### `getSafeServiceUrl(chainId): string`

Resolves the Safe Transaction Service base URL for a chain ID. Throws if the chain is not in the known list.

```typescript
import { getSafeServiceUrl } from "smart-multisig-engine";

getSafeServiceUrl(1);        // "https://safe-transaction-mainnet.safe.global"
getSafeServiceUrl(11155111); // "https://safe-transaction-sepolia.safe.global"
```

#### `SAFE_TX_SERVICE_URLS`

The `Record<number, string>` map of supported chain IDs:

| Chain ID | Network |
|----------|---------|
| 1 | Ethereum Mainnet |
| 10 | Optimism |
| 56 | BSC |
| 100 | Gnosis Chain |
| 137 | Polygon |
| 8453 | Base |
| 42161 | Arbitrum |
| 11155111 | Sepolia |
| 84532 | Base Sepolia |

---

### Adapter Utilities

#### `simulateContractCall(config, params)`

Wraps wagmi's `simulateContract`. Validates the transaction will succeed before submission.

```typescript
import { simulateContractCall } from "smart-multisig-engine";

const simulation = await simulateContractCall(config, {
  address: "0xContract",
  abi: myAbi,
  functionName: "transfer",
  args: [recipient, amount],
});
```

#### `writeContractCall(config, request): Promise<Hex>`

Wraps wagmi's `writeContract`. Accepts the `request` from a prior simulation result.

```typescript
import { writeContractCall } from "smart-multisig-engine";

const txHash = await writeContractCall(config, simulation.request);
```

#### `fetchPendingTransactions(baseUrl, safeAddress): Promise<SafePendingTransaction[]>`

Fetches pending (unexecuted) multisig transactions from the Safe Transaction Service REST API.

```typescript
import { fetchPendingTransactions, getSafeServiceUrl } from "smart-multisig-engine";

const baseUrl = getSafeServiceUrl(1);
const pending = await fetchPendingTransactions(baseUrl, "0xSafeAddress");
```

---

## Using Individual Bricks

The orchestrator is a convenience wrapper. You can compose the bricks yourself for custom flows:

```typescript
import {
  extractCallData,
  matchPendingTransaction,
  getSafeServiceUrl,
  simulateContractCall,
  writeContractCall,
  fetchPendingTransactions,
} from "smart-multisig-engine";

// 1. Encode the call data
const callData = extractCallData({ abi, functionName, args, address, value });

// 2. Simulate
const simulation = await simulateContractCall(config, { abi, functionName, args, address, value });

// 3. Submit on-chain
const txHash = await writeContractCall(config, simulation.request);

// 4. Poll for the pending Safe transaction
const baseUrl = getSafeServiceUrl(chainId);
const pending = await fetchPendingTransactions(baseUrl, safeAddress);

// 5. Match
const match = matchPendingTransaction(pending, callData);
console.log(match?.safeTxHash);
```

## Development

```bash
pnpm install
pnpm build        # Bundle with tsup (ESM + CJS + .d.ts)
pnpm dev          # Watch mode
pnpm test         # Run vitest (watch mode)
pnpm test --run   # Run tests once
pnpm typecheck    # tsc --noEmit
pnpm clean        # Remove dist/
```

## License

ISC
