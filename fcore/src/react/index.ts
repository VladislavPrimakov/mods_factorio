import type {
  LuaGuiElement,
  FrameGuiElement,
  PlayerIndex,
  GuiLocation,
  RegistrationNumber,
  OnGuiClosedEvent,
  OnGuiLocationChangedEvent,
  LuaEntity,
  SurfaceIndex,
  MapPosition,
  GuiSpec,
  GuiElementType,
  OnObjectDestroyedEvent,
  UnitNumber,
} from "factorio:runtime";

import { bind } from "../utils/event";
import { tableSize, areObjectsEqual } from "../utils/table";
import * as scheduler from "../utils/scheduler";
import { strace } from "../utils/strace";
import { ELEMENT_SCHEMA } from "./generated-props";
import { GUI_EVENT_MAP } from "./types";
import type {
  Fiber,
  FiberId,
  RootId,
  TransientState,
  HookInstance,
  ComponentType,
  Key,
  ReactNode,
  ReactElement,
  ElementType,
  ReactRootData,
  EventMapping,
  GuiEventData,
  EntityLifecycleCallbacks,
  GuiEventHandler,
  Ref,
  Props,
  SetStateAction,
  Dispatch,
  EffectCleanup,
  EffectCallback,
  DependencyList,
  PendingEffect,
  DebounceState,
  UseWindowOptions,
  UseWindowReturn,
  ObserverData,
  EntityDestroyedEvent,
  EntityBuiltEvent,
  NonFunction,
} from "./types";

// Explicitly re-export public types
export type {
  FiberId,
  RootId,
  Key,
  ReactNode,
  ReactElement,
  ElementType,
  ComponentType,
  Props,
  Ref,
  SetStateAction,
  Dispatch,
  EffectCleanup,
  EffectCallback,
  DependencyList,
  PrimitiveProps,
  GuiElementFor,
  Fiber,
  TransientState,
  ReactRootData,
  EntityLifecycleCallbacks,
  EventMapping,
  GuiEventData,
  GuiEventHandler,
  UseWindowOptions,
  UseWindowReturn,
  ObserverData,
  PendingEffect,
  DebounceState,
  EntityDestroyedEvent,
  EntityBuiltEvent,
  NonFunction,
} from "./types";

// ============================================================================
// SECTION 1: ELEMENT CREATION & JSX RUNTIME
// ============================================================================

/**
 * Creates a virtual React element descriptor.
 *
 * @param type Component function or primitive Factorio tag name (e.g. "flow", "button")
 * @param props Element props object
 * @param children Child elements
 * @returns A virtual ReactElement object
 */
export function createElement<P extends Props = Props>(type: ElementType<P>, props?: P, ...children: ReactNode[]): ReactElement<P>;
export function createElement(type: ElementType, props?: Props, ...children: ReactNode[]): ReactElement {
  let key: Key | undefined = undefined;
  const p: Props = {};

  if (props) {
    for (const [k, v] of pairs(props)) {
      if (k === "key") {
        key = v as Key;
      } else {
        p[k] = v;
      }
    }
  }

  if (children.length > 0) {
    p.children = children;
  }

  return { type, props: p, key };
}

/**
 * Fragment component to group multiple JSX elements without a wrapper DOM node.
 */
export function Fragment(props: { children?: ReactNode }) {
  return props.children;
}

/**
 * Recursively flattens nested child elements and arrays into a flat list, filtering out booleans and undefined values.
 *
 * @param children Raw children prop
 * @param flat Output array collecting flattened ReactElements
 */
function flattenInto(children: ReactNode, flat: ReactElement[]) {
  if (children === undefined || typeof children === "boolean") return;

  if (typeof children === "object" && (children as ReactElement).type !== undefined) {
    flat.push(children as ReactElement);
    return;
  }

  for (const [_, c] of pairs(children as Record<number, ReactNode>)) {
    if (c === undefined || typeof c === "boolean") continue;
    if (typeof c === "object") {
      if ((c as ReactElement).type !== undefined) {
        flat.push(c as ReactElement);
      } else {
        flattenInto(c, flat);
      }
    }
  }
}

/**
 * Flattens nested children arrays/tables and filters out boolean / nil values.
 *
 * @param children Raw children elements
 * @returns Flattened array of ReactElement descriptors
 */
function flattenChildren(children?: ReactNode): ReactElement[] {
  const flat: ReactElement[] = [];
  flattenInto(children, flat);
  return flat;
}

// ============================================================================
// SECTION 2: FIBER ARCHITECTURE & COMPONENT REGISTRY
// ============================================================================

/**
 * In-memory registry of root component functions keyed by unique string names.
 *
 * Factorio cannot serialize Lua closures/functions into `storage`.
 * During game save, root descriptors store string component identifiers (`rootType`).
 * On game load (`on_load`), the engine looks up the component function in this
 * registry to rehydrate the virtual DOM tree and reattach event handlers.
 */
export const componentRegistry: Record<string, ComponentType<any> | undefined> = {};
/** Fast O(1) reverse lookup map from component function references to registered string names. */
const componentTypeToName = new LuaTable<ComponentType<any>, string>();

/**
 * Registers a root component function under a unique string name.
 * Must be called at top-level module load time so that `on_load` can find it.
 *
 * @param name Unique component identifier (e.g. "my-mod-main-gui")
 * @param component The functional component
 * @returns The passed component function
 */
export function registerComponent<T extends ComponentType<any>>(name: string, component: T): T;
export function registerComponent(name: string, component: ComponentType<any>): ComponentType<any> {
  if (componentRegistry[name] && componentRegistry[name] !== component) {
    error(`[React Error]: Component with name '${name}' is already registered with a different function!`);
  }
  componentRegistry[name] = component;
  componentTypeToName.set(component, name);
  strace.debug("react", "register_component", "name", name);
  return component;
}

/**
 * Resolves a human-readable registry name for a component or native tag name.
 * Uses a zero-cost O(1) `LuaTable` lookup for functional components.
 *
 * @param elementType Component function or native tag name
 * @returns Resolved string name
 */
export function getComponentTypeName(elementType: ElementType): string {
  if (typeof elementType === "string") return elementType;

  const registeredName = componentTypeToName.get(elementType);
  if (registeredName !== undefined) return registeredName;

  return tostring(elementType);
}

/**
 * Resolves an ElementType from a registered name or passes through the component function / native tag.
 *
 * @param elementType Component function, native tag name, or registered component string identifier
 * @returns Resolved ComponentType or native tag string
 */
export function getComponentType(elementType: ElementType | string): ElementType {
  if (typeof elementType === "string") {
    return (componentRegistry[elementType] || elementType) as ElementType;
  }
  return elementType;
}

/**
 * In-memory transient state map for all active Fiber nodes.
 * Stores non-serializable objects (C++ LuaGuiElement references, closures, cleanups, memo cache).
 * This RAM-only table is never written to disk and is safely reconstructed during hydration.
 */
export const transientStates: Record<FiberId, TransientState | undefined> = {};

/**
 * Formats a Fiber node and its hierarchy context into a compact string for structured logging.
 *
 * @param fiber Target Fiber node
 * @returns Formatted debug string, e.g. `#14<SlotButton key=slot-3 parent=#10<SectionGroup> root=#1>`
 */
