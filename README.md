# smart-multisig-engine

A TypeScript utility library for submitting transactions to Safe multisig wallets and retrieving their `safeTxHash` from the Safe Transaction Service.

Built on [wagmi](https://wagmi.sh) and [viem](https://viem.sh).

## Install

```bash
pnpm add smart-multisig-engine
```

Peer dependencies: `@wagmi/core`, `viem`.

## Quick Start

Use `submitTx` with the generic adapter interface to submit transactions to any supported multisig:

```typescript
import { submitTx, waitForExecution } from "smart-multisig-engine";
import { config } from "./wagmi-config";

// Submit a transaction
const { txHash } = await submitTx({
  adapter: "safe",
  config,
  walletAddress: "0xYourSafeAddress",
  address: "0xTargetContract",
  abi: contractAbi,
  functionName: "transfer",
  args: [recipientAddress, amount],
  value: 0n,
  chainId: 1n,
});

console.log("Safe TX Hash:", txHash);

// Wait for execution
const { transactionHash } = await waitForExecution({
  adapter: "safe",
  txHash,
  chainId: 1n,
});

console.log("On-chain TX Hash:", transactionHash);
```

Or use the Safe adapter directly for more control:

```typescript
import { safe } from "smart-multisig-engine";
import { config } from "./wagmi-config";

const { safeTxHash, txHash } = await safe.submitAndFindSafeTx({
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
- **Adapters** — I/O implementations that wrap contract calls and external APIs. Currently supports Safe multisig.

### Generic Adapter Interface

The library provides adapter-agnostic entry points that route to the appropriate implementation:

```typescript
import { submitTx, waitForExecution, fetchPendingTxs, simulate, write } from "smart-multisig-engine";

// All functions take an `adapter` parameter to select the implementation
await submitTx({ adapter: "safe", ... });
await waitForExecution({ adapter: "safe", ... });
await fetchPendingTxs({ adapter: "safe", ... });
await simulate({ adapter: "safe", ... });
await write({ adapter: "safe", ... });
```

### Direct Adapter Access

For adapter-specific features, import the adapter namespace directly:

```typescript
import { safe } from "smart-multisig-engine";

// Access Safe-specific functions
await safe.submitAndFindSafeTx({ ... });
await safe.waitForExecution({ ... });
await safe.fetchPendingTransactions({ ... });
await safe.simulateContractCall(config, { ... });
await safe.writeContractCall(config, request);
```

## API Reference

### Generic Adapter Functions

These functions provide a unified interface across all adapters.

#### `submitTx(options): Promise<SubmitTxResult>`

Submit a transaction through the specified adapter.

```typescript
interface SubmitTxOptions {
  adapter: "safe";             // Adapter type
  config: Config;              // wagmi Config instance
  walletAddress: Address;      // The multisig wallet address
  address: Address;            // Target contract address
  abi: Abi;                    // Contract ABI
  functionName: string;        // Function to call
  args?: readonly unknown[];   // Function arguments
  value?: bigint;              // ETH value (default: 0n)
  chainId?: number;            // Chain ID
  txServiceUrl?: string;       // Override service URL
  apiKey?: string;             // API key for the service
  pollingInterval?: number;    // Polling interval in ms
  maxAttempts?: number;        // Max poll attempts
}

interface SubmitTxResult {
  txHash: string;              // The transaction hash (safeTxHash for Safe)
}
```

#### `waitForExecution(options): Promise<WaitForExecutionResult>`

Wait for a transaction to be executed on-chain.

```typescript
interface WaitForExecutionOptions {
  adapter: "safe";             // Adapter type
  txHash: string;              // Transaction hash to wait for
  chainId: bigint;             // Chain ID
  txServiceUrl?: string;       // Override service URL
  apiKey?: string;             // API key for the service
  pollingInterval?: number;    // Polling interval in ms (default: 5000)
  maxAttempts?: number;        // Max poll attempts (default: 60)
}

interface WaitForExecutionResult {
  transactionHash: string;     // The on-chain transaction hash
}
```

#### `fetchPendingTxs(options): Promise<unknown[]>`

Fetch pending transactions for a wallet.

```typescript
interface FetchPendingOptions {
  adapter: "safe";             // Adapter type
  walletAddress: string;       // The multisig wallet address
  chainId: bigint;             // Chain ID
  txServiceUrl?: string;       // Override service URL
  apiKey?: string;             // API key for the service
}
```

#### `simulate(options): Promise<unknown>`

Simulate a contract call before submission.

```typescript
interface SimulateOptions {
  adapter: "safe";             // Adapter type
  config: Config;              // wagmi Config instance
  address: Address;            // Target contract address
  abi: Abi;                    // Contract ABI
  functionName: string;        // Function to call
  args?: readonly unknown[];   // Function arguments
  value?: bigint;              // ETH value
  chainId?: number;            // Chain ID
}
```

#### `write(options): Promise<string>`

Write a contract call (submit the transaction).

```typescript
interface WriteOptions {
  adapter: "safe";             // Adapter type
  config: Config;              // wagmi Config instance
  request: unknown;            // Request from simulation result
}
```

---

### Safe Adapter

#### `safe.submitAndFindSafeTx(options): Promise<SubmitAndFindSafeTxResult>`

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
  txHash: `0x${string}`;       // The on-chain transaction hash
}
```

#### `safe.waitForExecution(options): Promise<WaitForExecutionResult>`

Poll the Safe Transaction Service until a transaction is executed.

```typescript
interface WaitForExecutionOptions {
  safeTxHash: string;          // The Safe transaction hash to monitor
  chainId: bigint;             // Chain ID
  txServiceUrl?: string;       // Override Safe TX Service URL
  apiKey?: string;             // API key for the Safe service
  pollingInterval?: number;    // Polling interval in ms (default: 5000)
  maxAttempts?: number;        // Max poll attempts (default: 60)
}

interface WaitForExecutionResult {
  transactionHash: string;     // The on-chain transaction hash
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

### Safe Low-Level Utilities

#### `safe.simulateContractCall(config, params)`

Wraps wagmi's `simulateContract`. Validates the transaction will succeed before submission.

```typescript
import { safe } from "smart-multisig-engine";

const simulation = await safe.simulateContractCall(config, {
  address: "0xContract",
  abi: myAbi,
  functionName: "transfer",
  args: [recipient, amount],
});
```

#### `safe.writeContractCall(config, request): Promise<Hex>`

Wraps wagmi's `writeContract`. Accepts the `request` from a prior simulation result.

```typescript
import { safe } from "smart-multisig-engine";

const txHash = await safe.writeContractCall(config, simulation.request);
```

#### `safe.fetchPendingTransactions(options): Promise<SafePendingTransaction[]>`

Fetches pending (unexecuted) multisig transactions from the Safe Transaction Service REST API.

```typescript
import { safe } from "smart-multisig-engine";

const pending = await safe.fetchPendingTransactions({
  safeAddress: "0xSafeAddress",
  chainId: 1n,
  apiKey: "optional-api-key",
});
```

---

## Using Individual Bricks

The high-level functions are convenience wrappers. You can compose the bricks yourself for custom flows:

```typescript
import {
  extractCallData,
  matchPendingTransaction,
  safe,
} from "smart-multisig-engine";

// 1. Encode the call data
const callData = extractCallData({ abi, functionName, args, address, value });

// 2. Simulate
const simulation = await safe.simulateContractCall(config, { abi, functionName, args, address, value });

// 3. Submit on-chain
const txHash = await safe.writeContractCall(config, simulation.request);

// 4. Poll for the pending Safe transaction
const pending = await safe.fetchPendingTransactions({
  safeAddress,
  chainId: 1n,
});

// 5. Match
const match = matchPendingTransaction(pending, callData);
console.log(match?.safeTxHash);

// 6. Wait for execution
const result = await safe.waitForExecution({
  safeTxHash: match.safeTxHash,
  chainId: 1n,
});
console.log("Executed:", result.transactionHash);
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
