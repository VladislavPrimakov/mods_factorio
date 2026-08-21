import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the Factorio `ProgressBar` component.
 */
export type ProgressBarProps = PrimitiveProps<"progressbar">;

/**
 * Native Factorio progress bar component.
 *
 * @example
 * ```tsx
 * <ProgressBar value={progressRatio} style="production_progressbar" />
 * ```
 */
export function ProgressBar(props: ProgressBarProps) {
  return createElement("progressbar", props, props.children);
}
