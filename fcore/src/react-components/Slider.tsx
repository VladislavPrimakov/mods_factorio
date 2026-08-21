import type { OnGuiValueChangedEvent, SliderGuiElement } from "factorio:runtime";
import { createElement, useDebouncedCallback, type PrimitiveProps } from "../react";

/**
 * Props for the Factorio `Slider` component.
 */
export type SliderProps = Omit<PrimitiveProps<"slider">, "onValueChanged" | "value" | "slider_value"> & {
  /** Numeric value of the slider. */
  value?: number;
  /**
   * Delay in game ticks before firing `onChange`.
   * When specified, debounces rapid sliding adjustments (e.g. `debounceTicks={15}`).
   */
  debounceTicks?: number;
  /** Callback fired when the slider value is changed by the player. */
  onChange?: (this: void, value: number, ev: OnGuiValueChangedEvent) => void;
};

/**
 * Native Factorio slider control with ergonomic `onChange(value)` callback.
 *
 * @example
 * ```tsx
 * <Slider
 *   minimum_value={0}
 *   maximum_value={100}
 *   value={volume}
 *   debounceTicks={15}
 *   onChange={(val) => setVolume(val)}
 * />
 * ```
 */
export function Slider(props: SliderProps) {
  const { value, onChange, debounceTicks, ...rest } = props;

  const debouncedOnChange = useDebouncedCallback((val: number, ev: OnGuiValueChangedEvent) => {
    if (onChange) onChange(val, ev);
  }, debounceTicks ?? 30);

  return createElement("slider", {
    value,
    slider_value: value,
    onValueChanged: (ev: OnGuiValueChangedEvent) => {
      const val = (ev.element as SliderGuiElement).slider_value;
      if (debounceTicks !== undefined && debounceTicks > 0) {
        debouncedOnChange(val, ev);
      } else if (onChange) {
        onChange(val, ev);
      }
    },
    ...rest,
  });
}
