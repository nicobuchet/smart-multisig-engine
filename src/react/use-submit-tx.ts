import { useMutation } from "@tanstack/react-query";
import { submitTx } from "../adapters/index.js";
import type { SubmitTxOptions, SubmitTxResult } from "../adapters/types.js";

export type UseSubmitTxOptions = Omit<SubmitTxOptions, "config"> & {
  config: SubmitTxOptions["config"];
};

export function useSubmitTx() {
  return useMutation<SubmitTxResult, Error, UseSubmitTxOptions>({
    mutationFn: (options) => submitTx(options),
  });
}
