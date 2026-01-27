import { useQuery } from "@tanstack/react-query";
import { simulate } from "../adapters/index.js";
import type { SimulateOptions } from "../adapters/types.js";

export interface UseSimulateOptions extends SimulateOptions {
  enabled?: boolean;
}

export function useSimulate(options: UseSimulateOptions) {
  const { enabled = true, ...simulateOptions } = options;

  return useQuery<unknown, Error>({
    queryKey: [
      "adapter",
      options.adapter,
      "simulate",
      options.address,
      options.functionName,
      JSON.stringify(options.args),
    ],
    queryFn: () => simulate(simulateOptions),
    enabled,
  });
}
