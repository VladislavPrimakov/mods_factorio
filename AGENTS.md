
## 1. General & Git Rules

1. **Git Control (STRICT PROHIBITION):**
   * Never execute mutating `git` commands without an explicit, direct command from the user.
2. **Building & Linting:**
   * Run build scripts from mod folders: `npm run build` (or `npm run build:all` for mod with lib).
   * Type-check without emitting: `npx tsc --noEmit`.
3. **Game Logs Path:** `C:\Games\Factorio\factorio-current.log` (or `%APPDATA%\Factorio\factorio-current.log`).
4. **Language Conventions:**
   * Code comments and documentation: **English**.

---

## 2. Factorio Lifecycle & Stage Isolation

Factorio runs in **three strictly separated execution stages**. Globals from one stage are `nil` in others:

| Stage | Files | Available Globals | NOT Available (`nil`) |
| :--- | :--- | :--- | :--- |
| **1. Settings Stage** | `settings.ts` | `data.extend` | `script`, `game`, `defines`, `storage`, `data.raw` |
| **2. Prototype Stage** | `data.ts`, `data-updates.ts`, `data-final-fixes.ts` | `data.raw`, `data.extend`, `mods` | `script`, `game`, `defines.events`, `storage` |
| **3. Runtime Stage** | `control.ts`, GUI, event handlers | `script`, `game`, `defines`, `storage`, `rendering` | `data.raw`, `data.extend` |

> [!CAUTION]
> Shared modules required in `data.ts`/`settings.ts` **MUST NOT access `script`, `game`, `defines`, or `storage` at top level** (`nil` outside runtime). Guard initialization: `if (typeof script !== "undefined" && script) { ... }`.
> **tsconfig:** Never add `"typed-factorio/settings"` to main `tsconfig.json` (breaks `data.raw` types).

---

## 3. TypeScript-To-Lua (TSTL) Patterns for Factorio Lua

| Task / Feature | ❌ Anti-pattern | ✅ Correct Pattern | Why / Lua 5.2 VM Impact |
| :--- | :--- | :--- | :--- |
| **Type Conversions** | `Boolean(x)`, `String(x)`, `Number(x)` | `x !== undefined && x !== false`, `tostring(x)`, `tonumber(x)` | `Boolean`, `String`, `Number` globals are `nil` in Lua 5.2 VM. Calling them crashes immediately. |
| **Delete Table Key** | `delete obj[key]` | `obj[key] = undefined` | `delete` generates `__TS__Delete`. Assigning `undefined` compiles to single native opcode `obj[key] = nil`. |
| **Clear Array** | `arr.length = 0` | `arr = []` | `length = 0` emits `__TS__ArraySetLength`. `[]` compiles directly to an empty Lua table `{}`. |
| **Maps & Sets** | `new Map()`, `new Set()` | `Record<K, V>` or `new LuaTable<K, V>()` | `Map`/`Set` emit heavy classes via `__TS__New`. `Record`/`LuaTable` compile to native Lua tables `{}` ($O(1)$). |
| **Iteration** | `for (let i = 0; i < arr.length; i++)` | `for (const item of arr)` / `for (const [k, v] of pairs(obj))` | `for..of` compiles to native `ipairs()`; `pairs()` iterates fields directly without allocating intermediate key arrays. |
| **Loop Closures** | `for (let i = 0; i < n; i++) cb = () => f(i);` | `for (const item of items) ...` or local `const cur = i;` | TSTL transpiles `for` to `while`. Without local `const cur`, closures capture outer `i` evaluated to `n`. |
| **Callback Signatures** | `(e: Event) => void` | `(this: void, e: Event) => void` | Without `(this: void)`, TSTL generates implicit `self` (`function(____, e)`), shifting arguments by 1. |
| **Array Holes & Length (`#`)** | `arr[i] = undefined` inside loops | Cache `const len = arr.length` or use `pairs(arr)` | Assigning `nil` creates a hole in Lua arrays. `#arr` returns 0 if index 1 is `nil`, breaking `ipairs`/`for..of`. |
| **0 vs 1 Indexing** | `(res as any).data[0]` | `res?.data?.[0] || (res.data as any)?.[1]` | Factorio collections are 1-based. On `any`-typed variables, `[0]` compiles directly to `data[0]` (`nil`). |
| **State Storage** | Functions, closures, `LuaEntity` in `storage` | Only primitives, IDs (`UnitNumber`), and plain tables | Factorio crashes when serializing functions, coroutines, or native C++ handles on savegame save. |

---

## 4. Runtime Architecture Patterns

1. **State Partitioning:**
   * **Serializable (`storage`):** Persisted in savegame. Only JSON-serializable primitives, arrays, records, and IDs (`UnitNumber`, `PlayerIndex`).
   * **Transient RAM:** Module-level tables for live C++ references, event callbacks, caches. Restored on `script.on_load`.
2. **C++ Boundary Optimization (Diffing):**
   * Only write to `LuaGuiElement` / `LuaEntity` properties when values actually change (`prev !== next`). Bail out at 0 ms cost if unchanged.
3. **Discrete Tick Scheduling:**
   * Never poll large collections on every `on_tick`. Distribute background tasks into discrete tick buckets using `fcore/utils/scheduler` (`after`, `every`, `useInterval`).
4. **Structured Tracing (`strace`):**
   * Use `strace.trace`, `strace.debug`, `strace.info`, `strace.warn`, `strace.error`.
   * For expensive dumps, use lazy closures (`strace.debugLazy(tag, action, () => [...])`) to achieve 0 overhead when disabled.
5. **Branded Engine IDs:** Always use `PlayerIndex`, `SurfaceIndex`, `UnitNumber` instead of generic `number`.
6. **React Root Registration:** Only top-level window components passed to `createRoot` require `registerComponent`. Child JSX components do not require registration.