export function fiberTrace(fiber: Fiber): string {
  const transient = transientStates[fiber.id];
  let res = `#${fiber.id}<${fiber.type}`;
  if (fiber.key !== undefined) {
    res += ` key=${tostring(fiber.key)}`;
  }
  if (transient?.parent) {
    res += ` parent=#${transient.parent.id}<${transient.parent.type}>`;
  }
  if (transient?.root) {
    res += ` root=#${transient.root.id}`;
  }
  return res + ">";
}

/**
 * Allocates a new serializable Fiber node and initializes its RAM transient state.
 *
 * @param type Component name or native tag name
 * @param key Optional reconciliation key
 * @returns The newly allocated Fiber node
 */
export function createFiber(type: string, key?: Key): Fiber {
  const id = storage.reactNextFiberId ?? 1;
  storage.reactNextFiberId = id + 1;

  const fiber: Fiber = {
    id,
    type,
    key,
    hooks: [],
    children: [],
  };
  const t: TransientState = { fiber, props: {} };
  transientStates[id] = t;
  strace.traceLazy("react", "create_fiber", () => ["fiber", fiberTrace(fiber)]);
  return fiber;
}

/**
 * Retrieves or initializes the in-memory RAM `TransientState` for a given Fiber ID.
 *
 * @param id Unique numeric Fiber ID
 * @returns The TransientState record
 */
export function getTransient(id: FiberId): TransientState {
  let t = transientStates[id];
  if (!t) {
    t = { props: {} };
    transientStates[id] = t;
  }
  return t;
}

/**
 * Retrieves or lazily creates an in-memory `HookInstance` for the given Fiber ID and hook slot.
 *
 * @param fiberId Unique Fiber node ID
 * @param idx Zero-based hook slot index
 * @returns The HookInstance container
 */
export function getHook(fiberId: FiberId, idx: number): HookInstance {
  const transient = getTransient(fiberId);
  if (!transient.hooks) transient.hooks = {};
  let h = transient.hooks[idx];
  if (!h) {
    h = {};
    transient.hooks[idx] = h;
  }
  return h;
}

// ============================================================================
// SECTION 3: FACTORIO GUI RENDERER (NATIVE BRIDGE)
// ============================================================================

/**
 * Assigns a native Factorio `LuaGuiElement` reference to a React ref.
 * Supports both function callbacks (`(elem) => ...`) and mutable ref objects (`{ current: elem }`).
 *
 * @param ref Ref callback or MutableRefObject
 * @param value Native GUI element or undefined on unmount
 */
export function assignRef(ref: Ref | undefined, value: LuaGuiElement | undefined) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
  } else if (typeof ref === "object") {
    ref.current = value;
  }
}

/**
 * Synchronizes and pre-indexes event handlers directly by numeric Factorio event ID
 * in `TransientState.handlers` for O(1) integer table dispatch without property string lookups.
 *
 * @param fiberId Unique Fiber node ID
 * @param props Current element props
 */
function updateFiberEventHandlers(fiberId: FiberId, props: Props) {
  const transient = getTransient(fiberId);
  for (const [eventId, propName] of pairs(GUI_EVENT_MAP)) {
    const handler = props[propName];
    if (typeof handler === "function") {
      if (!transient.handlers) transient.handlers = {};
      transient.handlers[eventId] = handler;
    } else if (transient.handlers && transient.handlers[eventId] !== undefined) {
      transient.handlers[eventId] = undefined;
    }
  }
}

/**
 * Creates a new native Factorio `LuaGuiElement` inside a parent container.
 * Segregates creation properties from post-creation properties based on `ELEMENT_SCHEMA`,
 * applies styles and style overrides, pre-indexes event handlers for O(1) integer table dispatch,
 * tags the element with `__reactId`, and attaches the ref.
 *
 * @param parent Native Factorio GUI parent container
 * @param type Native element type name (e.g. "button", "frame", "flow")
 * @param props Virtual element props
 * @param fiberId Unique Fiber node ID
 * @returns The created native LuaGuiElement
 */
export function createGuiElement(parent: LuaGuiElement, type: GuiElementType, props: Props, fiberId: FiberId): LuaGuiElement {
  const schema = ELEMENT_SCHEMA[type];
  const params: Record<string, any> = { type };

  for (const [k, v] of pairs(props)) {
    if (schema.create[k]) {
      params[k] = v;
    }
  }

  // Factorio native GUI elements cannot have duplicate names under the same parent
  if (params.name && parent[params.name]) {
    destroyGuiElement(parent[params.name]);
  }

  const elem = parent.add(params as GuiSpec);
  // Attach __reactId tag for O(1) event routing
  elem.tags = { __reactId: fiberId };

  // Pre-index event handlers for O(1) direct event dispatching
  updateFiberEventHandlers(fiberId, props);

  // Apply style FIRST
  if (props.style) {
    elem.style = props.style;
  }

  // Apply styles overrides SECOND
  if (props.styles) {
    for (const [sKey, sVal] of pairs(props.styles)) {
      elem.style[sKey] = sVal;
    }
  }

  // Apply post-creation properties THIRD (e.g. location, drag_target, elem_value) - MUST BE AFTER STYLE
  for (const [k] of pairs(schema.post)) {
    if (props[k] !== undefined) {
      elem[k] = props[k];
    }
  }

  // Assign ref (supports function callbacks and useRef objects)
  assignRef(props.ref, elem);
  return elem;
}

/**
 * Updates an existing native Factorio `LuaGuiElement` by diffing current props against previous props.
 * Only writes modified values to the Factorio C++ engine boundary to minimize cross-language overhead.
 * Reapplies style overrides if the prototype style changed, updates pre-indexed event handlers, and updates refs.
 *
 * @param elem Live native LuaGuiElement
 * @param props Next virtual element props
 * @param fiberId Unique Fiber node ID
 * @param prevProps Previous virtual element props
 */
export function updateGuiElement(elem: LuaGuiElement, props: Props, fiberId: number, prevProps?: Props) {
  const schema = ELEMENT_SCHEMA[elem.type];

  // Update dynamic properties
  for (const [k, v] of pairs(props)) {
    if (schema.update[k]) {
      if (!prevProps || prevProps[k] !== v) {
        elem[k] = v;
      }
    }
  }

  // Clear properties that were present in prevProps but are now removed/undefined in next props
  if (prevProps) {
    for (const [k, _] of pairs(prevProps)) {
      if (schema.update[k] && props[k] === undefined) {
        elem[k] = undefined;
      }
    }
  }

  const styleChanged = props.style !== undefined && (!prevProps || prevProps.style !== props.style);

  // Apply style FIRST ONLY if changed
  if (styleChanged && props.style) {
    elem.style = props.style;
  }

  // Apply styles overrides SECOND (always reapply if style prototype changed)
  if (props.styles) {
    const prevStyles = styleChanged ? undefined : prevProps?.styles;
    for (const [sKey, sVal] of pairs(props.styles)) {
      if (!prevStyles || prevStyles[sKey] !== sVal) {
        elem.style[sKey] = sVal;
      }
    }
  }

  // Update post-creation properties THIRD (always re-apply if style changed or prop changed)
  for (const [k] of pairs(schema.post)) {
    if (props[k] !== undefined) {
      if (styleChanged || !prevProps || prevProps[k] !== props[k]) {
        elem[k] = props[k];
      }
    } else if (prevProps && prevProps[k] !== undefined) {
      elem[k] = undefined;
    }
  }

  // Pre-index event handlers for O(1) direct event dispatching
  updateFiberEventHandlers(fiberId, props);

  // Assign ref on update
  assignRef(props.ref, elem);
}

