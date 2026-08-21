import type { PlayerIndex, GuiLocation, RegistrationNumber } from "factorio:runtime";
import type { ReactRootData, RootId, FiberId } from "./react/types";
import type { EventBindingId, EventStorage, EventSubtickStorage } from "./utils/event";
import type { SchedulerStorage } from "./utils/scheduler";

/**
 * Common persistent storage schema utilized by `flib` core modules (React, Event Bus, Scheduler).
 */
export interface CoreStorage {
  reactNextFiberId?: FiberId;
  reactRoots?: Record<RootId, ReactRootData | undefined>;
  reactDeferredRn?: RegistrationNumber;
  reactWindowPositions?: Record<PlayerIndex, Record<string, GuiLocation | undefined> | undefined>;
  reactWindowPinned?: Record<PlayerIndex, Record<string, boolean | undefined> | undefined>;
  _event?: EventStorage;
  _event_id?: EventBindingId;
  _event_subtick?: EventSubtickStorage;
  _sched?: SchedulerStorage;
  [key: string]: any;
}
