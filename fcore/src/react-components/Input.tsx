import type { OnGuiTextChangedEvent, OnGuiConfirmedEvent, TextFieldGuiElement } from "factorio:runtime";
import { createElement, useDebouncedCallback, type Ref, type PrimitiveProps } from "../react";

/**
 * Props for the Factorio `Input` (textfield) component.
 */
export type InputProps = Omit<PrimitiveProps<"textfield">, "onTextChanged" | "onConfirmed" | "ref"> & {
  /** Reference to the underlying native `TextFieldGuiElement`. */
  ref?: Ref<TextFieldGuiElement>;
  /** Minimum numeric value allowed when `numeric` is true. */
  min_value?: number;
  /** Maximum numeric value allowed when `numeric` is true. */
  max_value?: number;
  /**
   * Automatically clamps the input text to `[min_value, max_value]` on every keystroke.
   * @default false
   */
  clamp_on_change?: boolean;
  /**
   * Delay in game ticks before firing `onChange`.
   * When specified, debounces rapid keystrokes (e.g. `debounceTicks={30}`).
   */
  debounceTicks?: number;
  /**
   * Callback fired when text changes.
   * Receives string text as 1st arg and parsed integer as 3rd arg (if numeric).
   */
  onChange?: (this: void, text: string, ev: OnGuiTextChangedEvent, numericValue?: number) => void;
  /**
   * Callback fired when the player presses Enter/Confirm in the textfield.
   */
  onConfirm?: (this: void, text: string, ev: OnGuiConfirmedEvent, numericValue?: number) => void;
};

const MIN_INT32 = -2147483648;
const MAX_INT32 = 2147483647;

/**
 * Enhanced Factorio textfield component with numeric bounds clamping,
 * Enter key confirmation (`onConfirm`), and ref focus support.
 *
 * @example
 * ```tsx
 * <Input
 *   numeric={true}
 *   allow_negative={true}
 *   min_value={-100}
 *   max_value={100}
 *   text={countText}
 *   debounceTicks={30}
 *   onChange={(text, ev, num) => setCount(num ?? 0)}
 *   onConfirm={() => saveSettings()}
 * />
 * ```
 */
export function Input(props: InputProps) {
  const { onChange, onConfirm, min_value, max_value, clamp_on_change = false, lose_focus_on_confirm = true, numeric, allow_negative, debounceTicks, ...rest } = props;

  const minVal = min_value !== undefined ? min_value : numeric ? (allow_negative ? MIN_INT32 : 0) : undefined;
  const maxVal = max_value !== undefined ? max_value : numeric ? MAX_INT32 : undefined;

  const parseAndClamp = (text: string): [string, number | undefined] => {
    if (!numeric) return [text, undefined];
    if (text === "" || (allow_negative && text === "-")) {
      return [text, undefined];
    }
    const num = tonumber(text);
    if (num === undefined || num !== num || num === Infinity || num === -Infinity) {
      return ["", undefined];
    }
    let clamped = Math.floor(num);
    if (minVal !== undefined && clamped < minVal) clamped = minVal;
    if (maxVal !== undefined && clamped > maxVal) clamped = maxVal;
    return [tostring(clamped), clamped];
  };

  const debouncedOnChange = useDebouncedCallback((text: string, ev: OnGuiTextChangedEvent, num?: number) => {
    if (onChange) onChange(text, ev, num);
  }, debounceTicks ?? 30);

  return createElement("textfield", {
    numeric,
    allow_negative,
    lose_focus_on_confirm,
    onTextChanged: (ev: OnGuiTextChangedEvent) => {
      const rawText = ((ev.element as TextFieldGuiElement).text as string) || "";
      const [clampedText, num] = parseAndClamp(rawText);
      const finalText = clamp_on_change && rawText !== clampedText && rawText !== "-" && rawText !== "" ? clampedText : rawText;
      if (clamp_on_change && rawText !== clampedText && rawText !== "-" && rawText !== "") {
        (ev.element as TextFieldGuiElement).text = clampedText;
      }
      if (debounceTicks !== undefined && debounceTicks > 0) {
        debouncedOnChange(finalText, ev, num);
      } else if (onChange) {
        onChange(finalText, ev, num);
      }
    },
    onConfirmed: (ev: OnGuiConfirmedEvent) => {
      const rawText = ((ev.element as TextFieldGuiElement).text as string) || "";
      const [clampedText, num] = parseAndClamp(rawText);
      (ev.element as TextFieldGuiElement).text = clampedText;
      if (onConfirm) onConfirm(clampedText, ev, num);
    },
    ...rest,
  });
}
