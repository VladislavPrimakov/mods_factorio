import type { Color, SignalID, OnGuiClickEvent, OnGuiElemChangedEvent, ChooseElemButtonGuiElement } from "factorio:runtime";
import { createElement, type ReactNode, type PrimitiveProps } from "../react";
import { Label } from "./Label";

/**
 * Props for the `SlotButton` component.
 */
export type SlotButtonProps = Omit<PrimitiveProps<"choose-elem-button">, "onElemChanged" | "elem_value" | "elem_type"> & {
  /** The active signal to display in the slot. */
  signal?: SignalID;
  /** Callback fired when the player changes or clears the signal. */
  onChange?: (this: void, signal: SignalID | undefined, ev: OnGuiElemChangedEvent) => void;
  /** If true, the slot button cannot open the native signal picker; clicks trigger `onClick`. */
  locked?: boolean;
  /** Numeric count badge displayed in the lower-right corner (auto-formatted with SI units) or custom string. */
  count?: number | string;
  /** Custom text color for the count label. */
  count_color?: Color;
  /** Optional secondary numeric badge displayed in the upper-right corner or custom string. */
  upper?: number | string;
  /** Custom text color for the upper label. */
  upper_color?: Color;
  /** If true, applies active yellow border selection style. */
  selected?: boolean;
  /** Callback fired when the slot is clicked (especially in locked mode). */
  onClick?: (this: void, ev: OnGuiClickEvent) => void;
};

function siFormat(count: number, divisor: number, siSymbol: string): string {
  const rounded = Math.floor(count / divisor);
  if (Math.abs(rounded) >= 10) {
    return string.format("%.0f%s", rounded, siSymbol);
  } else {
    return string.format("%.1f%s", count / divisor, siSymbol);
  }
}

function formatSignalCount(count?: number | string): string {
  if (count === undefined) return "";
  if (typeof count === "string") return count;
  const absCount = Math.abs(count);

  if (absCount >= 1000000000000) {
    return siFormat(count, 1000000000000, "T");
  } else if (absCount >= 1000000000) {
    return siFormat(count, 1000000000, "G");
  } else if (absCount >= 1000000) {
    return siFormat(count, 1000000, "M");
  } else if (absCount >= 1000) {
    return siFormat(count, 1000, "k");
  } else {
    return tostring(count);
  }
}

/**
 * Standard Factorio slot button with optional count and secondary/upper badges.
 *
 * @example
 * ```tsx
 * <SlotButton
 *   signal={activeSignal}
 *   count={1500}
 *   selected={isSelected}
 *   onChange={(sig) => setActiveSignal(sig)}
 * />
 * ```
 */
export function SlotButton(props: SlotButtonProps) {
  const { locked, count, count_color, upper, upper_color, signal, onChange, selected, onClick, elem_filters, ...rest } = props;

  const style = selected ? "react_selected_slot_button_default" : "react_slot_button_default";

  const children: ReactNode[] = [];
  if (upper !== undefined) {
    children.push(
      <Label key="upper" caption={formatSignalCount(upper)} style="react_label_signal_count_upper" styles={upper_color ? { font_color: upper_color } : undefined} ignored_by_interaction={true} />,
    );
  }
  if (count !== undefined) {
    children.push(
      <Label key="count" caption={formatSignalCount(count)} style="react_label_signal_count" styles={count_color ? { font_color: count_color } : undefined} ignored_by_interaction={true} />,
    );
  }

  return createElement(
    "choose-elem-button",
    {
      elem_type: "signal",
      elem_value: signal,
      locked,
      elem_filters,
      style,
      onClick: locked ? onClick : undefined,
      onElemChanged: (ev: OnGuiElemChangedEvent) => {
        if (onChange) {
          onChange((ev.element as ChooseElemButtonGuiElement).elem_value as SignalID | undefined, ev);
        }
      },
      ...rest,
    },
    ...children,
  );
}
