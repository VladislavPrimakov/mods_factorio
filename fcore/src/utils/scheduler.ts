import type { NthTickEventData } from "factorio:runtime";
import { bind, nth_tick } from "./event";
import { strace } from "./strace";

export const ABORT = Symbol("ABORT");

export type TaskId = number;
export type Tick = number;

export interface Task<D = unknown> {
  id: TaskId;
  type: "once" | "many";
  handler_name: string;
  data?: D;
}

export interface OneOffTask<D = unknown> extends Task<D> {
  type: "once";
  at: Tick;
}

export interface RecurringTask<D = unknown> extends Task<D> {
  type: "many";
  period: Tick;
  next: Tick;
}

export interface SchedulerStorage {
  tasks: Record<TaskId, Task<any> | undefined>;
  at: Record<Tick, Record<TaskId, boolean | undefined> | undefined>;
  next_id: TaskId;
}

const handlers: Record<string, ((this: void, task: Task<any>) => any) | undefined> = {};

export function register_handler<D = unknown>(name: string, handler: (this: void, task: Task<D>) => any) {
  handlers[name] = handler as (this: void, task: Task<any>) => any;
}

import { hasTableEntries } from "./table";

export function get_sched_storage(): SchedulerStorage {
  if (storage._sched === undefined) {
    storage._sched = {
      tasks: {},
      at: {},
      next_id: 0,
    };
  }
  return storage._sched;
}

bind("on_startup", (reset_data: any) => {
  strace.info("Scheduler: resetting state");
  if (storage._sched && storage._sched.at && hasTableEntries(storage._sched.at)) {
    strace.warn(`Scheduler: outstanding tasks from previous state will NOT be processed.`);
  }
  storage._sched = {
    tasks: {},
    at: {},
    next_id: 0,
  };
});

function do_at(tick: Tick, task_id: TaskId) {
  const state = get_sched_storage();
  let task_set = state.at[tick];
  if (task_set === undefined) {
    task_set = {};
    state.at[tick] = task_set;
  }
  task_set[task_id] = true;
}

bind(nth_tick(1), (tick_data: NthTickEventData) => {
  const state = storage._sched;
  if (state === undefined) return;
  const tick_n = tick_data.tick;
  const task_set = state.at[tick_n];
  if (task_set !== undefined) {
    for (const k in task_set) {
      const task_id = k as unknown as TaskId;
      const task = state.tasks[task_id];
      if (task !== undefined) {
        const handler = handlers[task.handler_name];
        let handler_result: any = undefined;
        if (handler !== undefined) {
          handler_result = handler(task);
        } else {
          strace.error("scheduler", "missing_handler", "handler_name", task.handler_name);
          handler_result = ABORT;
        }

        if (handler_result === ABORT) {
          state.tasks[task_id] = undefined;
        }

        if (task.type === "once") {
          state.tasks[task_id] = undefined;
        } else if (task.type === "many") {
          const rtask = task as RecurringTask;
          rtask.next = tick_n + rtask.period;
          do_at(rtask.next, task_id);
        }
      }
    }
    state.at[tick_n] = undefined;
  }
});

function create_at<D>(tick: Tick, handler_name: string, data?: D): TaskId {
  const state = get_sched_storage();
  const task_id = (state.next_id || 0) + 1;
  state.next_id = task_id;
  const task: OneOffTask<D> = {
    id: task_id,
    type: "once",
    handler_name: handler_name,
    data: data,
    at: tick,
  };
  state.tasks[task_id] = task;
  do_at(tick, task_id);
  strace.traceLazy("scheduler", "create_once", () => ["task", task]);
  return task_id;
}

function create_every<D>(first_tick: Tick, period: Tick, handler_name: string, data?: D): TaskId {
  const state = get_sched_storage();
  const task_id = (state.next_id || 0) + 1;
  state.next_id = task_id;
  const task: RecurringTask<D> = {
    id: task_id,
    type: "many",
    handler_name: handler_name,
    data: data,
    period: period,
    next: first_tick,
  };
  state.tasks[task_id] = task;
  do_at(first_tick, task_id);
  strace.traceLazy("scheduler", "create_recurring", () => ["task", task]);
  return task_id;
}

export function at<D = unknown>(tick: Tick, handler_name: string, data?: D): TaskId | undefined {
  if (game && tick <= game.tick) {
    strace.warn("scheduler", "past", "message", "attempted to schedule task in the past");
    return undefined;
  }
  if (!handlers[handler_name]) {
    strace.error("scheduler", "missing_handler", "handler_name", handler_name);
    return undefined;
  }
  return create_at(tick, handler_name, data);
}

export function after<D = unknown>(ticks: Tick, handler_name: string, data?: D): TaskId | undefined {
  if (ticks < 1) {
    strace.warn("scheduler", "past", "message", "attempted to schedule task in the past");
    return undefined;
  }
  return at(game.tick + ticks, handler_name, data);
}

export function every<D = unknown>(period: Tick, handler_name: string, data?: D, skew?: Tick): TaskId | undefined {
  if (!handlers[handler_name]) {
    strace.error("scheduler", "missing_handler", "handler_name", handler_name);
    return undefined;
  }
  const first_tick = game.tick + 1 + ((skew || 0) % period);
  return create_every(first_tick, period, handler_name, data);
}

export function get<D = unknown>(task_id: TaskId): Task<D> | undefined {
  const state = storage._sched;
  if (!state) return undefined;
  return state.tasks[task_id] as Task<D> | undefined;
}

export function set_period(task_id: TaskId, period: Tick) {
  const task = get(task_id) as RecurringTask;
  if (!task || task.type !== "many") return;
  task.period = period;
}

export function stop(task_id?: TaskId): boolean {
  if (task_id === undefined) return false;
  const state = storage._sched;
  if (!state) return false;
  const task = state.tasks[task_id];
  if (!task) return false;
  state.tasks[task_id] = undefined;
  return true;
}

register_handler<any[]>("@call_method", (task) => {
  const data = task.data;
  if (!data) return ABORT;
  const obj = data[0];
  const method_name = data[1];
  if (obj) {
    const callable = obj[method_name];
    if (typeof callable === "function") {
      callable.call(obj, ...data.slice(2));
      return;
    }
  }
  return ABORT;
});

register_handler<any[]>("@call_global", (task) => {
  const data = task.data;
  if (!data) return ABORT;
  const func_path = data[0];
  let func: any = _G;
  for (let i = 0; i < func_path.length; i++) {
    func = func[func_path[i]];
    if (!func) return ABORT;
  }
  if (typeof func === "function") {
    func(...data.slice(1));
    return;
  }
  return ABORT;
});

export function at_method(tick: number, serializable_object: any, method_name: string, ...args: any[]) {
  return at(tick, "@call_method", [serializable_object, method_name, ...args]);
}

export const call_method_at = at_method;

export function call_global_at(tick: number, func_path: string[], ...args: any[]) {
  return at(tick, "@call_global", [func_path, ...args]);
}
