import { adapters } from "./registry.js";
import type {
  AdapterType,
  SubmitTxOptions,
  SubmitTxResult,
  WaitForExecutionOptions,
  WaitForExecutionResult,
  FetchPendingOptions,
  SimulateOptions,
  WriteOptions,
} from "./types.js";

// Re-export types
export * from "./types.js";

// Re-export Safe adapter for direct access
export * as safe from "./safe/index.js";

// Generic entry functions

export async function submitTx(
  options: SubmitTxOptions,
): Promise<SubmitTxResult> {
  const { adapter, walletAddress, ...rest } = options;
  assertAdapter(adapter);

  const result = await adapters[adapter].submitTx({
    safeAddress: walletAddress,
    ...rest,
  });

  return { txHash: result.safeTxHash };
}

export async function waitForExecution(
  options: WaitForExecutionOptions,
): Promise<WaitForExecutionResult> {
  const { adapter, txHash, ...rest } = options;
  assertAdapter(adapter);

  const result = await adapters[adapter].waitForExecution({
    safeTxHash: txHash,
    ...rest,
  });

  return { transactionHash: result.transactionHash };
}

export async function fetchPendingTxs(
  options: FetchPendingOptions,
): Promise<unknown[]> {
  const { adapter, walletAddress, ...rest } = options;
  assertAdapter(adapter);

  return adapters[adapter].fetchPending({
    safeAddress: walletAddress,
    ...rest,
  });
}

export async function simulate(
  options: SimulateOptions,
): Promise<unknown> {
  const { adapter, config, ...params } = options;
  assertAdapter(adapter);

  return adapters[adapter].simulate(config, params);
}

export async function write(
  options: WriteOptions,
): Promise<string> {
  const { adapter, config, request } = options;
  assertAdapter(adapter);

  return adapters[adapter].write(config, request as Parameters<typeof adapters.safe.write>[1]);
}

function assertAdapter(adapter: AdapterType): asserts adapter is keyof typeof adapters {
  if (!(adapter in adapters)) {
    throw new Error(`Unknown adapter: ${adapter}. Available: ${Object.keys(adapters).join(", ")}`);
  }
}
