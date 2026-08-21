import { createElement } from "../react";
import type { IndicatorColor } from "../styles/_types";
import type { IndicatorSpriteName } from "../styles/ImageStyle";
import { Sprite, type SpriteProps } from "./Sprite";

/**
 * Props for the `Indicator` LED status component.
 */
export type IndicatorProps = Omit<SpriteProps, "sprite" | "children"> & {
  /**
   * Status color for the LED dot.
   * @default "green"
   */
  color?: IndicatorColor;
};

/**
 * Small circular status indicator LED (green, red, yellow, blue, etc.).
 *
 * @example
 * ```tsx
 * <Indicator color={isOnline ? "green" : "red"} tooltip={isOnline ? "Online" : "Offline"} />
 * ```
 */
export function Indicator(props: IndicatorProps) {
  const { color = "green", ...rest } = props;
  const spriteName: IndicatorSpriteName = `react_indicator_${color}`;

  return <Sprite style="react_indicator" sprite={spriteName} {...rest} />;
}
