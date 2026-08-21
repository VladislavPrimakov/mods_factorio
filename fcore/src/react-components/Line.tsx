import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the `Line` component.
 */
export type LineProps = PrimitiveProps<"line">;

/**
 * Visual separator line (horizontal or vertical).
 *
 * @example
 * ```tsx
 * <Line direction="horizontal" />
 * ```
 */
export function Line(props: LineProps) {
  return createElement("line", props);
}
