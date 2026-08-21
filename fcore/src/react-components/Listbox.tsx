import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the Factorio `Listbox` component.
 */
export type ListboxProps = PrimitiveProps<"list-box">;

/**
 * Native Factorio list-box component.
 *
 * @example
 * ```tsx
 * <Listbox
 *   items={["Station Alpha", "Station Beta", "Station Gamma"]}
 *   selected_index={selectedIndex}
 *   onSelectionStateChanged={(ev) => setSelectedIndex(ev.element.selected_index)}
 * />
 * ```
 */
export function Listbox(props: ListboxProps) {
  return createElement("list-box", props, props.children);
}
