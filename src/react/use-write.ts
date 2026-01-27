import { useMutation } from "@tanstack/react-query";
import { write } from "../adapters/index.js";
import type { WriteOptions } from "../adapters/types.js";

export function useWrite() {
  return useMutation<string, Error, WriteOptions>({
    mutationFn: (options) => write(options),
  });
}