/**
 * Recursively traverses a Fiber subtree to find the first real LuaGuiElement.
 * This is needed because Functional Components do not own a native element directly.
 *
 * @param fiber Target Fiber node
 * @returns The first matching valid LuaGuiElement or undefined
 */
export function findFirstGuiElement(fiber: Fiber | undefined): LuaGuiElement | undefined {
  if (!fiber) return undefined;
  const transient = transientStates[fiber.id];
  if (transient && transient.elem && transient.elem.valid) {
    return transient.elem;
  }
  if (fiber.children !== undefined) {
    for (const child of fiber.children) {
      const el = findFirstGuiElement(child);
      if (el) return el;
    }
  }
  return undefined;
}

/**
 * Safely destroys a native Factorio GUI element if it exists and is still valid.
 *
 * @param elem LuaGuiElement to destroy
 */
export function destroyGuiElement(elem: LuaGuiElement | undefined) {
  if (elem && elem.valid) elem.destroy();
}

// ============================================================================
// SECTION 4: HOOKS RUNTIME & CORE HOOKS
// ============================================================================

/** Active Fiber node currently executing its render phase. */
let currentFiber: Fiber | undefined = undefined;
/** Sequential cursor index of the hook currently executing within `currentFiber`. */
let hookIndex = 0;
/** True if the current render pass is hydrating state from storage during game load. */
let isHydratingState = false;

/**
 * Prepares the global hook cursor before rendering a functional component.
 *
 * @param fiber Active Fiber node being rendered
 * @param hydrating True if hydrating from storage on game load
 */
export function beginHookRender(fiber: Fiber, hydrating: boolean) {
  currentFiber = fiber;
  hookIndex = 0;
  isHydratingState = hydrating;
}

/**
 * Cleans up the global hook cursor after component render.
 */
export function endHookRender() {
  currentFiber = undefined;
  isHydratingState = false;
}

export { areObjectsEqual };

/**
 * Type guard checking if a state updater action is a transition function.
 *
 * @param val The state value or updater function
 * @returns True if `val` is an updater function
 */
function isFunction<T>(val: SetStateAction<T>): val is (this: void, prev: T) => T {
  return typeof val === "function";
}

/**
 * Declares a stateful variable in a functional component.
 * State is preserved in the serializable `fiber.hooks` array across renders and game saves.
 * The `setState` updater closure is cached in `transient.memoCache` on initial mount,
 * resulting in zero closure allocations on subsequent re-renders.
 *
 * @param initial Initial state value or factory function
 * @returns A tuple of `[currentState, setState]`
 */
export function useState<S>(initialValue: (this: void) => NonFunction<S>): [S, Dispatch<SetStateAction<S>>];
export function useState<S>(initialValue: NonFunction<S>): [S, Dispatch<SetStateAction<S>>];
export function useState<S>(initialValue: S | ((this: void) => S)): [S, Dispatch<SetStateAction<S>>] {
  const fiber = currentFiber!;
  const idx = hookIndex++;
  const hook = getHook(fiber.id, idx);

  // 1. Initialize and read state value first
  let val = fiber.hooks[idx] as S | undefined;
  if (val === undefined) {
    val = isFunction(initialValue) ? initialValue() : initialValue;
    if (!isHydratingState) fiber.hooks[idx] = val;
  }

  if (!hook.updater) {
    const fiberId = fiber.id;
    hook.updater = (newVal: SetStateAction<S>) => {
      const f = transientStates[fiberId]?.fiber;
      if (!f) return;
      const currentVal = f.hooks[idx] as S;
      const updatedVal = isFunction(newVal) ? newVal(currentVal) : newVal;
      if (currentVal !== updatedVal) {
        f.hooks[idx] = updatedVal;
        strace.traceLazy("react", "set_state", () => ["fiber", fiberTrace(f), "hookIndex", idx, "prev", currentVal, "next", updatedVal]);
        scheduleUpdate(f);
      }
    };
  }

  return [val as S, hook.updater];
}

/** Queue of deferred side-effects awaiting execution in the commit phase. */
let pendingEffects: PendingEffect[] = [];

/**
 * Flushes all queued side-effects after the component tree and GUI elements are committed.
 */
export function flushPendingEffects() {
  const count = pendingEffects.length;
  if (count === 0) return;
  strace.traceLazy("react", "flush_effects", () => ["count", count]);
  for (let i = 0; i < count; i++) {
    const item = pendingEffects[i];
    const transient = transientStates[item.fiberId];
    if (!transient) continue;

    const hook = transient.hooks ? transient.hooks[item.hookIndex] : undefined;
    if (hook) {
      if (hook.cleanup) {
        hook.cleanup();
        hook.cleanup = undefined;
      }
      const cleanup = item.effect();
      if (typeof cleanup === "function") {
        hook.cleanup = cleanup;
      }
    }
  }
  pendingEffects = [];
}

/**
 * Compares two hook dependency lists for shallow element equality.
 *
 * @param prevDeps Previous dependency list
 * @param nextDeps Next dependency list
 * @returns True if all dependencies are strictly equal
 */
function areDepsEqual(prevDeps?: DependencyList, nextDeps?: DependencyList): boolean {
  if (!prevDeps || !nextDeps) return false;
  const len = nextDeps.length;
  if (len !== prevDeps.length) return false;
  for (let i = 0; i < len; i++) {
    if (prevDeps[i] !== nextDeps[i]) return false;
  }
  return true;
}

/**
 * Side-effect hook. Queued and executed in the commit phase after GUI elements are attached.
 * Cleans up previous effect return callback before re-running or on unmount.
 */
export function useEffect(effect: EffectCallback, deps?: DependencyList) {
  const fiber = currentFiber!;
  const idx = hookIndex++;
  const hook = getHook(fiber.id, idx);
  const prevDeps = hook.deps;

  const depsChanged = !deps || !prevDeps || !areDepsEqual(prevDeps, deps);
  hook.deps = deps;

  if (depsChanged && !isHydratingState) {
    pendingEffects.push({
      fiberId: fiber.id,
      hookIndex: idx,
      effect,
    });
  }
}

/**
 * Reducer hook for managing complex state transitions.
 * Dispatches actions to compute the next state based on the reducer function.
 *
 * @param reducer State transition function `(prevState, action) => nextState`
 * @param initialArg Initial state value
 * @param init Optional lazy initialization function
 * @returns A tuple of `[state, dispatch]`
 */
export function useReducer<S, A>(
  reducer: (this: void, prevState: S, action: A) => S,
  initialArg: NonFunction<S>,
  init?: (this: void, initial: S) => NonFunction<S>,
): [S, (this: void, action: A) => void] {
  const [state, setState] = useState<S>(() => (init ? init(initialArg) : initialArg) as NonFunction<S>);
  const dispatch = useCallback(
    (action: A) => {
      setState((prevState) => reducer(prevState, action));
    },
    [reducer],
  );
  return [state, dispatch];
}

/**
 * Caches a computed value in transient RAM memory (`hook.memo`).
 * Recomputes the value only when one of the specified dependencies changes,
 * or during game hydration if the RAM cache was reset.
 *
 * @param factory Pure function that computes the value
 * @param deps Dependency array for change detection
 * @returns The memoized value
 */
