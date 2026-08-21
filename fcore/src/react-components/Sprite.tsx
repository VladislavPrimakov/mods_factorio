import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the `Sprite` component.
 */
export type SpriteProps = PrimitiveProps<"sprite">;

/**
 * Static sprite/icon display element.
 *
 * @example
 * ```tsx
 * <Sprite sprite="item/iron-plate" />
 * ```
 */
export function Sprite(props: SpriteProps) {
  return createElement("sprite", props);
}
