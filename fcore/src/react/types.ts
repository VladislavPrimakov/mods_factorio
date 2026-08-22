import type {
  LuaGuiElement,
  LuaEntity,
  GuiElementType,
  UnitNumber,
  SurfaceIndex,
  MapPosition,
  EventId,
  OnGuiClickEvent,
  OnGuiClosedEvent,
  OnGuiConfirmedEvent,
  OnGuiTextChangedEvent,
  OnGuiCheckedStateChangedEvent,
  OnGuiElemChangedEvent,
  OnGuiValueChangedEvent,
  OnGuiSelectionStateChangedEvent,
  OnGuiSwitchStateChangedEvent,
  OnGuiSelectedTabChangedEvent,
  OnGuiHoverEvent,
  OnGuiLeaveEvent,
  OnGuiLocationChangedEvent,
  OnGuiOpenedEvent,
  OnEntityDiedEvent,
  OnPlayerMinedEntityEvent,
  OnRobotMinedEntityEvent,
  ScriptRaisedDestroyEvent,
  OnSpacePlatformMinedEntityEvent,
  OnBuiltEntityEvent,
  OnRobotBuiltEntityEvent,
  ScriptRaisedBuiltEvent,
  ScriptRaisedReviveEvent,
  OnSpacePlatformBuiltEntityEvent,
} from "factorio:runtime";

import type { StyleFor, StylesFor } from "../styles";
import type { NativePropsFor } from "./generated-props";

// ============================================================================
// 2. FACTORIO GUI MEMBERS & REFS (Live C++ Element Objects & References)
// ============================================================================

/**
 * Automatically extracts the concrete live `LuaGuiElement` subtype for element type `T`.
 * Example: `GuiElementFor<"button">` resolves to `ButtonGuiElement`.
 */
export type GuiElementFor<T extends GuiElementType = GuiElementType> = Extract<LuaGuiElement, { type: T }>;

/** A mutable ref object container holding a reference to a live C++ `LuaGuiElement` or custom value. */
type RefObject<T> = { current: T | undefined };

/** A ref callback function invoked when a C++ `LuaGuiElement` mounts or unmounts. */
type RefCallback<T> = (this: void, elem: T | undefined) => void;

/** Universal ref type: either a mutable `{ current }` object container or a callback function. */
export type Ref<T = LuaGuiElement> = RefObject<T> | RefCallback<T>;

/**
 * Utility type restricting state values to serializable non-functional types.
 * Functions cannot be saved in persistent Factorio storage and should be managed via `useCallback` or `useRef`.
 */
export type NonFunction<T> = T extends (this: void, ...args: any[]) => any ? never : T;

/** A value or a functional state updater callback. */
export type SetStateAction<T> = T | ((this: void, prev: T) => T);

/** A function that updates state (e.g. from useState or useReducer). */
export type Dispatch<A> = (this: void, value: A) => void;

/** An optional cleanup callback returned by a side-effect. */
export type EffectCleanup = (this: void) => void;

/** A side-effect callback function passed to `useEffect`. */
export type EffectCallback = (this: void) => void | EffectCleanup;

/** A list of dependencies passed to hooks (e.g. `useEffect`, `useMemo`, `useCallback`). */
export type DependencyList = readonly unknown[];

// ============================================================================
// 3. FACTORIO GUI EVENTS (Event System & Handler Types)
// ============================================================================

/**
 * Single source of truth: React handler prop name -> Native Factorio event payload structure.
 */
export type EventMapping = {
  onClick: OnGuiClickEvent;
  onClosed: OnGuiClosedEvent;
  onConfirmed: OnGuiConfirmedEvent;
  onTextChanged: OnGuiTextChangedEvent;
  onCheckedStateChanged: OnGuiCheckedStateChangedEvent;
  onElemChanged: OnGuiElemChangedEvent;
  onValueChanged: OnGuiValueChangedEvent;
  onSelectionStateChanged: OnGuiSelectionStateChangedEvent;
  onSwitchStateChanged: OnGuiSwitchStateChangedEvent;
  onSelectedTabChanged: OnGuiSelectedTabChangedEvent;
  onHover: OnGuiHoverEvent;
  onLeave: OnGuiLeaveEvent;
  onLocationChanged: OnGuiLocationChangedEvent;
  onOpened: OnGuiOpenedEvent;
};

/** Union of all possible native Factorio GUI event payloads. */
export type GuiEventData = EventMapping[keyof EventMapping];

/**
 * Replaces generic `ev.element: LuaGuiElement` with the concrete narrowed subtype for element `T`.
 */
export type TypedEvent<E, T extends GuiElementType = GuiElementType> = Omit<E, "element"> & {
  readonly element: GuiElementFor<T>;
};

/**
 * Generic strongly-typed handler for native Factorio GUI events.
 */
