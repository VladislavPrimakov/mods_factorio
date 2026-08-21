export type LogLevel = "TRACE" | "DEBUG" | "INFO" | "STATS" | "WARN" | "ERROR" | "NONE";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  STATS: 3,
  WARN: 4,
  ERROR: 5,
  NONE: 6,
};

let currentLogLevel: LogLevel = "WARN";
let customHandler: ((this: void, level: LogLevel, ...args: any[]) => void) | undefined = undefined;

function formatTickRelative(tick: number, refTick: number = 0): string {
  const diff = tick - refTick;
  const s = diff / 60;
  return string.format("+%.2fs", s);
}

function stringify(val: any): string {
  const valType = type(val);
  if (valType === "nil" || valType === "number" || valType === "string" || valType === "boolean") {
    return tostring(val);
  } else if (valType === "function") {
    return "(function)";
  } else {
    return serpent.line(val, { maxlevel: 3, maxnum: 20, nocode: true });
  }
}

function formatLogMessage(level: LogLevel, ...args: any[]): string {
  let frame = 0;
  if (typeof game !== "undefined" && game) frame = game.ticks_played;
  const modName = typeof script !== "undefined" && script ? script.mod_name : "(shared VM)";
  const parts: string[] = ["[", modName, "::", frame.toString(), formatTickRelative(frame, 0), level, "]"];

  if (args.length === 1) {
    // Single plain message
    parts.push(stringify(args[0]));
  } else if (args.length >= 2) {
    // Structured format: args[0] = module/tag, args[1] = action/message, args[2..] = key-value pairs
    parts.push(`[${tostring(args[0])}]`, stringify(args[1]));
    for (let i = 2; i < args.length; i += 2) {
      const key = args[i];
      const val = args[i + 1];
      if (key === "message") {
        for (let j = i + 1; j < args.length; j++) {
          parts.push(stringify(args[j]));
        }
        break;
      } else if (val !== undefined) {
        parts.push(`${tostring(key)}=${stringify(val)}`);
      } else {
        parts.push(stringify(key));
      }
    }
  }

  return parts.join(" ");
}

function logInternal(level: LogLevel, ...args: any[]) {
  const activeLevel = getLevel();
  if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[activeLevel]) return;
  if (customHandler) {
    customHandler(level, ...args);
    return;
  }
  const formatted = formatLogMessage(level, ...args);
  _G.log(formatted);
}

export type LazyLogCallback = (this: void) => any[];

function logLazyInternal(level: LogLevel, a: string | LazyLogCallback, b?: string, c?: LazyLogCallback) {
  const activeLevel = getLevel();
  if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[activeLevel]) return;
  let args: any[];
  if (typeof a === "function") {
    args = a();
  } else if (typeof c === "function") {
    args = [a, b, ...c()];
  } else {
    args = [a, b];
  }
  if (customHandler) {
    customHandler(level, ...args);
    return;
  }
  const formatted = formatLogMessage(level, ...args);
  _G.log(formatted);
}

function setLevel(level: LogLevel) {
  if (LEVEL_PRIORITY[level] !== undefined) {
    currentLogLevel = level;
    _G.log(`[STRACE: ${typeof script !== "undefined" ? script.mod_name : "(mod)"}] Log level set to ${level}`);
  }
}

function getLevel(): LogLevel {
  if (typeof settings !== "undefined" && settings && settings.global) {
    const settingObj = settings.global["fcore-log-level"];
    if (settingObj && typeof settingObj.value === "string") {
      const val = settingObj.value as LogLevel;
      if (LEVEL_PRIORITY[val] !== undefined) {
        return val;
      }
    }
  }
  return currentLogLevel;
}

function setHandler(handler?: (this: void, level: LogLevel, ...args: any[]) => void) {
  customHandler = handler;
}

export interface StraceLogger {
  trace: (this: void, ...args: any[]) => void;
  debug: (this: void, ...args: any[]) => void;
  info: (this: void, ...args: any[]) => void;
  warn: (this: void, ...args: any[]) => void;
  error: (this: void, ...args: any[]) => void;

  traceLazy: (this: void, a: string | LazyLogCallback, b?: string, c?: LazyLogCallback) => void;
  debugLazy: (this: void, a: string | LazyLogCallback, b?: string, c?: LazyLogCallback) => void;
  infoLazy: (this: void, a: string | LazyLogCallback, b?: string, c?: LazyLogCallback) => void;
  warnLazy: (this: void, a: string | LazyLogCallback, b?: string, c?: LazyLogCallback) => void;
  errorLazy: (this: void, a: string | LazyLogCallback, b?: string, c?: LazyLogCallback) => void;

  isTrace: (this: void) => boolean;
  isDebug: (this: void) => boolean;
  isInfo: (this: void) => boolean;
  isLevelEnabled: (this: void, level: LogLevel) => boolean;

  setLevel: (this: void, level: LogLevel) => void;
  getLevel: (this: void) => LogLevel;
  setHandler: (this: void, handler?: (this: void, level: LogLevel, ...args: any[]) => void) => void;
}

/**
 * Unified structured tracing & logging utility.
 */
export const strace: StraceLogger = {
  trace: (...args: any[]) => logInternal("TRACE", ...args),
  debug: (...args: any[]) => logInternal("DEBUG", ...args),
  info: (...args: any[]) => logInternal("INFO", ...args),
  warn: (...args: any[]) => logInternal("WARN", ...args),
  error: (...args: any[]) => logInternal("ERROR", ...args),

  traceLazy: (a: string | LazyLogCallback, b?: string, c?: LazyLogCallback) => logLazyInternal("TRACE", a, b, c),
  debugLazy: (a: string | LazyLogCallback, b?: string, c?: LazyLogCallback) => logLazyInternal("DEBUG", a, b, c),
  infoLazy: (a: string | LazyLogCallback, b?: string, c?: LazyLogCallback) => logLazyInternal("INFO", a, b, c),
  warnLazy: (a: string | LazyLogCallback, b?: string, c?: LazyLogCallback) => logLazyInternal("WARN", a, b, c),
  errorLazy: (a: string | LazyLogCallback, b?: string, c?: LazyLogCallback) => logLazyInternal("ERROR", a, b, c),

  isTrace: () => LEVEL_PRIORITY["TRACE"] >= LEVEL_PRIORITY[getLevel()],
  isDebug: () => LEVEL_PRIORITY["DEBUG"] >= LEVEL_PRIORITY[getLevel()],
  isInfo: () => LEVEL_PRIORITY["INFO"] >= LEVEL_PRIORITY[getLevel()],
  isLevelEnabled: (level: LogLevel) => LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[getLevel()],

  setLevel,
  getLevel,
  setHandler,
};

export default strace;
