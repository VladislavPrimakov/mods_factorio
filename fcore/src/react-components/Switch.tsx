import type { OnGuiSwitchStateChangedEvent, SwitchState, SwitchGuiElement } from "factorio:runtime";
import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the Factorio `Switch` component.
 */
export type SwitchProps = Omit<PrimitiveProps<"switch">, "onSwitchStateChanged"> & {
  /**
   * Current switch state. Accepts `"left" | "right" | "none"`, boolean (`true` = right, `false` = left),
   * or number (`0` = left, `1` = right, `2` = none).
   */
  value?: SwitchState | boolean | 0 | 1 | 2;
  /** Callback fired when the switch position changes. */
  onChange?: (this: void, state: SwitchState, ev: OnGuiSwitchStateChangedEvent) => void;
};

/**
 * Native Factorio 2-way or 3-way toggle switch component.
 * Supports convenient boolean and numeric value mappings.
 *
 * @example
 * ```tsx
 * <Switch
 *   value={isEnabled}
 *   left_label_caption="OFF"
 *   right_label_caption="ON"
 *   onChange={(state) => setIsEnabled(state === "right")}
 * />
 * ```
 */
export function Switch(props: SwitchProps) {
  const { value, onChange, ...rest } = props;

  let switch_state: SwitchState | undefined;
  if (value === true || value === 1) switch_state = "right";
  else if (value === false || value === 0) switch_state = "left";
  else if (value === 2) switch_state = "none";
  else if (value !== undefined) switch_state = value as SwitchState;

  return createElement(
    "switch",
    {
      switch_state,
      onSwitchStateChanged: (ev: OnGuiSwitchStateChangedEvent) => {
        if (onChange) onChange((ev.element as SwitchGuiElement).switch_state as SwitchState, ev);
      },
      ...rest,
    },
    props.children,
  );
}
