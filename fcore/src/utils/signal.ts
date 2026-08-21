import type { SignalIDWrite, SignalIDType, QualityID, LuaQualityPrototype, SignalID as RuntimeSignalID } from "factorio:runtime";

export type SignalKey = string;
export type SignalCounts = Record<SignalKey, number>;
export type SignalID = SignalIDWrite | RuntimeSignalID;

/**
 * Extracts quality string name from a QualityID, LuaQualityPrototype, or plain string.
 */
export function getQualityName(quality?: QualityID | LuaQualityPrototype | string | { name?: string }): string | undefined {
  if (quality === undefined) return undefined;
  if (typeof quality === "string") return quality;
  return quality.name;
}

const _isParameterName: Record<string, boolean> = {};

/**
 * Checks if the signal name is a Factorio 2.0 blueprint parameter (e.g. "parameter-0").
 */
export function isParameterName(name?: string): boolean {
  if (!name) return false;
  const cached = _isParameterName[name];
  if (cached !== undefined) return cached;

  const isParam = string.sub(name, 1, 10) === "parameter-";
  _isParameterName[name] = isParam;
  return isParam;
}

const _signalTypeCache: Record<string, SignalIDType | "nil"> = {};

/**
 * Resolves the SignalIDType ("item", "fluid", "virtual", "quality", etc.) from prototype registries.
 */
export function getSignalTypeFromName(name: string): SignalIDType | undefined {
  const cached = _signalTypeCache[name];
  if (cached !== undefined) {
    return cached === "nil" ? undefined : cached;
  }

  let ty: SignalIDType | "nil" = "nil";
  if (typeof prototypes !== "undefined") {
    if (prototypes.item[name] !== undefined) ty = "item";
    else if (prototypes.fluid[name] !== undefined) ty = "fluid";
    else if (prototypes.virtual_signal[name] !== undefined) ty = "virtual";
    else if (prototypes.quality && prototypes.quality[name] !== undefined) ty = "quality";
    else if (prototypes.entity && prototypes.entity[name] !== undefined) ty = "entity";
    else if (prototypes.recipe && prototypes.recipe[name] !== undefined) ty = "recipe";
    else if (prototypes.space_location && prototypes.space_location[name] !== undefined) ty = "space-location";
    else if (prototypes.asteroid_chunk && prototypes.asteroid_chunk[name] !== undefined) ty = "asteroid-chunk";
  }

  _signalTypeCache[name] = ty;
  return ty === "nil" ? undefined : ty;
}

/**
 * Encodes signal components into a canonical string key (e.g. "iron-plate" or "iron-plate|epic").
 */
export function encodeSignalKey(name: string, _stype?: SignalIDType, quality?: QualityID | string): SignalKey {
  const qName = getQualityName(quality);
  return qName === undefined || qName === "normal" ? name : `${name}|${qName}`;
}

const _keyToSig: Record<SignalKey, SignalIDWrite> = {};

/**
 * Converts a SignalID into a unique string key.
 */
export function signalToKey(signal: SignalID): SignalKey {
  const qName = getQualityName(signal.quality);
  const name = (signal.name as string) || "";
  const key = qName === undefined || qName === "normal" ? name : `${name}|${qName}`;

  if (_keyToSig[key] === undefined) {
    _keyToSig[key] = {
      name: signal.name,
      type: signal.type,
      quality: qName as QualityID,
    };
  }

  return key;
}

/**
 * Parses a canonical string key back into a structured SignalID.
 */
export function keyToSignal(key?: SignalKey): SignalIDWrite | undefined {
  if (!key) return undefined;
  const cached = _keyToSig[key];
  if (cached !== undefined) return cached;

  const [pipeIndex] = string.find(key, "|");
  let name: string;
  let quality: string | undefined;

  if (pipeIndex !== undefined) {
    name = string.sub(key, 1, pipeIndex - 1);
    quality = string.sub(key, pipeIndex + 1);
  } else {
    name = key;
  }

  const ty = getSignalTypeFromName(name);
  if (ty === undefined) return undefined;

  const signal: SignalIDWrite = {
    name,
    type: ty,
    quality: quality as QualityID,
  };

  _keyToSig[key] = signal;
  return signal;
}
