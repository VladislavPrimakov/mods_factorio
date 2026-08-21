# Agent Guidelines & Architectural Rules (AGENTS.md)

This document contains mandatory development rules, best practices, TSTL transpilation patterns, Factorio 2.0 lifecycle rules, and performance principles for the `mods_factorio` repository (`fcore`, `cybersyn2-combinator`, `website`).

---

## 1. General Repository Rules

1. **Git Control (STRICT PROHIBITION):**
   * Never execute mutating `git` commands (`commit`, `push`, `checkout`, `branch`, `stash`, `rebase`, `reset`, etc.) without an explicit, direct command from the user.
2. **Building & Linting:**
   * Build commands are executed via npm scripts:
     ```bash
     # From mod folder (builds core library and mod):
     npm run build:all
     # Build individual project:
     npm run build
     # Type-check without emitting:
     npx tsc --noEmit
     ```
   * The `build.mjs` script handles: cleaning `dist/`, TSTL compilation, patching `@noSelfInFile` in `.d.ts` files, and asset copying.
3. **Factorio Game Logs:**
   * Primary log file path: `C:\Games\Factorio\factorio-current.log` (or `%APPDATA%\Factorio\factorio-current.log`).
4. **Language Conventions:**
   * Code comments and documentation — **English**.
   * Communication with the user — **Russian**.

---

## 2. Factorio Lifecycle & Stage Isolation

Factorio runs in **three strictly separated execution stages**. Global variables from one stage are completely undefined (`nil`) in others:

| Stage | Files | Available Globals | NOT Available (`nil`) |
| :--- | :--- | :--- | :--- |
| **1. Settings Stage** | `settings.ts` / `settings.lua` | `data.extend` (for settings) | `script`, `game`, `defines`, `storage`, `data.raw` |
| **2. Prototype Stage** | `data.ts`, `data-updates.ts`, `data-final-fixes.ts` | `data.raw`, `data.extend`, `mods` | `script`, `game`, `defines.events`, `storage` |
| **3. Runtime Stage** | `control.ts`, GUI, event handlers | `script`, `game`, `defines`, `storage`, `rendering` | `data.raw`, `data.extend` |

> [!CAUTION]
> **Stage Isolation Rule:** Shared utility modules (such as `fcore/utils/strace`, `fcore/utils/data`, `fcore/utils/event`, `fcore/utils/table`) **MUST NEVER unconditionally access `script`, `game`, `defines`, or `data.raw` at the top level of the file**. Always guard runtime initialization:
> ```ts
> if (typeof script !== "undefined" && script !== undefined && typeof defines !== "undefined" && defines?.events) {
>   // Runtime-only event listeners / settings sync
> }
> ```

---

## 3. TypeScript-To-Lua (TSTL) Patterns for Factorio Lua

### 3.1. Summary Matrix: What to Use, What NOT to Use, and WHY