export function useMemo<T>(factory: (this: void) => T, deps: DependencyList): T {
  const fiber = currentFiber!;
  const idx = hookIndex++;
  const hook = getHook(fiber.id, idx);
  const prevDeps = hook.deps;

  const depsChanged = !prevDeps || !areDepsEqual(prevDeps, deps);
  hook.deps = deps;

  if (depsChanged || hook.memo === undefined) {
    const val = factory();
    hook.memo = val;
    return val;
  }

  return hook.memo as T;
}

/**
 * Returns a memoized version of the callback function that only changes if dependencies change.
 *
 * @param callback Function to memoize
 * @param deps Dependency array
 * @returns The stable callback reference
 */
export function useCallback<T extends (this: void, ...args: any[]) => any>(callback: T, deps: DependencyList): T {
  return useMemo(() => callback, deps);
}

/**
 * Returns a mutable ref object whose `.current` property is initialized to the passed argument.
 * The returned object persists in transient RAM across the component's lifetime.
 *
 * @param initialValue Initial value assigned to `ref.current`
 * @returns A mutable container `{ current: T }`
 */
export function useRef<T>(initialValue: T): { current: T };
export function useRef<T = undefined>(): { current: T | undefined };
export function useRef<T>(initialValue?: T): { current: T | undefined } {
  const fiber = currentFiber!;
  const idx = hookIndex++;
  const hook = getHook(fiber.id, idx);

  if (!hook.ref) {
    hook.ref = { current: initialValue };
  }
  return hook.ref;
}

scheduler.register_handler<[FiberId, number]>("useDebouncedCallback_tick", (task) => {
  const data = task.data;
  if (!data) return;
  const [fiberId, hookIdx] = data;
  const transient = transientStates[fiberId];
  const hook = transient?.hooks ? transient.hooks[hookIdx] : undefined;
  const state = hook?.extra as DebounceState | undefined;
  if (state) {
    const remaining = (state.targetTick || 0) - game.tick;
    if (remaining <= 0) {
      state.taskId = undefined;
      state.targetTick = undefined;
      state.callback();
    } else {
      state.taskId = scheduler.after(remaining, "useDebouncedCallback_tick", [fiberId, hookIdx]);
    }
  }
});

/**
 * Returns a debounced callback function that postpones execution until `delayTicks` game ticks
 * have elapsed since the last invocation. Uses the global bucketed scheduler.
 * Automatically cancels any pending execution on component unmount.
 *
 * @param callback Function to debounce
 * @param delayTicks Number of game ticks to wait before invocation (default: 30 ticks = 0.5s)
 * @returns The debounced callback function
 */
export function useDebouncedCallback<A extends any[]>(callback: (this: void, ...args: A) => void, delayTicks: number = 30): (this: void, ...args: A) => void {
  const fiber = currentFiber!;
  const idx = hookIndex++;
  const fiberId = fiber.id;
  const hook = getHook(fiberId, idx);

  let state = hook.extra as DebounceState | undefined;
  if (!state) {
    state = { callback: (...args: any[]) => callback(...(args as A)) };
    hook.extra = state;
  }
  state.callback = (...args: any[]) => callback(...(args as A));

  useEffect(() => {
    return () => {
      if (state.taskId !== undefined) {
        scheduler.stop(state.taskId);
        state.taskId = undefined;
        state.targetTick = undefined;
      }
    };
  }, []);

  return useCallback(
    (...args: A) => {
      state.callback = () => callback(...args);
      state.targetTick = game.tick + delayTicks;
      if (state.taskId === undefined) {
        state.taskId = scheduler.after(delayTicks, "useDebouncedCallback_tick", [fiberId, idx]);
      }
    },
    [delayTicks],
  );
}

// ============================================================================
// SECTION 5: FACTORIO HIGH-LEVEL HOOKS
// ============================================================================

/** Global registry of active window close handlers keyed by Fiber ID. */
const guiClosedHandlers: Record<FiberId, ((this: void, ev: OnGuiClosedEvent) => void) | undefined> = {};

bind(defines.events.on_gui_closed, (ev: OnGuiClosedEvent) => {
  for (const [_, handler] of pairs(guiClosedHandlers)) {
    handler(ev);
  }
});

scheduler.register_handler<[FiberId, number]>("useInterval_tick", (task) => {
  const data = task.data;
  if (!data) return;
  const [fiberId, hookIdx] = data;
  const transient = transientStates[fiberId];
  const hook = transient?.hooks ? transient.hooks[hookIdx] : undefined;
  const cb = hook?.extra as ((this: void) => void) | undefined;
  if (cb) {
    cb();
    return undefined;
  } else {
    return scheduler.ABORT;
  }
});

/**
 * Executes a periodic callback at the specified interval using the high-performance bucketed `scheduler`.
 * Automatically pauses if `intervalTicks` is 0 or negative.
 * Automatically deregisters the scheduled timer on component unmount or interval change.
 *
 * @param callback Callback invoked every interval
 * @param intervalTicks Interval in game ticks (e.g. 60 ticks = 1 second). Pass <= 0 or undefined to pause.
 */
export function useInterval(callback: (this: void) => void, intervalTicks?: number) {
  const fiber = currentFiber!;
  const idx = hookIndex++;
  const fiberId = fiber.id;
  const hook = getHook(fiberId, idx);

  // Always keep the latest callback in extra for this hook slot
  hook.extra = callback;

  useEffect(() => {
    if (!intervalTicks || intervalTicks <= 0) return undefined;

    const taskId = scheduler.every(intervalTicks, "useInterval_tick", [fiberId, idx]);

    return () => {
      hook.extra = undefined;
      if (taskId) scheduler.stop(taskId);
    };
  }, [intervalTicks]);
}

/**
 * Comprehensive window management hook for top-level dialogs (`WindowFrame`).
 * Handles opening, closing, keyboard shortcuts ('E'/Escape), pinning persistence,
 * auto-centering, and position memory across game sessions.
 *
 * @param playerIndex Factorio player index
 * @param options Optional window options configuration
 * @returns Window controller interface with `close`, `pinned`, `setPinned`, `togglePin`, `onLocationChanged`
 */
