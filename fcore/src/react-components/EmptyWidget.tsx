import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the Factorio `EmptyWidget` component.
 */
export type EmptyWidgetProps = PrimitiveProps<"empty-widget">;

/**
 * Factorio empty-widget component.
 * Commonly used as a flexible spacer (`horizontally_stretchable: true`) or titlebar drag handle (`drag_target`).
 *
 * @example
 * ```tsx
 * // Flexible spacer in a toolbar
 * <EmptyWidget styles={{ horizontally_stretchable: true }} />
 * ```
 */
export function EmptyWidget(props: EmptyWidgetProps) {
  return createElement("empty-widget", props, props.children);
}