| Task / Operation | ❌ DO NOT USE (Anti-pattern) | ✅ USE (Pattern) | WHY (Lua Impact & Performance Rationale) |
| :--- | :--- | :--- | :--- |
| **JS Global Constructors** | `Boolean(x)`, `String(x)`, `Number(x)` | `x !== undefined && x !== false`, `tostring(x)`, `tonumber(x)` | In Lua 5.2 VM, `Boolean`, `String`, and `Number` are **`nil`**. Calling them causes immediate crash: `attempt to call global 'Boolean' (a nil value)`. |
| **Deleting a table key** | `delete obj[key]` | `obj[key] = undefined` | `delete` transpiles to `__TS__Delete(obj, key)`. Assigning `undefined` compiles to a single native Lua opcode instruction `obj[key] = nil`. |
| **Clearing an array** | `arr.length = 0` | `arr = []` | `length = 0` generates the polyfill `__TS__ArraySetLength(arr, 0)`. Creating `[]` compiles directly to an empty Lua table `{}` with zero overhead. |
| **Maps / Sets / Dictionaries** | `new Map()`, `new Set()` | `Record<K, V>` or `new LuaTable<K, V>()` | `Map` and `Set` generate heavy prototype classes via `__TS__New(Map)`. `Record` and `LuaTable` translate directly to native Lua tables `{}` with $O(1)$ lookup. |
| **Array iteration** | `for (let i = 0; i < arr.length; i++)` | `for (const item of arr)` | Standard `for (;;)` transpiles to a `while` loop with manual index increments. `for..of` compiles into native, highly optimized Lua 5.2 `for ____, item in ipairs(arr) do`. |
| **Object property iteration** | `Object.keys(obj)`, `Object.entries(obj)` | `for (const [k, v] of pairs(obj))` | `Object.*` methods allocate intermediate arrays of keys/values. Native `pairs(obj)` iterates over table fields directly without memory allocations. |
| **Closures in loops** | `for (let i = 1; i <= n; i++) { cb = () => fn(i); }` | `for (let i = 1; i <= n; i++) { const cur = i; cb = () => fn(cur); }` | **Critical TSTL Bug:** TSTL transpiles `for` to `while`. Without creating a local `const cur`, all closures capture the exact same outer variable `i` (which evaluates to `n + 1`)! |
| **Function & method signatures** | Functions/callbacks without context annotations | `(this: void, ...)` on callback types (`noImplicitSelf: true` in `tsconfig.json`) | By default, TSTL generates callbacks with an implicit `self` parameter (`function(____, a, b)`). When invoked by the Factorio engine, arguments shift by 1 position. |
| **Array / Table truthiness checks** | `if (obj.field)` or `if (val)` | `if (val !== undefined)` | In Lua, empty tables `{}` and arrays `[]` evaluate to **`true`**. An implicit `if (val)` check will return `true` even for empty objects. |
| **`null` vs `undefined`** | `null`, `T \| null`, `x === null` | `undefined`, `T \| undefined` | Lua has only **`nil`** (no distinct `null` type). Using `undefined` everywhere avoids union type clutter and eliminates redundant bytecode. |
| **Factorio API indexing** | 0-based indexing | 1-based indexing (`1..N`) | In the Factorio C++ engine, all collections (slots, logistic sections, filters, inventories) start at index **1**. |
| **`any`-Typed Array Indexing** | `(res as any).data[0]` | `for (const item of list)` or `res.data?.[0] \|\| (res.data as any)?.[1]` | When indexing `any`-typed Lua tables, TSTL does not adjust `[0]` to `[1]`, generating `data[0]` in Lua which evaluates to **`nil`**. |
| **Object Interface Methods** | `{ trace(...args: any[]): void }` | `(this: void, ...args: any[]) => void` on method interfaces | Methods on objects without `(this: void)` are compiled into colon calls (`obj:method(...)`), passing the object itself as `self` (first argument), shifting all parameters by 1! |
| **Array Holes & Length Operator (`#`)** | `arr[i] = undefined`, `for..of` over sparse arrays | Cache `const total = arr.length`, advance index, or use `for (const [k, v] of pairs(arr))` | In Lua 5.2 VM, assigning `nil` to an array index creates a hole. The `#` operator evaluates to any index preceding a `nil` (often `0` if index 1 is `nil`). Subsequent loop conditions like `i < arr.length` become `i < 0` (false), terminating loops immediately. Furthermore, `for..of` (`ipairs`) terminates at the first `nil` element. |
| **Tab Button Styling** | `style="tab_selected"` | `style="react_tab_button"` with `toggled={isSelected}` | Vanilla Factorio buttons do not have a `tab_selected` style. Custom button styles inherit from `tab` and switch graphics via the native `toggled` property. |

---

### 3.2. Code Pattern Examples

#### A. Type Conversions (Never use JS Constructors)
```ts
// ❌ WRONG: Crashes in Lua with "attempt to call global 'String' (a nil value)"
const keyStr = String(item.key);
const countNum = Number(textValue);
const isValid = Boolean(flags && flags.enabled);

// ✅ CORRECT: Use native Lua functions & boolean expressions
const keyStr = tostring(item.key);
const countNum = tonumber(textValue);
const isValid = flags !== undefined && flags.enabled === true;
```