export function useWindow(playerIndex: PlayerIndex, options?: UseWindowOptions): UseWindowReturn {
  const { autoCenter = false, pinnable = false, defaultPinned = false, windowKey, closeOnEscape = true, guiTypeFilter = defines.gui_type.custom, locationDebounceTicks = 30 } = options || {};

  const fiber = currentFiber!;
  const storageKey = windowKey || (typeof fiber.type === "string" ? fiber.type : componentTypeToName.get(fiber.type) || "WindowFrame");

  // State: Window pinned status (persisted in storage)
  const [pinned, _setPinned] = useState(() => {
    if (!pinnable) return false;
    return storage.reactWindowPinned?.[playerIndex]?.[storageKey] ?? defaultPinned;
  });

  // Action: Update pinned state and persist to storage
  const setPinned = useCallback(
    (action: SetStateAction<boolean>) => {
      _setPinned((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        if (pinnable) {
          if (!storage.reactWindowPinned) storage.reactWindowPinned = {};
          if (!storage.reactWindowPinned[playerIndex]) {
            storage.reactWindowPinned[playerIndex] = {};
          }
          storage.reactWindowPinned[playerIndex][storageKey] = next;
          strace.debugLazy("react", "saved_window_pinned", () => ["key", storageKey, "pinned", next, "playerIndex", playerIndex]);
        }
        return next;
      });
    },
    [playerIndex, storageKey, pinnable],
  );

  // Action: Synchronously save window coordinates to storage
  const saveLocationDirect = useCallback(
    (loc: GuiLocation | undefined) => {
      if (!loc || autoCenter) return;
      if (!storage.reactWindowPositions) storage.reactWindowPositions = {};
      if (!storage.reactWindowPositions[playerIndex]) {
        storage.reactWindowPositions[playerIndex] = {};
      }
      storage.reactWindowPositions[playerIndex][storageKey] = loc;
      strace.debugLazy("react", "saved_window_location", () => ["key", storageKey, "x", loc.x, "y", loc.y, "playerIndex", playerIndex]);
    },
    [playerIndex, storageKey, autoCenter],
  );

  // Action: Debounced position saving during continuous dragging
  const debouncedSaveLocation = useDebouncedCallback(saveLocationDirect, locationDebounceTicks);

  // Action: Programmatically close window, restore focus, and destroy root
  const rawClose = useCallback(() => {
    const elem = findFirstGuiElement(fiber);
    if (elem && elem.valid) {
      if (!autoCenter && elem.location) {
        saveLocationDirect(elem.location);
      }
      destroyGuiElement(elem);
    }
    const player = game.get_player(playerIndex);
    if (player && player.opened === elem) player.opened = undefined;

    const root = transientStates[fiber.id]?.root;
    if (root) {
      destroyRoot(root.id);
    }
  }, [fiber, playerIndex, autoCenter, saveLocationDirect]);

  // Effect: Restore saved window coordinates or auto-center on mount
  useEffect(() => {
    const elem = findFirstGuiElement(fiber);
    if (elem && elem.valid) {
      const saved = autoCenter ? undefined : storage.reactWindowPositions?.[playerIndex]?.[storageKey];
      if (saved && saved.x !== undefined && saved.y !== undefined) {
        strace.debugLazy("react", "restore_window_location", () => ["key", storageKey, "x", saved.x, "y", saved.y, "playerIndex", playerIndex]);
        elem.location = saved;
      } else {
        strace.debugLazy("react", "auto_center_window", () => ["key", storageKey, "playerIndex", playerIndex]);
        elem.force_auto_center();
      }
    }
  }, []);

  // Effect: Synchronize player.opened focus with pinning state
  useEffect(() => {
    const player = game.get_player(playerIndex);
    const elem = findFirstGuiElement(fiber);
    if (!player || !elem || !elem.valid) return;
    if (pinnable && pinned) {
      if (player.opened === elem) player.opened = undefined;
    } else {
      player.opened = elem;
    }
  }, [pinned, playerIndex, pinnable]);

  // Handler: Handle Escape / 'E' closing when window is not pinned
  const isPinned = pinnable && pinned;
  const guiClosedHandler = (ev: OnGuiClosedEvent) => {
    if (!closeOnEscape || isPinned || ev.player_index !== playerIndex) return;
    const elem = findFirstGuiElement(fiber);
    if (ev.element && elem && ev.element === elem) {
      strace.debugLazy("react", "gui_closed_event", () => ["playerIndex", playerIndex, "target", "element", "fiber", fiberTrace(fiber)]);
      return rawClose();
    }
    if (ev.gui_type === guiTypeFilter) {
      strace.debugLazy("react", "gui_closed_event", () => ["playerIndex", playerIndex, "target", "gui_type", "fiber", fiberTrace(fiber)]);
      return rawClose();
    }
  };
  guiClosedHandlers[fiber.id] = guiClosedHandler;

  // Effect: Clean up on_gui_closed handler on unmount
  useEffect(() => {
    return () => {
      guiClosedHandlers[fiber.id] = undefined;
    };
  }, []);

  // Action: Toggle pinned state
  const togglePin = useCallback(() => {
    setPinned((p) => !p);
  }, [setPinned]);

  // Action: Handle window dragging with debounced persistence
  const onLocationChanged = useCallback(
    (ev: OnGuiLocationChangedEvent) => {
      if (ev.element && ev.element.valid && !autoCenter && ev.element.location) {
        if (locationDebounceTicks > 0) {
          debouncedSaveLocation(ev.element.location);
        } else {
          saveLocationDirect(ev.element.location);
        }
      }
    },
    [autoCenter, debouncedSaveLocation, saveLocationDirect, locationDebounceTicks],
  );

  return {
    close: rawClose,
    pinned,
    setPinned,
    togglePin,
    onLocationChanged,
  };
}

/** Active entity observers keyed by Fiber ID. */
const activeEntityObservers: Record<FiberId, ObserverData | undefined> = {};

/**
 * Normalizes Factorio `MapPosition` (which can be a `{x, y}` table or `[x, y]` tuple) to `{x, y}`.
 *
 * @param pos Map position representation
 * @returns Normalized coordinate object
 */
function getMapPositionCoords(pos: MapPosition): { x: number; y: number } {
  if (typeof pos === "object" && "x" in pos) {
    return { x: pos.x, y: pos.y };
  }
  const tuple = pos as [number, number];
  return { x: tuple[0], y: tuple[1] };
}

/**
 * Observes a `LuaEntity` lifecycle (destruction, mining, blueprint revival) and executes callbacks.
 * Automatically tracks entity position, surface, and unit number to handle rebuilds and ghost revivals.
 *
 * @param entity The Factorio entity to track
 * @param callbacks Lifecycle callback handlers (`onDestroyed`, `onRevived`)
 */
export function useEntityLifecycle(entity: LuaEntity | undefined, callbacks: EntityLifecycleCallbacks) {
  const fiber = currentFiber!;
  const idx = hookIndex++;
  const fiberId = fiber.id;
  const hook = getHook(fiberId, idx);
  hook.extra = callbacks;

  if (entity && entity.valid) {
    activeEntityObservers[fiberId] = {
      entity,
      unit_number: entity.unit_number,
      surface_index: entity.surface.index,
      position: entity.position,
      callbacks: {
        onDestroyed: () => {
          const cb = hook.extra as EntityLifecycleCallbacks | undefined;
          if (cb && cb.onDestroyed) cb.onDestroyed();
        },
        onRevived: (newEntity: LuaEntity) => {
          const cb = hook.extra as EntityLifecycleCallbacks | undefined;
          if (cb && cb.onRevived) cb.onRevived(newEntity);
        },
      },
    };
  }

  useEffect(() => {
    return () => {
      activeEntityObservers[fiberId] = undefined;
      hook.extra = undefined;
    };
  }, []);
}

/**
 * Global event listener handling entity death and mining events, notifying matched observers.
 *
 * @param ev Event payload containing the destroyed entity reference
 */
function handleEntityDestroyed(ev: EntityDestroyedEvent) {
  const minedEntity = ev.entity;
  if (!minedEntity || !minedEntity.valid) return;
  const minedUnitNumber = minedEntity.unit_number;

  for (const [_, obs] of pairs(activeEntityObservers)) {
    if ((obs.entity.valid && obs.entity === minedEntity) || (obs.unit_number !== undefined && obs.unit_number === minedUnitNumber)) {
      obs.callbacks.onDestroyed?.();
    }
  }
}

