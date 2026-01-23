# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm build` — bundle with tsup (ESM + CJS + .d.ts)
- `pnpm dev` — watch mode build
- `pnpm test` — run vitest (watch mode by default)
- `pnpm test --run` — run tests once
- `pnpm vitest run src/core/foo.test.ts` — run a single test file
- `pnpm typecheck` — type-check without emitting
- `pnpm clean` — remove dist/

## Architecture

This is a TypeScript library using a **core/adapter** pattern:

- **`src/core/`** — Pure business logic. No I/O, no side effects. All external dependencies are injected.
- **`src/adapters/`** — I/O implementations (APIs, blockchain providers, storage, etc.) that satisfy interfaces defined or expected by core.
- **`src/index.ts`** — Package entry point; re-exports from core and adapters.

The package ships dual-format (ESM + CJS) via tsup with full type declarations.