#### B. Loop Closures (TSTL Closure Trap)
```ts
// ❌ ERROR: All handlers will capture index = total + 1!
for (let i = 1; i <= total; i++) {
  handlers.push(() => processIndex(i));
}

// ✅ CORRECT (Option 1: Local constant in loop body):
for (let i = 1; i <= total; i++) {
  const currentIndex = i; // Allocates a separate local variable in Lua
  handlers.push(() => processIndex(currentIndex));
}

// ✅ CORRECT (Option 2: for..of iteration):
for (const item of items) {
  handlers.push(() => processItem(item));
}
```

#### C. Eliminating Implicit `self` Parameters in Callbacks
```ts
// Top-level functions are handled globally via "noImplicitSelf": true in tsconfig.json.
// For all callback types, props, and callable definitions, ALWAYS use (this: void, ...):

// ✅ CORRECT: Function types and callback props with (this: void, ...)
export type GenericCallback<T> = (this: void, value: T) => void;
export type EventListener<E> = (this: void, event: E) => void;

export type PinButtonProps = SpriteButtonProps & {
  pinned?: boolean;
  onTogglePin?: (this: void, pinned: boolean, ev: OnGuiClickEvent) => void;
};
```

#### D. Array Holes, `nil` Assignments & Lua `#` Length Operator Trap
```ts
// ❌ CRITICAL BUG: Setting an array element to undefined creates a nil hole in Lua.
// In Lua 5.2, #arr immediately returns 0 if arr[1] is nil!
for (const el of elements) {
  if (unkeyedIndex < unkeyed.length) {
    matched = unkeyed[unkeyedIndex];
    unkeyed[unkeyedIndex] = undefined; // ❌ Breaks #unkeyed on the very next iteration!
    unkeyedIndex++;
  }
}

// ❌ CRITICAL BUG: for..of compiles to ipairs(), which stops at the FIRST nil element!
// If an array has [elem1, undefined, elem3], elem3 is never reached!
for (const child of children) { ... }

// ✅ CORRECT (Option 1: Cache length before loop and do not mutate array):
const totalUnkeyed = unkeyed.length;
let unkeyedIndex = 0;
for (const el of elements) {
  if (unkeyedIndex < totalUnkeyed) {
    matched = unkeyed[unkeyedIndex];
    unkeyedIndex++;
  }
}

// ✅ CORRECT (Option 2: Use pairs() for sparse arrays / JSX children):
for (const [_, child] of pairs(children as Record<number, ReactNode>)) {
  if (child !== undefined && child !== false) {
    processChild(child);
  }
}
```

#### E. `any`-Typed Array Indexing Trap (0-based vs 1-based indexing)
```ts
// ❌ CRITICAL BUG: When res is 'any', TSTL compiles data[0] directly to data[0] in Lua!
// In Lua VM, arrays start at index 1, so data[0] is ALWAYS nil!
const stopRes = remote.call("cybersyn2", "query", { type: "stops" }) as any;
const stopObj = stopRes.data[0]; // ❌ Evaluates to nil in Lua!

// ✅ CORRECT (Option 1: for..of iteration compiles to native ipairs):
const stopList = stopRes && stopRes.data;
let stopObj: any = undefined;
if (stopList) {
  for (const s of stopList) {
    if (s) {
      stopObj = s;
      break;
    }
  }
}

// ✅ CORRECT (Option 2: Dual fallback or explicit typing):
const stopObj = stopRes?.data?.[0] || (stopRes?.data as any)?.[1];
```

#### F. Object Method Signatures & Logger Interfaces (`(this: void, ...)`)
```ts
// ❌ CRITICAL BUG: Interface methods without (this: void) compile to colon calls (obj:method(...)),
// passing 'obj' as the 0-th argument (self), shifting all parameters by 1 position in Lua!
export interface Logger {
  trace(...args: any[]): void; // ❌ Compiles logger.trace("tag", "msg") -> logger:trace("tag", "msg")
}

// ✅ CORRECT: Explicitly declare (this: void, ...) on all method properties:
export interface Logger {
  trace: (this: void, ...args: any[]) => void; // ✅ Compiles to logger.trace("tag", "msg")
}
```

