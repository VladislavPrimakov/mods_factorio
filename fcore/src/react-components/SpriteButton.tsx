import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the Factorio `SpriteButton` component.
 */
export type SpriteButtonProps = PrimitiveProps<"sprite-button">;

/**
 * Native Factorio sprite button component.
 *
 * @example
 * ```tsx
 * <SpriteButton
 *   sprite="utility/trash"
 *   style="tool_button_red"
 *   tooltip="Delete entry"
 *   onClick={handleDelete}
 * />
 * ```
 */
export function SpriteButton(props: SpriteButtonProps) {
  return createElement("sprite-button", props, props.children);
}