export type GuiEventHandler<K extends keyof EventMapping, T extends GuiElementType = GuiElementType> = (this: void, event: TypedEvent<EventMapping[K], T>) => void;

/**
 * Map connecting Factorio engine event IDs to React prop names.
 */
export const GUI_EVENT_MAP: Record<EventId<any>, keyof EventMapping> = {
  [defines.events.on_gui_click]: "onClick",
  [defines.events.on_gui_closed]: "onClosed",
  [defines.events.on_gui_confirmed]: "onConfirmed",
  [defines.events.on_gui_text_changed]: "onTextChanged",
  [defines.events.on_gui_checked_state_changed]: "onCheckedStateChanged",
  [defines.events.on_gui_elem_changed]: "onElemChanged",
  [defines.events.on_gui_value_changed]: "onValueChanged",
  [defines.events.on_gui_selection_state_changed]: "onSelectionStateChanged",
  [defines.events.on_gui_switch_state_changed]: "onSwitchStateChanged",
  [defines.events.on_gui_selected_tab_changed]: "onSelectedTabChanged",
  [defines.events.on_gui_hover]: "onHover",
  [defines.events.on_gui_leave]: "onLeave",
  [defines.events.on_gui_location_changed]: "onLocationChanged",
  [defines.events.on_gui_opened]: "onOpened",
};

/**
 * Generates strictly typed event handler callback signatures for a set of event names.
 */
type HandlersFor<Names extends keyof EventMapping, T extends GuiElementType> = {
  [K in Names]?: (this: void, event: TypedEvent<EventMapping[K], T>) => void;
};

/** Common events supported across all native GUI elements. */
type CommonEventNames = "onHover" | "onLeave" | "onOpened" | "onClosed" | "onLocationChanged";

/**
 * Declarative mapping: which element-specific events are permitted for each native element type.
 */
type ElementEventNames = {
  button: "onClick";
  "sprite-button": "onClick";
  checkbox: "onCheckedStateChanged";
  radiobutton: "onCheckedStateChanged";
  "drop-down": "onSelectionStateChanged";
  "list-box": "onSelectionStateChanged";
  slider: "onValueChanged";
  textfield: "onTextChanged" | "onConfirmed";
  "text-box": "onTextChanged";
  switch: "onSwitchStateChanged";
  "choose-elem-button": "onElemChanged" | "onClick";
  "tabbed-pane": "onSelectedTabChanged";
};

/**
 * Full set of typed event handlers available on element type `T`.
 */
type EventHandlersFor<T extends GuiElementType> = HandlersFor<CommonEventNames, T> & (T extends keyof ElementEventNames ? HandlersFor<ElementEventNames[T], T> : {});

// ============================================================================
// 4. REACT CORE, FIBER & STATE (React Core, State & Hooks)
// ============================================================================

/**
 * Generic dictionary representing a component props object.
 * Pre-defines common React properties (`key`, `ref`, `style`, `styles`, `children`) while
 * allowing arbitrary custom properties via index signature.
 */
export interface Props {
  key?: Key;
  ref?: Ref<any>;
  style?: string;
  styles?: Record<string, any>;
  children?: ReactNode;
  [key: string]: any;
}

/**
 * Unique identifier used by the reconciler to match and preserve fiber state across renders.
 */
export type Key = string | number;

/**
 * Anything that can be rendered as JSX children:
 * - A virtual element (`<Button />`, `<Frame />`)
 * - Primitives for conditional rendering (`boolean`, `undefined`)
 * - An array of child nodes
 */
export type ReactNode = ReactElement<any> | boolean | undefined | ReactNode[];

/**
 * Valid element constructor or tag identifier:
 * - Native Factorio primitive tag name (`"button" | "textfield" | "flow" | ...`)
 * - Custom functional component (`ComponentType<P>`)
 */
export type ElementType<P extends Props = Props> = GuiElementType | ComponentType<P>;

/**
 * Ephemeral virtual DOM descriptor (snapshot blueprint) created by `createElement` or `<Component />`.
 * Holds props and child elements for the current render pass, then is discarded by the garbage collector.
 */
export interface ReactElement<P extends Props = Props, T extends ElementType<any> = ElementType<any>> {
  /** Optional key for list reconciliation stability. */
  key?: Key;
  /** Element type: native Factorio string tag or functional component. */
  type: T;
  /** Element props including children. */
  props: P & { children?: ReactNode };
}

/**
 * Functional component blueprint: a pure or stateful function that accepts `props` and returns a `ReactNode`.
 * Represents the component definition itself (the factory/recipe), as opposed to an instantiated `<ReactElement />`.
 */
export type ComponentType<P extends Props = Props> = (this: void, props: P) => ReactNode;

/**
 * Lifecycle event handlers for components linked to a specific Factorio in-game entity (`useEntityLifecycle`).
 * Automatically handles cases where the bound entity is mined, destroyed, or revived.
 */
