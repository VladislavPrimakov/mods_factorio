import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the Factorio `Button` component.
 */
export type ButtonProps = PrimitiveProps<"button">;

/**
 * Standard Factorio push button component.
 *
 * @example
 * ```tsx
 * <Button
 *   caption="Click Me"
 *   style="confirm_button"
 *   onClick={(ev) => log("Button clicked")}
 * />
 * ```
 */
export function Button(props: ButtonProps) {
  return createElement("button", props, props.children);
}
