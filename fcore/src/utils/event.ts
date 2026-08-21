import type {
  LocalisedString,
  ConfigurationChangedData,
  OnObjectDestroyedEvent,
  NthTickEventData,
  LuaEventType,
  EventTypeOf,
  EventId,
  SurfaceIdentification,
  RegistrationNumber,
  EventFilter,
  LuaEntity,
  PlayerIndex,
  UnitNumber,
  OnBuiltEntityEvent,
  OnRobotBuiltEntityEvent,
  OnSpacePlatformBuiltEntityEvent,
  ScriptRaisedBuiltEvent,
  ScriptRaisedReviveEvent,
  OnEntityDiedEvent,
  OnPlayerMinedEntityEvent,
  OnRobotMinedEntityEvent,
  OnSpacePlatformMinedEntityEvent,
  ScriptRaisedDestroyEvent,
} from "factorio:runtime";
import { isTableEmpty, hasTableEntries } from "./table";

/**
 * Universal event identifier type (defines.events, EventId, string, or number for nth_tick/custom IDs).
 */
export type EventName = LuaEventType | number | string;

/**
 * Valid key for indexing event tables (primitive string or number).
 */
export type EventKey = string | number;

/**
 * Unique sequential ID assigned to persistent dynamic event bindings.
 */
export type EventBindingId = number;

export type EventStorage = Record<EventKey, Record<EventBindingId, [event_name: EventName, handler_name: string, handler_data?: any, extra?: unknown] | undefined> | undefined>;

/**
 * Structure of `storage._event_subtick` for persistent storage of subtick microtasks.
 */
export type EventSubtickStorage = Record<RegistrationNumber, [event_name: string, handler_name: string, handler_data?: unknown] | undefined>;

/**
 * Special marker symbol. When returned by a dynamic handler, the library
 * automatically removes this dynamic binding from `storage._event`.
 */
export const REMOVE_BINDING: unique symbol = Symbol("REMOVE_BINDING");

/**
 * Handler function signature for dynamic events registered via `register_dynamic_handler`.
 * Returning {@link REMOVE_BINDING} automatically unbinds the dynamic listener.
 */
export type EventDynamicHandler<TData = unknown, TArgs extends unknown[] = unknown[]> = (
  this: void,
  event_name: EventName,
  handler_data: TData,
  ...args: TArgs
) => typeof REMOVE_BINDING | void | unknown;

/**
 * Data passed to the `"on_startup"` mod lifecycle event.
 */
export interface ResetData {
  /** True if the game was newly initialized (`on_init`). */
  init: boolean;
  /** True during configuration change handoff. */
  handoff?: boolean;
  /** Array of localized strings with reasons vetoing shutdown. */
  veto_shutdown?: LocalisedString[];
  /** Startup warnings. */
  startup_warnings?: LocalisedString[];
}

/** Set of reserved core script lifecycle event names. */
const script_event_set: Record<string, boolean> = {
  on_init: true,
  on_load: true,
  on_configuration_changed: true,
  on_nth_tick: true,
  on_startup: true,
  on_shutdown: true,
  on_try_shutdown: true,
};

/** Static event handler registry in volatile memory (RAM). */
const static_handlers: Record<string | number, Array<(this: void, ...args: any[]) => void> | undefined> = {};

/** Registered dynamic handler functions in volatile memory (RAM). */
const registered_dynamic_handlers: Record<string, EventDynamicHandler<any, any[]> | undefined> = {};

/** Set of game events already bound in the Factorio C++ engine. */
const bound_game_events: Record<number, boolean | undefined> = {};

/**
 * Adds a static handler to the RAM registry.
 *
 * @param key Event identifier (string or number).
 * @param handler Callback function.
 * @param first If true, unshifts handler to the beginning of the list.
 */
function add_static_handler(key: string | number, handler: (this: void, ...args: any[]) => void, first?: boolean) {
  let handlers = static_handlers[key];
  if (!handlers) {
    handlers = [];
    static_handlers[key] = handlers;
  }
  if (first) {
    handlers.unshift(handler);
  } else {
    handlers.push(handler);
  }
}

/**
 * Creates a dispatcher function executing all static handlers for a core lifecycle event.
 */
function meta_run_static_handlers(key: string) {
  let handlers = static_handlers[key];
  if (!handlers) {
    handlers = [];
    static_handlers[key] = handlers;
  }
  return (...args: any[]) => {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i](...args);
    }
  };
}

if (typeof script !== "undefined" && script !== undefined) {
  script.on_init(meta_run_static_handlers("on_init"));
  script.on_load(meta_run_static_handlers("on_load"));
  script.on_configuration_changed(meta_run_static_handlers("on_configuration_changed"));
}

