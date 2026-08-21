import type { OnGuiCheckedStateChangedEvent, CheckboxGuiElement } from "factorio:runtime";
import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the Factorio `Checkbox` component.
 */
export type CheckboxProps = Omit<PrimitiveProps<"checkbox">, "onCheckedStateChanged"> & {
  /**
   * Callback fired when the player changes the checked state.
   * Provides the new boolean state directly as the first argument.
   */
  onChange?: (this: void, state: boolean, ev: OnGuiCheckedStateChangedEvent) => void;
};

/**
 * Native Factorio checkbox component with ergonomic `onChange` boolean callback.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   caption="Enable Auto-crafting"
 *   state={isEnabled}
 *   onChange={(checked) => setIsEnabled(checked)}
 * />
 * ```
 */
export function Checkbox(props: CheckboxProps) {
  const { onChange, ...rest } = props;

  return createElement(
    "checkbox",
    {
      ...rest,
      onCheckedStateChanged: (ev: OnGuiCheckedStateChangedEvent) => {
        if (onChange) onChange((ev.element as CheckboxGuiElement).state, ev);
      },
    },
    props.children,
  );
}
