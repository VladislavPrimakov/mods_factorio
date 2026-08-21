import { createElement } from "../react";
import { Frame, type FrameProps } from "./Frame";

/**
 * Props for the `FixedWindowFrame` component.
 */
export type FixedWindowFrameProps = FrameProps;

/**
 * Non-draggable window frame container with vertical direction.
 * Suitable for fixed HUD overlays, side panels, or embedded viewports.
 *
 * @example
 * ```tsx
 * <FixedWindowFrame style="inside_shallow_frame">
 *   <Label caption="Status Panel" />
 * </FixedWindowFrame>
 * ```
 */
export function FixedWindowFrame(props: FixedWindowFrameProps) {
  return (
    <Frame direction="vertical" {...props}>
      {props.children}
    </Frame>
  );
}