/**
 * Creates a combined callback for the Factorio engine that:
 * 1. Executes all static handlers from RAM.
 * 2. Executes all dynamic handlers from `storage._event`.
 * 3. Removes bindings that returned `REMOVE_BINDING`.
 */
function make_event_callback(event_name: string | number, handlers: Array<(this: void, ...args: any[]) => void>) {
  return (...args: any[]) => {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i](...args);
    }
    const dynamic_handlers = storage._event ? storage._event[event_name] : undefined;
    if (dynamic_handlers) {
      let was_removed = false;
      for (const [binding_id, binding] of pairs(dynamic_handlers)) {
        const handler = registered_dynamic_handlers[binding[1]];
        if (handler) {
          const result = handler(binding[0], binding[2], ...args);
          if (result === REMOVE_BINDING) {
            dynamic_handlers[binding_id] = undefined;
            was_removed = true;
          }
        }
      }
      if (was_removed) {
        if (isTableEmpty(dynamic_handlers)) {
          storage._event![event_name] = undefined;
        }
      }
    }
  };
}

/**
 * Registers a game event in the Factorio C++ engine via `script.on_event` or `script.on_nth_tick`.
 */
function bind_game_event(event_name: number, filters?: unknown) {
  if (bound_game_events[event_name]) return;
  bound_game_events[event_name] = true;
  let handlers = static_handlers[event_name];
  if (!handlers) {
    handlers = [];
    static_handlers[event_name] = handlers;
  }
  if (event_name < 0) {
    script.on_nth_tick(-event_name, make_event_callback(event_name, handlers) as (this: void, e: NthTickEventData) => void);
  } else if (filters !== undefined) {
    script.on_event(event_name as EventId<any, any>, make_event_callback(event_name, handlers) as (this: void, e: any) => void, filters as EventFilter[]);
  } else {
    script.on_event(event_name as EventId<any>, make_event_callback(event_name, handlers) as (this: void, e: any) => void);
  }
}

/**
 * Initializes the static handler array for a custom string event.
 */
function bind_user_event(user_event_name: string) {
  let handlers = static_handlers[user_event_name];
  if (!handlers) {
    handlers = [];
    static_handlers[user_event_name] = handlers;
  }
  return handlers;
}

/**
 * Internal helper to bind an event of any type (game event or custom string event).
 */
function bind_any_event(event_name: EventName, filters?: unknown): EventKey {
  if (typeof event_name === "number") {
    bind_game_event(event_name, filters);
    return event_name;
  } else if (typeof event_name === "string") {
    if (script_event_set[event_name]) {
      error("cannot bind to core script event with bind_any_event: " + event_name);
    }
    bind_user_event(event_name);
    return event_name;
  } else {
    error("invalid event name: " + tostring(event_name));
  }
}

/**
 * Conditional type resolver: determines the expected callback signature based on event `E`.
 *
 * - `"on_init"` | `"on_load"` ➔ `() => void`
 * - `"on_configuration_changed"` ➔ `(data: ConfigurationChangedData) => void`
 * - `"on_startup"` ➔ `(data: ResetData) => void`
 * - `EventId<TData>` ➔ `(event: TData) => void`
 * - `number` (nth_tick) ➔ `(event: NthTickEventData) => void`
 * - `LuaEventType` ➔ `(event: EventTypeOf<E>) => void`
 * - `string` (custom) ➔ `(...args: any[]) => void`
 */
export type EventHandlerFor<E extends EventName> = E extends "on_init" | "on_load"
  ? (this: void) => void
  : E extends "on_configuration_changed"
    ? (this: void, data: ConfigurationChangedData) => void
    : E extends "on_startup"
      ? (this: void, data: ResetData) => void
      : E extends EventId<infer TData, any>
        ? (this: void, event: TData) => void
        : E extends number
          ? (this: void, event: NthTickEventData) => void
          : E extends LuaEventType
            ? (this: void, event: EventTypeOf<E>) => void
            : (this: void, ...args: any[]) => void;

/**
 * Conditional type resolver: extracts valid filter array type for game event `E`.
 */
export type EventFiltersFor<E extends EventName> = E extends EventId<any, infer TFilter> ? TFilter[] : unknown;

