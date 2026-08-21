import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the `Minimap` component.
 */
export type MinimapProps = PrimitiveProps<"minimap">;

/**
 * Minimap view element.
 */
export function Minimap(props: MinimapProps) {
  return createElement("minimap", props);
}