bind(defines.events.on_entity_died, (e) => handleEntityDestroyed(e));
bind(defines.events.on_player_mined_entity, (e) => handleEntityDestroyed(e));
bind(defines.events.on_robot_mined_entity, (e) => handleEntityDestroyed(e));
bind(defines.events.script_raised_destroy, (e) => handleEntityDestroyed(e));
if (defines.events.on_space_platform_mined_entity !== undefined) {
  bind(defines.events.on_space_platform_mined_entity, (e) => handleEntityDestroyed(e));
}

/**
 * Global event listener handling entity placement and revival events, reconnecting matched observers.
 *
 * @param ev Event payload containing the newly created entity reference
 */
function handleEntityBuilt(ev: EntityBuiltEvent) {
  const newEntity = ev.entity;
  if (!newEntity || !newEntity.valid) return;

  const { x: nx, y: ny } = getMapPositionCoords(newEntity.position);
  const surfIdx = newEntity.surface.index;

  for (const [_, obs] of pairs(activeEntityObservers)) {
    if (obs.surface_index === surfIdx) {
      const { x: ox, y: oy } = getMapPositionCoords(obs.position);
      if (Math.abs(ox - nx) < 0.2 && Math.abs(oy - ny) < 0.2) {
        obs.entity = newEntity;
        obs.unit_number = newEntity.unit_number;
        obs.callbacks.onRevived?.(newEntity);
      }
    }
  }
}

bind(defines.events.on_built_entity, (e) => handleEntityBuilt(e));
bind(defines.events.on_robot_built_entity, (e) => handleEntityBuilt(e));
bind(defines.events.script_raised_built, (e) => handleEntityBuilt(e));
bind(defines.events.script_raised_revive, (e) => handleEntityBuilt(e));
if (defines.events.on_space_platform_built_entity !== undefined) {
  bind(defines.events.on_space_platform_built_entity, (e) => handleEntityBuilt(e));
}

/** Set of Root IDs marked dirty and scheduled for re-rendering. */
let dirtyRoots: Record<RootId, boolean | undefined> = {};
/** Set of Fiber IDs that directly requested a re-render. */
let dirtyFibers: Record<FiberId, boolean | undefined> = {};
/** Set of ancestor Fiber IDs containing dirty descendants. */
let dirtyBranches: Record<FiberId, boolean | undefined> = {};
/** True if a deferred sub-tick render pass has already been scheduled. */
let isRenderScheduled = false;

/**
 * Compares two style override dictionaries for property equality.
 *
 * @param prevStyles Previous style overrides
 * @param nextStyles Next style overrides
 * @returns True if both style dictionaries are identical
 */
function areStylesEqual(prevStyles?: Record<string, any>, nextStyles?: Record<string, any>): boolean {
  if (prevStyles === nextStyles) return true;
  if (!prevStyles || !nextStyles) return false;
  if (typeof prevStyles !== "object" || typeof nextStyles !== "object") return false;

  for (const [k, v] of pairs(nextStyles)) {
    if (prevStyles[k] !== v) return false;
  }
  for (const [k] of pairs(prevStyles)) {
    if (nextStyles[k] === undefined) return false;
  }
  return true;
}

/**
 * Compares component props for shallow equality to determine if reconciliation can be bailed out.
 * Automatically ignores stable function callbacks and performs deep comparison on `styles` overrides.
 *
 * @param prevProps Previous props
 * @param nextProps Next props
 * @returns True if props are functionally identical
 */
export function arePropsEqual(prevProps?: Props, nextProps?: Props): boolean {
  if (prevProps === nextProps) return true;
  if (!prevProps || !nextProps) return false;
  if (typeof prevProps !== "object" || typeof nextProps !== "object") return false;

  for (const [k, v] of pairs(nextProps)) {
    const prevV = prevProps[k];
    if (k === "styles" && typeof v === "object" && typeof prevV === "object") {
      if (prevV !== v && !areStylesEqual(prevV, v)) return false;
    } else if (prevV !== v) {
      return false;
    }
  }

  for (const [k] of pairs(prevProps)) {
    if (nextProps[k] === undefined) return false;
  }

  return true;
}

/**
 * Marks a Fiber and its parent branch as dirty, and schedules a deferred sub-tick render pass
 * via an ephemeral `rendering.draw_line` object destruction trigger.
 *
 * @param fiber The Fiber node requesting a re-render
 */
export function scheduleUpdate(fiber: Fiber) {
  dirtyFibers[fiber.id] = true;
  const transient = transientStates[fiber.id];
  if (transient?.root) {
    dirtyRoots[transient.root.id] = true;
  }

  let parent = transient?.parent;
  while (parent) {
    dirtyBranches[parent.id] = true;
    parent = transientStates[parent.id]?.parent;
  }

  strace.traceLazy("react", "schedule_update", () => ["fiber", fiberTrace(fiber), "isRenderScheduled", isRenderScheduled]);
  if (!isRenderScheduled) {
    isRenderScheduled = true;
    const obj = rendering.draw_line({
      color: [0, 0, 0, 0],
      width: 0,
      from: [0, 0],
      to: [0, 0],
      surface: 1 as SurfaceIndex,
    });
    const [rn] = script.register_on_object_destroyed(obj);
    storage.reactDeferredRn = rn as RegistrationNumber;
    obj.destroy();
  }
}

/**
 * Processes all dirty Fiber roots in a single batch pass, re-rendering modified components,
 * committing DOM updates, and flushing all queued side-effects.
 *
 * @param roots Table of active React roots in global storage
 */
export function performDeferredUpdates(roots?: Record<RootId, ReactRootData | undefined>) {
  isRenderScheduled = false;
  if (!roots) return;

  strace.debugLazy("react", "perform_deferred_updates", () => ["dirtyRoots", tableSize(dirtyRoots), "dirtyFibers", tableSize(dirtyFibers)]);

  for (const [rootId] of pairs(dirtyRoots)) {
    const root = roots[rootId];
    if (root && root.fiber && root.containerElem && root.containerElem.valid) {
      const rootElem = findFirstGuiElement(root.fiber);
      if (rootElem && !rootElem.valid) {
        destroyRoot(rootId);
        continue;
      }
      const comp = getComponentType(root.rootType);
      const element = createElement(comp, root.rootProps);
      root.fiber = reconcile(element, root.fiber, root.containerElem, undefined, root);
    } else if (root && (!root.containerElem || !root.containerElem.valid)) {
      destroyRoot(rootId);
    }
  }

  dirtyRoots = {};
  dirtyFibers = {};
  dirtyBranches = {};
  flushPendingEffects();
}

/**
 * Core React reconciliation and diffing algorithm.
 * Compares a new `ReactElement` virtual descriptor against an existing `Fiber` node.
 * Evaluates bailouts, executes functional components, creates or mutates native GUI widgets,
 * and recursively reconciles children.
 *
 * @param element Virtual React element descriptor
 * @param oldFiber Existing Fiber node from previous render pass
 * @param parentElem Native Factorio GUI parent container
 * @param parentFiber Direct parent Fiber node in the component tree
 * @param root Enclosing React root metadata
 * @returns The updated or newly created Fiber node
 */
