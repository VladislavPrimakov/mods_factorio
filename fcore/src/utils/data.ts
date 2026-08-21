import * as util from "util";
import type { AnyPrototype } from "factorio:prototype";
import { strace } from "./strace";

/**
 * Filters out prototype definitions that have arbitrary string index signatures (like GuiStyle or MapGenPresets),
 * leaving ONLY concrete, strongly-typed game prototypes.
 */
export type ConcretePrototype<T> = T extends unknown ? (string extends keyof T ? never : T) : never;

/**
 * Union of all concrete Factorio prototypes (excluding open-ended index tables like GuiStyle).
 */
export type AnyGamePrototype = ConcretePrototype<AnyPrototype>;

/**
 * Deep clones a prototype, assigning a new name and updating references
 * (minable results, place_results, recipe results, etc.).
 */
export function copyPrototype<T extends AnyGamePrototype>(prototype: T, new_name: string, remove_icon?: boolean): T {
  const p = util.table.deepcopy(prototype);
  const origName = prototype.name;
  p.name = new_name;

  if ("minable" in p && p.minable && p.minable.result) {
    p.minable.result = new_name;
  }
  if ("place_result" in p && p.place_result) {
    p.place_result = new_name;
  }

  if ("results" in p && p.results) {
    for (const item of p.results) {
      if (item && typeof item === "object" && "name" in item && item.name === origName) {
        (item as { name: string }).name = new_name;
      }
    }
  }

  if (remove_icon) {
    if ("icon" in p) p.icon = undefined;
    if ("icon_size" in p) p.icon_size = undefined;
    if ("icons" in p) p.icons = undefined;
  }

  return p;
}

/**
 * Safely adds an unlock-recipe modifier effect to a research technology.
 */
export function unlockRecipeWithTechnology(recipe_name: string, technology_name: string) {
  if (!data.raw.recipe || !data.raw.recipe[recipe_name]) {
    strace.warn("data", "unlockRecipeWithTechnology: Recipe does not exist, skipping", "recipe", recipe_name);
    return;
  }
  const tech = data.raw.technology !== undefined ? data.raw.technology[technology_name] : undefined;
  if (!tech) {
    strace.warn("data", "unlockRecipeWithTechnology: Technology does not exist, skipping", "technology", technology_name);
    return;
  }
  tech.effects = [
    ...(tech.effects || []),
    {
      type: "unlock-recipe",
      recipe: recipe_name,
    },
  ];
}
