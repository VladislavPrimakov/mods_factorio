import type { LocalisedString, OnGuiSelectionStateChangedEvent, DropDownGuiElement } from "factorio:runtime";
import { createElement, type PrimitiveProps } from "../react";

/**
 * Option entry for key-value `Dropdown`.
 */
export type DropdownOption<T = string | number> = {
  /** Unique key or enum value corresponding to the option. */
  key: T;
  /** Localised string or caption to display in the dropdown list. */
  caption: LocalisedString;
};

/**
 * Props for the Factorio `Dropdown` component.
 * Supports both high-level key-value `options` and native 1-based `items`.
 */
export type DropdownProps<T = string | number> = Omit<PrimitiveProps<"drop-down">, "items" | "selected_index" | "onSelectionStateChanged"> & {
  /** List of structured options with keys and captions. */
  options?: DropdownOption<T>[];
  /** Currently selected option key when using `options`. */
  value?: T;
  /** Callback fired with the selected option's key, 1-based index, and native event. */
  onChange?: (this: void, value: T, index: number, ev: OnGuiSelectionStateChangedEvent) => void;

  /** Native Factorio list of item captions. */
  items?: LocalisedString[];
  /** Native 1-based selected index. */
  selected_index?: number;
  /** Low-level Factorio selection event handler. */
  onSelectionStateChanged?: (this: void, ev: OnGuiSelectionStateChangedEvent) => void;
};

/**
 * Dropdown selector component supporting both key-value `options` and raw Factorio `items`.
 *
 * @example
 * ```tsx
 * <Dropdown
 *   options={[
 *     { key: "item", caption: "Items" },
 *     { key: "fluid", caption: "Fluids" },
 *   ]}
 *   value={selectedMode}
 *   onChange={(mode) => setSelectedMode(mode)}
 * />
 * ```
 */
export function Dropdown<T = string | number>(props: DropdownProps<T>) {
  const { options, value, onChange, items, selected_index, onSelectionStateChanged, ...rest } = props;

  let computedItems: LocalisedString[] = [];
  let computedSelectedIndex = 0;

  if (options) {
    computedItems = options.map((opt) => opt.caption);
    if (value !== undefined) {
      const idx = options.findIndex((opt) => opt.key === value);
      if (idx >= 0) {
        computedSelectedIndex = idx + 1;
      }
    }
  } else if (items) {
    computedItems = items;
    if (selected_index !== undefined) {
      computedSelectedIndex = selected_index;
    }
  }

  return createElement("drop-down", {
    items: computedItems,
    selected_index: computedSelectedIndex || undefined,
    onSelectionStateChanged: (ev: OnGuiSelectionStateChangedEvent) => {
      const newIndex = (ev.element as DropDownGuiElement).selected_index;
      if (options && onChange && newIndex > 0 && newIndex <= options.length) {
        onChange(options[newIndex - 1].key, newIndex, ev);
      } else if (onChange) {
        onChange(newIndex as unknown as T, newIndex, ev);
      }
      if (onSelectionStateChanged) {
        onSelectionStateChanged(ev);
      }
    },
    ...rest,
  });
}