/**
 * Universal static event subscription function (Event Bus).
 *
 * Supports:
 * - Factorio game events (`defines.events.*`).
 * - Core script lifecycle events (`"on_init"`, `"on_load"`, `"on_configuration_changed"`).
 * - Periodic tick intervals (`nth_tick(60)`).
 * - Custom mod string events (`"my_custom_event"`).
 *
 * Unlike native `script.on_event`, allows registering **multiple independent handlers**
 * on the same event without overwriting previous listeners.
 *
 * @param event_name Name or ID of the event.
 * @param handler Callback function with automatically inferred argument types.
 * @param first If true, unshifts handler to the front of the queue.
 * @param filters Optional Factorio engine event filters.
 *
 * @example
 * ```ts
 * // Listen for GUI clicks with inferred `e: OnGuiClickEvent`
 * bind(defines.events.on_gui_click, (e) => {
 *   log(e.element.name);
 * });
 *
 * // Listen for mod initialization
 * bind("on_init", () => {
 *   storage.my_data = {};
 * });
 *
 * // Listen every 60 ticks (1 second)
 * bind(nth_tick(60), (tickData) => {
 *   game.print(`Tick: ${tickData.tick}`);
 * });
 * ```
 */
export function bind<E extends EventName>(event_name: E, handler: EventHandlerFor<E>, first?: boolean, filters?: EventFiltersFor<E>) {
  if (typeof event_name === "number") {
    add_static_handler(event_name, handler as (this: void, ...args: any[]) => void, first);
    bind_game_event(event_name, filters);
  } else if (typeof event_name === "string") {
    if (script_event_set[event_name]) {
      add_static_handler(event_name, handler as (this: void, ...args: any[]) => void, first);
    } else {
      add_static_handler(event_name, handler as (this: void, ...args: any[]) => void, first);
      bind_user_event(event_name);
    }
  } else {
    error("invalid event name: " + tostring(event_name));
  }
}

/**
 * Removes all static handlers for the given event and unbinds it from the Factorio engine.
 *
 * @param event_name Name or ID of the event to unbind.
 */
export function unbind_all(event_name: EventName) {
  static_handlers[event_name as string | number] = undefined;
  if (typeof event_name === "number") {
    if (event_name < 0) {
      script.on_nth_tick(-event_name, undefined);
    } else {
      script.on_event(event_name as EventId<any>, undefined);
    }
    bound_game_events[event_name] = undefined;
  }
}

/**
 * Raises a custom mod event, dispatching arguments to all static and dynamic listeners.
 *
 * @param user_event_name Custom event name.
 * @param args Arguments passed to handler functions.
 */
export function raise(user_event_name: string, ...args: unknown[]) {
  const handlers = static_handlers[user_event_name];
  if (handlers !== undefined) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i](...args);
    }
  }
  const dynamic_handlers = storage._event ? storage._event[user_event_name] : undefined;
  if (dynamic_handlers) {
    let was_removed = false;
    for (const [binding_id, binding] of pairs(dynamic_handlers)) {
      const handler = registered_dynamic_handlers[binding[1]];
      if (handler) {
        const result = handler(binding[0], binding[2], ...args);
        if (result === REMOVE_BINDING) {
          dynamic_handlers[binding_id] = undefined;
          was_removed = true;
        }
      }
    }
    if (was_removed) {
      if (isTableEmpty(dynamic_handlers)) {
        storage._event![user_event_name] = undefined;
      }
    }
  }
}

/**
 * Converts a positive tick interval `n` into a negative number `-n` used as an nth-tick event marker.
 *
 * @param n Positive integer tick interval (e.g. 60 for 1 second).
 * @returns Negative number ID.
 */
export function nth_tick(n: number): number {
  if (typeof n !== "number" || n <= 0 || n % 1 !== 0) {
    error("tick interval must be a positive integer");
  }
  return -n;
}

/**
 * Creates a dynamic event binding persisted across savegames in `storage._event`.
 *
 * @template TData Serializable state data type.
 * @param event_names One or more event names to subscribe to.
 * @param handler_name Name of the handler registered via `register_dynamic_handler`.
 * @param handler_data Optional serializable state data passed to the callback.
 * @returns Unique `EventDynamicBindingId`.
 */
export function dynamic_bind<TData = unknown>(event_names: EventName | readonly EventName[], handler_name: string, handler_data?: TData): EventBindingId {
  if (!registered_dynamic_handlers[handler_name]) {
    error("unknown dynamic handler: " + handler_name);
  }

  const id = (((storage._event_id as number) || 0) + 1) as EventBindingId;
  storage._event_id = id;

  const names = Array.isArray(event_names) ? event_names : [event_names];
  for (let i = 0; i < names.length; i++) {
    const event_name = names[i];
    if (typeof event_name === "string" && script_event_set[event_name]) {
      error("cannot dynamically bind to core script event: " + event_name);
    }
    const key = bind_any_event(event_name);
    if (!storage._event) storage._event = {};
    if (!storage._event[key]) storage._event[key] = {};
    storage._event[key]![id] = [event_name, handler_name, handler_data];
  }

  return id;
}

