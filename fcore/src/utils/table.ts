/**
 * Returns true if the table has no keys/entries (checked in O(1) via `next`).
 *
 * @param t Table to check
 */
export function isTableEmpty(t: any): boolean {
  if (t === undefined) return true;
  const [k] = next(t);
  return k === undefined;
}

/**
 * Returns true if the table contains at least one key/entry (checked in O(1) via `next`).
 *
 * @param t Table to check
 */
export function hasTableEntries(t: any): boolean {
  if (t === undefined) return false;
  const [k] = next(t);
  return k !== undefined;
}

/**
 * Counts the total number of entries in a hash map / dictionary table using `pairs`.
 *
 * @param t Table to count
 */
export function tableSize(t: any): number {
  if (t === undefined) return 0;
  let count = 0;
  for (const [k] of pairs(t)) {
    count++;
  }
  return count;
}

/**
 * Recursively checks deep equality between two values of any type.
 * Supports primitives, nested dictionaries, arrays, and undefined values.
 *
 * @param a First value to compare
 * @param b Second value to compare
 * @returns True if both values are structurally equal
 */
export function areObjectsEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined) return false;
  if (typeof a !== "object" || typeof b !== "object") return a === b;

  const aObj = a as Record<string | number, unknown>;
  const bObj = b as Record<string | number, unknown>;

  for (const [k, v] of pairs(bObj)) {
    if (!areObjectsEqual(aObj[k], v)) return false;
  }
  for (const [k, _] of pairs(aObj)) {
    if (bObj[k] === undefined) return false;
  }
  return true;
}
