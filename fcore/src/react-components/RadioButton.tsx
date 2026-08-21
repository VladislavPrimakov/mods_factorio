import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the Factorio `RadioButton` component.
 */
export type RadioButtonProps = PrimitiveProps<"radiobutton">;

/**
 * Native Factorio radio button component.
 *
 * @example
 * ```tsx
 * <RadioButton
 *   caption="Option 1"
 *   state={selectedOption === 1}
 *   onCheckedStateChanged={(ev) => ev.element.state && setSelectedOption(1)}
 * />
 * ```
 */
export function RadioButton(props: RadioButtonProps) {
  return createElement("radiobutton", props, props.children);
}