export interface EntityLifecycleCallbacks {
  /** Called when the bound entity is destroyed, mined, or becomes invalid in the game world. */
  onDestroyed?: (this: void) => void;
  /** Called when the bound entity is revived (e.g. via undo / ghost revival), providing the fresh `LuaEntity` reference. */
  onRevived?: (this: void, newEntity: LuaEntity) => void;
}

/** Unique numeric identifier for a virtual Fiber node. */
export type FiberId = number;

/** Unique numeric identifier for a mounted React root tree. */
export type RootId = number;

/**
 * Fiber - Serializable state node in our component tree.
 * Persisted directly into Factorio global storage (`storage.reactRoots`).
 * Contains ONLY safe-to-serialize plain data (no functions, no metatables, no C++ references).
 */
export interface Fiber {
  /** Unique sequential ID assigned to this fiber node. */
  id: FiberId;
  /** String identifier of the component or native tag name. */
  type: string;
  /** Optional reconciliation key. */
  key?: Key;
  /** Serialized hook state slots (primitive state, reducer state). */
  hooks: unknown[];
  /** Child fiber nodes. */
  children: Fiber[];
}

/**
 * TransientState - Non-serialized state held in memory (RAM).
 * Holds live C++ references to `LuaGuiElement`, effect cleanup closures, and memo caches.
 * Hydrated upon game load (`on_load`).
 */
/**
 * In-memory state and metadata for an individual React hook slot.
 */
export interface HookInstance {
  /** Stable state updater dispatch function (for `useState`, `useReducer`). */
  updater?: Dispatch<any>;
  /** Mutable container `{ current: T }` (for `useRef`). */
  ref?: { current: any };
  /** Cached computation result (for `useMemo`, `useCallback`). */
  memo?: unknown;
  /** Dependency array from the previous render pass for change detection. */
  deps?: DependencyList;
  /** Active effect cleanup function (for `useEffect`, `useLayoutEffect`). */
  cleanup?: EffectCleanup;
  /** Extra transient storage for specialized hooks (`useDebouncedCallback`, `useInterval`, `useEntityLifecycle`). */
  extra?: unknown;
}

export interface TransientState {
  /** Direct in-memory reference to the corresponding serializable Fiber node. */
  fiber?: Fiber;
  /** Direct in-memory reference to the parent Fiber node in the component tree. */
  parent?: Fiber;
  /** Direct in-memory reference to the enclosing React root data. */
  root?: ReactRootData;
  /** Latest props snapshot passed to this fiber. */
  props: Props;
  /** Live C++ Factorio GUI element reference. */
  elem?: LuaGuiElement;
  /** Array of in-memory hook instances keyed by hook slot index (0..N). */
  hooks?: Record<number, HookInstance>;
  /** Fast pre-indexed event handlers table keyed directly by Factorio event ID (O(1) lookup). */
  handlers?: Record<EventId<any>, ((this: void, event: GuiEventData) => void) | undefined>;
  /** Live component function or native tag element type reference in RAM. */
  elementType?: ElementType;
}

/**
 * Root metadata saved in global `storage.reactRoots` to enable rehydration upon game load.
 */
export interface ReactRootData {
  /** Unique sequential Root ID. */
  id: RootId;
  /** Native parent container element (e.g. `player.gui.screen`). */
  containerElem: LuaGuiElement;
  /** Root fiber tree. */
  fiber?: Fiber;
  /** Registered string name of the root component function. */
  rootType: string;
  /** Initial props passed to the root component. */
  rootProps?: Props;
}

// ============================================================================
// 5. FACTORIO HIGH-LEVEL HOOKS & CONTROLLERS
// ============================================================================

/** Configuration options for the `useWindow` lifecycle hook. */
export interface UseWindowOptions {
  /** Automatically centers the window upon opening and disables position persistence. Default: `false`. */
  autoCenter?: boolean;
  /** Enables pinning functionality (window stays open when 'E'/Escape is pressed). Default: `false`. */
  pinnable?: boolean;
  /** Initial pinned state if no saved state is found in storage. Default: `false`. */
  defaultPinned?: boolean;
  /** Custom unique storage key for saving coordinates and pin state. Default: `fiber.type`. */
  windowKey?: string;
  /** Automatically closes window on Escape/'E' when not pinned. Default: `true`. */
  closeOnEscape?: boolean;
  /** Filter for `on_gui_closed` event type. Default: `defines.gui_type.custom`. */
  guiTypeFilter?: defines.gui_type;
  /** Delay in game ticks before saving dragged window position to storage. Default: `30` (0.5s). */
  locationDebounceTicks?: number;
}

/**
 * Controller interface returned by the `useWindow` hook.
 */