export function reconcile(element: ReactElement, oldFiber: Fiber | undefined, parentElem: LuaGuiElement, parentFiber?: Fiber, root?: ReactRootData): Fiber {
  const typeName = getComponentTypeName(element.type);
  const compType = getComponentType(element.type);

  // 1. Fiber matching: reuse old fiber if component identity and key match; otherwise unmount and allocate new
  let fiber = oldFiber;
  const oldTransient = fiber ? transientStates[fiber.id] : undefined;
  const oldCompType = oldTransient?.elementType;
  const isTypeMatched = fiber !== undefined && (oldCompType !== undefined ? oldCompType === compType : fiber.type === typeName);

  if (!fiber || !isTypeMatched || fiber.key !== element.key) {
    if (fiber) {
      const old = fiber;
      strace.debugLazy("react", "remount_mismatch", () => ["fiber", fiberTrace(old), "newType", typeName, "oldKey", old.key, "newKey", element.key]);
      unmountFiber(fiber);
    }
    fiber = createFiber(typeName, element.key);
  }

  // 2. RAM state: update tree hierarchy links, component type, and cache props for diffing
  const transient = getTransient(fiber.id);
  transient.fiber = fiber;
  transient.parent = parentFiber;
  transient.root = root;
  transient.elementType = compType;
  const prevProps = transient.props;
  transient.props = element.props;

  if (typeof compType === "function") {
    // 3A. Functional component branch: check bailout, render with hooks, and reconcile children
    const isSelfDirty = dirtyFibers[fiber.id] === true;
    const hasDirtyBranch = dirtyBranches[fiber.id] === true;
    const propsEqual = prevProps !== undefined && arePropsEqual(prevProps, element.props);

    // Bailout optimization: skip render if self is clean, branch is clean, and props are unchanged
    if (!isSelfDirty && !hasDirtyBranch && propsEqual && fiber.children !== undefined) {
      return fiber;
    }

    dirtyFibers[fiber.id] = undefined;
    dirtyBranches[fiber.id] = undefined;

    strace.traceLazy("react", "render_component", () => ["fiber", fiberTrace(fiber), "hooks", fiber.hooks ? fiber.hooks.length : 0, "children", fiber.children ? fiber.children.length : 0]);

    // Execute component render with active hook slot tracking
    beginHookRender(fiber, false);
    const children = compType(element.props);
    endHookRender();

    // Reconcile resulting child element tree
    const childArr = flattenChildren(children);
    reconcileChildren(fiber, childArr, parentElem, root);
  } else {
    // 3B. Host GUI element branch: create or diff native Factorio C++ widget
    if (typeof compType !== "string") {
      error(`[React Error] Invalid component type: ${tostring(compType)}`);
    }
    if (!transient.elem || !transient.elem.valid) {
      // Create new Factorio GUI element under parent container
      transient.elem = createGuiElement(parentElem, compType as GuiElementType, element.props, fiber.id);
    } else {
      // Incrementally diff and apply changed properties across C++/Lua boundary
      updateGuiElement(transient.elem, element.props, fiber.id, prevProps);
    }
    // Reconcile nested child widgets under this host element container
    const childArr = flattenChildren(element.props.children);
    reconcileChildren(fiber, childArr, transient.elem!, root);
  }

  return fiber;
}

/**
 * Reconciles a list of child ReactElements against existing child Fibers using keys and positions.
 * Unmounts and disposes discarded Fibers.
 *
 * @param parentFiber Parent Fiber node whose children are being reconciled
 * @param elements List of new child ReactElements
 * @param parentElem Native Factorio GUI element serving as the child container
 * @param root Enclosing React root metadata
 */
function reconcileChildren(parentFiber: Fiber, elements: ReactElement[], parentElem: LuaGuiElement, root?: ReactRootData) {
  const oldChildren = parentFiber.children || [];
  const oldMap: Record<Key, Fiber | undefined> = {};
  const unkeyed: Fiber[] = [];

  // 1. Index existing child fibers by key or unkeyed queue
  for (const child of oldChildren) {
    if (child.key !== undefined) {
      oldMap[child.key] = child;
    } else {
      unkeyed.push(child);
    }
  }

  const newChildren: Fiber[] = [];
  const totalUnkeyed = unkeyed.length;
  let unkeyedIndex = 0;

  // 2. Match new virtual elements against indexed fibers and reconcile
  for (const el of elements) {
    let matchedFiber: Fiber | undefined;

    if (el.key !== undefined) {
      matchedFiber = oldMap[el.key];
      oldMap[el.key] = undefined;
    } else if (unkeyedIndex < totalUnkeyed) {
      matchedFiber = unkeyed[unkeyedIndex];
      unkeyedIndex++;
    }

    const newFiber = reconcile(el, matchedFiber, parentElem, parentFiber, root);
    newChildren.push(newFiber);
  }

  // 3. Unmount remaining orphaned fibers not reused in the new render
  for (const [_, child] of pairs(oldMap)) {
    if (child !== undefined) {
      unmountFiber(child);
    }
  }
  for (let i = unkeyedIndex; i < totalUnkeyed; i++) {
    const child = unkeyed[i];
    if (child !== undefined) {
      unmountFiber(child);
    }
  }

  parentFiber.children = newChildren;
}

/**
 * Recursively unmounts a Fiber subtree, disposes active effect cleanups,
 * resets ref bindings, removes RAM transient state, and destroys native Factorio GUI elements.
 *
 * @param fiber The root of the Fiber subtree to unmount
 */
function unmountFiber(fiber: Fiber) {
  const transient = transientStates[fiber.id];
  let cleanupsCount = 0;
  if (transient) {
    if (transient.hooks) {
      for (const [_, hook] of pairs(transient.hooks)) {
        if (hook && hook.cleanup) {
          cleanupsCount++;
          hook.cleanup();
          hook.cleanup = undefined;
        }
      }
    }
    if (transient.elem && transient.elem.valid) {
      if (transient.props.ref) {
        assignRef(transient.props.ref, undefined);
      }
      destroyGuiElement(transient.elem);
    }
    transientStates[fiber.id] = undefined;
  }

  strace.traceLazy("react", "unmount_fiber", () => ["fiber", fiberTrace(fiber), "cleanups", cleanupsCount, "hasElem", transient?.elem !== undefined]);
  if (fiber.children !== undefined) {
    for (const child of fiber.children) {
      unmountFiber(child);
    }
  }
}

// ============================================================================
// SECTION 7: ROOT LIFECYCLE & EVENT ROUTING
// ============================================================================

/**
 * Mounts a root React element into a native Factorio GUI container (e.g. `player.gui.screen`).
 *
 * @param container Native Factorio GUI parent container
 * @param element Root ReactElement (e.g. `<CombinatorWindow playerIndex={playerIndex} />`)
 * @returns Unique numeric Root ID
 */
export function createRoot(container: LuaGuiElement, element: ReactElement): RootId {
  if (!storage.reactRoots) storage.reactRoots = {};
  const roots = storage.reactRoots;

  const rootType = getComponentTypeName(element.type);

  // Clean up any previous root mounted on the same container with the same component type
  for (const [existingIdStr, existingRoot] of pairs(roots)) {
    if (existingRoot && existingRoot.containerElem === container && existingRoot.rootType === rootType) {
      destroyRoot(existingIdStr as RootId);
    }
  }

  const rootId = (storage.reactNextFiberId ?? 1) as RootId;
  storage.reactNextFiberId = rootId + 1;

  strace.debugLazy("react", "create_root", () => ["rootId", rootId, "rootType", rootType, "playerIndex", container.player_index]);

  const rootData: ReactRootData = {
    id: rootId,
    containerElem: container,
    rootType: rootType,
    rootProps: element.props,
    fiber: undefined,
  };

  roots[rootId] = rootData;
  rootData.fiber = reconcile(element, undefined, container, undefined, rootData);
  flushPendingEffects();

  return rootId;
}

