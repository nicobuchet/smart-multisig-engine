import * as safe from "./safe/index.js";

export const adapters = {
  safe: {
    submitTx: safe.submitAndFindSafeTx,
    waitExecution: safe.waitForExecution,
    fetchPending: safe.fetchPendingTransactions,
    simulate: safe.simulateContractCall,
    write: safe.writeContractCall,
  },
} as const;

export type AdapterRegistry = typeof adapters;
