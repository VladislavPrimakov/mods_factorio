import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the `Frame` component.
 */
export type FrameProps = PrimitiveProps<"frame">;

/**
 * Generic Factorio frame component.
 *
 * @example
 * ```tsx
 * <Frame style="inside_shallow_frame" direction="vertical">
 *   <Label caption="Section content" />
 * </Frame>
 * ```
 */
export function Frame(props: FrameProps) {
  const { style = "frame", ...rest } = props;
  return createElement("frame", { style, ...rest }, props.children);
}