/**
 * Unmounts a root React tree, disposes all child fibers and GUI elements,
 * and removes the root entry from persistent global storage.
 *
 * @param rootId Root identifier returned by `createRoot`
 */
export function destroyRoot(rootId: RootId) {
  if (!storage.reactRoots) return;
  const roots = storage.reactRoots;
  const root = roots[rootId];
  if (!root) return;

  strace.debugLazy("react", "destroy_root", () => ["rootId", rootId, "rootType", root.rootType, "playerIndex", root.containerElem?.player_index]);

  if (root.fiber !== undefined) {
    unmountFiber(root.fiber);
  }

  roots[rootId] = undefined;
}

/**
 * Recursively hydrates an existing Fiber tree during game `on_load`.
 * Restores non-serializable RAM transient state (event handlers, memo caches, and live `LuaGuiElement` C++ references)
 * matching native DOM tags without modifying game storage or mutating the DOM.
 *
 * @param element Root virtual element descriptor
 * @param fiber Root Fiber node loaded from `storage.reactRoots`
 * @param parentElem Native Factorio GUI container
 * @param parentFiber Direct parent Fiber node in the component tree
 * @param root Enclosing React root metadata
 */
export function hydrateFiber(element: ReactElement, fiber: Fiber, parentElem: LuaGuiElement, parentFiber?: Fiber, root?: ReactRootData) {
  const compType = getComponentType(element.type);

  const transient = getTransient(fiber.id);
  transient.fiber = fiber;
  transient.parent = parentFiber;
  transient.root = root;
  transient.elementType = compType;
  transient.props = element.props;

  if (typeof compType === "function") {
    beginHookRender(fiber, true);
    const children = compType(element.props);
    endHookRender();

    const childArr = flattenChildren(children);
    hydrateChildren(fiber, childArr, parentElem, root);
  } else {
    // Native Factorio element: find matching LuaGuiElement in DOM
    let foundElem: LuaGuiElement | undefined;

    if (parentElem && parentElem.valid) {
      if (parentElem.tags && parentElem.tags.__reactId === fiber.id) {
        foundElem = parentElem;
      } else if (parentElem.children !== undefined) {
        for (const child of parentElem.children) {
          if (child && child.valid && child.tags && child.tags.__reactId === fiber.id) {
            foundElem = child;
            break;
          }
        }
      }
    }

    if (foundElem) {
      transient.elem = foundElem;
      assignRef(element.props.ref, foundElem);
    }

    updateFiberEventHandlers(fiber.id, element.props);

    const childContainer = foundElem || parentElem;
    const childArr = flattenChildren(element.props.children || []);
    hydrateChildren(fiber, childArr, childContainer, root);
  }
}

/**
 * Hydrates child elements by matching them to existing child fibers without mutating `fiber.children`.
 *
 * @param parentFiber Parent Fiber node
 * @param elements Child virtual elements
 * @param parentElem Child GUI container element
 * @param root Enclosing React root metadata
 */
function hydrateChildren(parentFiber: Fiber, elements: ReactElement[], parentElem: LuaGuiElement, root?: ReactRootData) {
  if (!parentFiber.children || parentFiber.children.length === 0) return;

  const oldChildren = parentFiber.children;
  const oldMap: Record<Key, Fiber | undefined> = {};
  const unkeyed: (Fiber | undefined)[] = [];

  for (const child of oldChildren) {
    if (child.key !== undefined) {
      oldMap[child.key] = child;
    } else {
      unkeyed.push(child);
    }
  }

  let unkeyedIndex = 0;

  for (const el of elements) {
    let matchedFiber: Fiber | undefined;

    if (el.key !== undefined) {
      matchedFiber = oldMap[el.key];
    } else if (unkeyedIndex < unkeyed.length) {
      matchedFiber = unkeyed[unkeyedIndex++];
    }

    if (matchedFiber) {
      hydrateFiber(el, matchedFiber, parentElem, parentFiber, root);
    }
  }
}

/**
 * Hydrates all active React roots during game `on_load`.
 * Iterates all active roots stored in `storage.reactRoots` and re-attaches transient RAM state.
 */
export function handleOnLoad() {
  if (storage.reactRoots === undefined) return;
  const roots = storage.reactRoots;
  let count = 0;
  for (const [_, root] of pairs(roots)) {
    if (root && root.fiber && root.containerElem && root.containerElem.valid) {
      const comp = getComponentType(root.rootType);
      const element = createElement(comp, root.rootProps);
      hydrateFiber(element, root.fiber, root.containerElem, undefined, root);
      count++;
    }
  }
  strace.info("react", "hydrate_roots", "count", count);
}

/**
 * Handles deferred subtick render trigger via object destruction.
 * Invoked when the ephemeral rendering line object is destroyed to batch-flush all dirty updates.
 *
 * @param ev Factorio `on_object_destroyed` event payload
 */
export function handleOnObjectDestroyed(ev: OnObjectDestroyedEvent) {
  if (ev.type === defines.target_type.render_object && ev.registration_number === storage.reactDeferredRn) {
    storage.reactDeferredRn = undefined;
    performDeferredUpdates(storage.reactRoots);
  }
}

/**
 * Global high-performance O(1) Factorio GUI event dispatcher.
 * Resolves the target Fiber ID from `event.element.tags.__reactId` and dispatches directly
 * to the pre-indexed handler in `transient.handlers` without string matching or tree traversal.
 *
 * @param event Factorio GUI event payload
 */
export function handleGuiEvent(event: GuiEventData) {
  const elem = event.element;
  if (!elem || !elem.valid || !elem.tags) return;

  const fiberId = elem.tags.__reactId as FiberId | undefined;
  if (fiberId === undefined) return;

  const transient = transientStates[fiberId];
  if (!transient || !transient.handlers) return;
  const handler = transient.handlers[event.name];

  if (handler) {
    if (event.name !== defines.events.on_gui_location_changed) {
      strace.traceLazy("react", "event_dispatch", () => {
        const handlerName = GUI_EVENT_MAP[event.name];
        const eventDesc = handlerName !== undefined ? `${tostring(event.name)} (${handlerName})` : tostring(event.name);
        return ["event", eventDesc, "fiber", transient.fiber ? fiberTrace(transient.fiber) : `#${fiberId}`, "elem", elem.name || elem.type, "playerIndex", event.player_index];
      });
    }
    handler(event);
  }
}

let _isBootstrapped = false;

/**
 * Bootstraps the React runtime by registering core Factorio event listeners:
 * `on_load` hydration, sub-tick deferred render trigger, and all GUI interaction events.
 */
export function bootstrapReact() {
  if (_isBootstrapped) return;
  _isBootstrapped = true;
  bind("on_load", () => handleOnLoad());
  bind(defines.events.on_object_destroyed, (e) => handleOnObjectDestroyed(e));
  for (const [id] of pairs(GUI_EVENT_MAP)) {
    bind(id, (e) => handleGuiEvent(e));
  }
}

if (typeof script !== "undefined" && script !== undefined && typeof defines !== "undefined" && defines && defines.events) {
  bootstrapReact();
}