/**
 * Unbinds and removes a dynamic event binding from `storage._event` by its ID.
 *
 * @param binding_id Binding ID returned by `dynamic_bind`.
 * @returns True if the binding existed and was removed.
 */
export function dynamic_unbind(binding_id: EventBindingId): boolean {
  if (!storage._event) return false;
  for (const [event_name, ev] of pairs(storage._event)) {
    if (ev && ev[binding_id]) {
      ev[binding_id] = undefined;
      if (isTableEmpty(ev)) {
        storage._event[event_name] = undefined;
      }
      return true;
    }
  }
  return false;
}

/**
 * Registers a dynamic handler function in volatile memory (RAM).
 *
 * Functions cannot be saved in `storage`, so only the string identifier is stored
 * in savegames, and the actual implementation is registered during mod loading.
 *
 * Returning {@link REMOVE_BINDING} automatically removes the binding.
 *
 * @template TData User state data type.
 * @template TArgs Additional event argument types.
 * @param handler_name Unique string name.
 * @param handler Callback function.
 */
export function register_dynamic_handler<TData = unknown, TArgs extends unknown[] = unknown[]>(handler_name: string, handler: EventDynamicHandler<TData, TArgs>) {
  if (registered_dynamic_handlers[handler_name]) {
    error("duplicate dynamic handler registration: " + handler_name);
  }
  registered_dynamic_handlers[handler_name] = handler;
}

/** Parameters for invisible rendering object used in subtick microtask triggering. */
const INVISIBLE_LINE: Parameters<typeof rendering.draw_line>[0] = {
  color: [0, 0, 0, 0],
  width: 0,
  from: [0, 0],
  to: [0, 0],
  surface: 1 as unknown as SurfaceIdentification,
};

/**
 * Schedules a deferred subtick microtask to execute at the end of the current game tick.
 *
 * @template TData Serializable state data type.
 * @param handler_name Dynamic handler name.
 * @param event_name Identifier for the task.
 * @param handler_data Optional data passed to the callback.
 */
export function dynamic_subtick_trigger<TData = unknown>(handler_name: string, event_name: string, handler_data?: TData) {
  const obj = rendering.draw_line(INVISIBLE_LINE);
  const [rn] = script.register_on_object_destroyed(obj);
  if (!storage._event_subtick) storage._event_subtick = {};
  storage._event_subtick[rn as unknown as RegistrationNumber] = [event_name, handler_name, handler_data];
  obj.destroy();
}

if (typeof script !== "undefined" && script !== undefined && typeof defines !== "undefined" && defines && defines.events) {
  /** Internal global listener for object destruction to execute subtick microtasks. */
  bind(defines.events.on_object_destroyed, (ev: OnObjectDestroyedEvent) => {
    const rn = ev.registration_number;
    const subticks = storage._event_subtick;
    if (!subticks) return;
    const binding = subticks[rn];
    if (!binding) return;

    subticks[rn] = undefined;
    const handler = registered_dynamic_handlers[binding[1]];
    if (handler) {
      handler(binding[0], binding[2]);
    }
  });

  /** Internal `on_init` listener: raises `"on_startup"`. */
  bind(
    "on_init",
    () => {
      raise("on_startup", { init: true, startup_warnings: [] });
    },
    true,
  );

  /** Internal `"on_startup"` listener: prepares `storage._event` data structures. */
  bind("on_startup", () => {
    if (storage._event && hasTableEntries(storage._event)) {
      log("WARNING: dynamic event bindings exist at startup. You should clear dynamic bindings during shutdown to avoid lingering state.");
    }
    if (storage._event_subtick && hasTableEntries(storage._event_subtick)) {
      log("ERROR: subtick event bindings exist at startup, this should be impossible.");
    }

    storage._event = {};
    storage._event_subtick = {};
    storage._event_id = 0;
  });

  /** Internal `on_load` listener: re-binds engine events for persistent dynamic bindings. */
  bind("on_load", () => {
    if (!storage._event) return;
    for (const [event_name] of pairs(storage._event)) {
      bind_any_event(event_name as EventName);
    }
  });
}

// =============================================================================
// Unified Entity Lifecycle Helpers
// =============================================================================

export type EntityNameFilter = string | readonly string[];