---

## 4. Integration with `typed-factorio` & Factorio 2.0 API

### 4.1. Global Namespaces
`typed-factorio` automatically injects engine APIs into the global scope:
* **Runtime stage (`control.ts`, GUI, hooks):** `game`, `script`, `defines`, `storage`, `rendering` are accessible directly without `import`.
* **Prototype stage (`data.ts`, styles):** `data` (`data.raw`, `data.extend`), `mods` are accessible directly without `import`.
* **`tsconfig.json` Configuration:**
  ```json
  "types": [
    "typed-factorio/runtime",
    "typed-factorio/prototype",
    "@typescript-to-lua/language-extensions"
  ]
  ```
  > [!CAUTION]
  > **STRICT PROHIBITION:** Never add `"typed-factorio/settings"` to the main `tsconfig.json`! The settings stage overrides global `data.raw` with a narrow set of settings types, breaking type definitions for all game prototypes.

### 4.2. Branded Engine ID Typing (`PlayerIndex`, `SurfaceIndex`, `UnitNumber`)
Always use explicit types (`PlayerIndex`, `SurfaceIndex`, `UnitNumber`) in function parameters, props, and models instead of generic `number`.

```ts
// ❌ BAD (requires unsafe type casts):
export function handlePlayerAction(playerIndex: number) {
  const player = game.get_player(playerIndex as PlayerIndex);
}

// ✅ EXCELLENT (native typing):
export function handlePlayerAction(playerIndex: PlayerIndex) {
  const player = game.get_player(playerIndex);
}
```

---

## 5. Factorio Lua Runtime Architecture Patterns

### 5.1. Separating Persistent State (`storage`) and Transient RAM State
* **Serializable State (`storage`):**
  - Persisted inside the game save file (`savegame.zip`) and synced across multiplayer.
  - Must contain **only JSON-serializable primitives and data tables**: numbers, strings, booleans, simple records/arrays.
  - **STRICT PROHIBITION:** Never store functions, closures, coroutines, or native Factorio C++ references (`LuaEntity`, `LuaGuiElement`) in `storage` (Factorio will throw a serialization crash upon saving).
* **Transient RAM State:**
  - Kept in module memory (local module tables / `transientStates`).
  - Contains: live C++ references, memo caches, event handler tables, active timers.
  - Hydrated and restored on game load via `script.on_load`.

### 5.2. React GUI Root Registration & Hydration
* Only **root window components** passed to `createRoot` need `registerComponent("WindowName", WindowComponent)`.
* Child JSX components (`<TabbedPane />`, `<SlotButton />`, etc.) are resolved dynamically in RAM during rendering and do **not** require manual registration.

### 5.3. Minimizing C++ / Lua Boundary Transitions (Diffing & Bailout)
* Accessing properties on native Factorio objects (reading/writing `LuaGuiElement`, `LuaEntity`) incurs a cross-language C++ overhead.
* **Rule:** Only write to C++ engine properties **when values actually change** (`prevValue !== nextValue`).
* If `setState` receives the exact same value (`prev === next`), bail out immediately at 0 ms cost.

### 5.4. Batching & Scheduling vs. Per-Tick Polling
* Avoid per-frame evaluations on every game tick (`on_tick`).
* Use the bucketed tick scheduler (`scheduler.after`, `scheduler.every`, `useInterval`) to distribute background workloads smoothly across ticks.

---

## 6. Structured Logging (`strace`)

Use structured logging for diagnostics and monitoring:
* `strace.trace(module, action, ...)` — High-frequency tracing (renders, property diffing, low-level events).
* `strace.debug(module, action, ...)` — Diagnostic info (scheduler ticks, window open/close, coordinates).
* `strace.info(module, action, ...)` — Key lifecycle events (settings saved, entity built/destroyed).
* `strace.warn(...)` / `strace.error(...)` — Warnings and exceptions.