export interface UseWindowReturn {
  /** Programmatically closes and unmounts the window, resetting `player.opened` and destroying the root. */
  close: (this: void) => void;
  /** Current pinned state of the window. */
  pinned: boolean;
  /** State setter for `pinned`. Automatically persists changes to `storage.reactWindowPinned`. */
  setPinned: Dispatch<SetStateAction<boolean>>;
  /** Helper that toggles the pinned state (`setPinned(prev => !prev)`). */
  togglePin: (this: void) => void;
  /** Event handler to pass to `onLocationChanged` prop to save window coordinates on drag. */
  onLocationChanged?: (this: void, ev: OnGuiLocationChangedEvent) => void;
}

/** Union of all Factorio event payloads that signal entity destruction or mining. */
export type EntityDestroyedEvent = OnEntityDiedEvent | OnPlayerMinedEntityEvent | OnRobotMinedEntityEvent | ScriptRaisedDestroyEvent | OnSpacePlatformMinedEntityEvent;

/** Union of all Factorio event payloads that signal entity placement, ghost construction, or revival. */
export type EntityBuiltEvent = OnBuiltEntityEvent | OnRobotBuiltEntityEvent | ScriptRaisedBuiltEvent | ScriptRaisedReviveEvent | OnSpacePlatformBuiltEntityEvent;

/**
 * Internal tracking record for an entity lifecycle observer (`useEntityLifecycle`).
 */
export interface ObserverData {
  /** Live Factorio entity reference. */
  entity: LuaEntity;
  /** Entity unit number if supported. */
  unit_number?: UnitNumber;
  /** Surface index where the entity was placed. */
  surface_index: SurfaceIndex;
  /** Map coordinates of the entity. */
  position: MapPosition;
  /** Lifecycle callbacks to trigger on death/mining/revival. */
  callbacks: EntityLifecycleCallbacks;
}

/**
 * Internal descriptor for a deferred side-effect queued during component render.
 */
export interface PendingEffect {
  /** Unique ID of the component Fiber node. */
  fiberId: FiberId;
  /** Sequential hook slot index within the component. */
  hookIndex: number;
  /** Side-effect callback to execute in the commit phase. */
  effect: EffectCallback;
}

/**
 * Internal state tracking an active debounced task in the scheduler.
 */
export interface DebounceState {
  /** Scheduler task ID if a timeout is currently pending. */
  taskId?: number;
  /** Target game tick when callback should be executed. */
  targetTick?: number;
  /** Current callback closure to execute upon timer expiry. */
  callback: (this: void, ...args: any[]) => void;
}

// ============================================================================
// 6. REACT JSX PROPS & GLOBALS (JSX Props Assembly & Global Declarations)
// ============================================================================

/** Lifecycle and reference props accepted by all native GUI elements. */
interface ReactLifecycleProps<T extends GuiElementType = GuiElementType> {
  /** Ref callback or mutable ref object to capture the live C++ `LuaGuiElement`. */
  ref?: Ref<GuiElementFor<T>>;
}

/** Internal React props shared across all native element wrappers. */
interface ReactInternalProps<E extends GuiElementType = GuiElementType> extends ReactLifecycleProps<E> {
  /** Child JSX elements. */
  children?: ReactNode | ReactNode[];
  /** Custom style overrides passed as an object (e.g. `{ width: 100, font: "default-bold" }`). */
  styles?: StylesFor<E>;
  /** Prototype style name defined in Factorio prototypes (e.g. `"frame"`, `"subheader_frame"`). */
  style?: StyleFor<E>;
}

/**
 * Combined props for a native Factorio element `T`:
 * 1. Native Factorio element properties (`NativePropsFor`)
 * 2. React internal props (`children`, `styles`, `style`, `ref`)
 * 3. Strictly typed event handlers (`EventHandlersFor`)
 */
export type PrimitiveProps<T extends GuiElementType = GuiElementType> = NativePropsFor<T> & ReactInternalProps<T> & EventHandlersFor<T>;

declare global {
  namespace JSX {
    /** Attributes available on all JSX elements. */
    interface IntrinsicAttributes {
      /** Key used by React reconciler to distinguish items in arrays. */
      key?: Key;
    }
    /**
     * IntrinsicElements is restricted to prevent writing lowercase tags (<button>, <textfield>).
     * All UI elements must be authored using Capitalized React components (<Button>, <Input>, <HFlow>).
     */
    type IntrinsicElements = Record<string, never>;
    /** Return type of JSX expressions. */
    type Element = any;
    /** Defines the property name used for child elements in JSX. */
    interface ElementChildrenAttribute {
      children: {};
    }
  }

  /**
   * Factory function that creates a virtual `ReactElement` descriptor.
   * Invoked automatically by TypeScript JSX translation.
   */
  function createElement<P extends Props = Props>(type: ElementType<P>, props?: P, ...children: ReactNode[]): ReactElement<P>;
}