export interface EntityCreatedEventPayload {
  entity: LuaEntity;
  playerIndex?: PlayerIndex;
  tags?: Record<string, any>;
  robot?: LuaEntity;
  revived: boolean;
  event: OnBuiltEntityEvent | OnRobotBuiltEntityEvent | OnSpacePlatformBuiltEntityEvent | ScriptRaisedBuiltEvent | ScriptRaisedReviveEvent;
}

export type EntityCreatedCallback = (this: void, payload: EntityCreatedEventPayload) => void;

export interface EntityDestroyedEventPayload {
  entity?: LuaEntity;
  unitNumber?: UnitNumber;
  playerIndex?: PlayerIndex;
  robot?: LuaEntity;
  cause?: LuaEntity;
  event: OnEntityDiedEvent | OnPlayerMinedEntityEvent | OnRobotMinedEntityEvent | OnSpacePlatformMinedEntityEvent | ScriptRaisedDestroyEvent;
}

export type EntityDestroyedCallback = (this: void, payload: EntityDestroyedEventPayload) => void;

function matchesEntityFilter(name: string, filter?: EntityNameFilter): boolean {
  if (filter === undefined) return true;
  if (typeof filter === "string") return name === filter;
  for (const item of filter) {
    if (item === name) return true;
  }
  return false;
}

/**
 * Universal entity creation listener.
 * Automatically handles player placement, robot construction, blueprint revival,
 * Space Age orbital construction, and script-raised builds with entity name filtering.
 *
 * @param filter Single entity prototype name, array of names, or undefined for all entities.
 * @param callback Unified callback receiving normalized payload (`entity`, `playerIndex`, `tags`, `robot`, `revived`).
 */
export function onEntityCreated(filter: EntityNameFilter | undefined, callback: EntityCreatedCallback) {
  const handler = (ev: OnBuiltEntityEvent | OnRobotBuiltEntityEvent | OnSpacePlatformBuiltEntityEvent | ScriptRaisedBuiltEvent | ScriptRaisedReviveEvent) => {
    const entity = ev.entity;
    if (!entity || !entity.valid || !matchesEntityFilter(entity.name, filter)) return;

    const playerIndex = "player_index" in ev ? (ev.player_index as PlayerIndex | undefined) : undefined;
    const tags = "tags" in ev ? (ev.tags as Record<string, any> | undefined) : undefined;
    const robot = "robot" in ev ? ev.robot : undefined;
    const revived = ev.name === defines.events.script_raised_revive;

    callback({ entity, playerIndex, tags, robot, revived, event: ev });
  };

  bind(defines.events.on_built_entity, handler);
  bind(defines.events.on_robot_built_entity, handler);
  bind(defines.events.script_raised_built, handler);
  bind(defines.events.script_raised_revive, handler);
  if (defines.events.on_space_platform_built_entity !== undefined) {
    bind(defines.events.on_space_platform_built_entity, handler);
  }
}

/**
 * Universal entity destruction listener.
 * Automatically handles player mining, robot deconstruction, entity death (biters/explosions),
 * Space Age platform destruction, and script-raised destructions.
 *
 * @param filter Single entity prototype name, array of names, or undefined for all entities.
 * @param callback Unified callback receiving normalized payload (`entity`, `unitNumber`, `playerIndex`, `robot`, `cause`).
 */
export function onEntityDestroyed(filter: EntityNameFilter | undefined, callback: EntityDestroyedCallback) {
  const handler = (ev: OnEntityDiedEvent | OnPlayerMinedEntityEvent | OnRobotMinedEntityEvent | OnSpacePlatformMinedEntityEvent | ScriptRaisedDestroyEvent) => {
    const entity = ev.entity;
    if (entity && entity.valid) {
      if (!matchesEntityFilter(entity.name, filter)) return;
    }

    const unitNumber = entity?.unit_number ?? ("unit_number" in ev ? (ev.unit_number as UnitNumber | undefined) : undefined);
    const playerIndex = "player_index" in ev ? (ev.player_index as PlayerIndex | undefined) : undefined;
    const robot = "robot" in ev ? ev.robot : undefined;
    const cause = "cause" in ev ? ev.cause : undefined;

    callback({ entity, unitNumber, playerIndex, robot, cause, event: ev });
  };

  bind(defines.events.on_entity_died, handler);
  bind(defines.events.on_player_mined_entity, handler);
  bind(defines.events.on_robot_mined_entity, handler);
  bind(defines.events.script_raised_destroy, handler);
  if (defines.events.on_space_platform_mined_entity !== undefined) {
    bind(defines.events.on_space_platform_mined_entity, handler);
  }
}
