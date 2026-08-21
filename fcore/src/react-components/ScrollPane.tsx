import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the Factorio `ScrollPane` component.
 */
export type ScrollPaneProps = PrimitiveProps<"scroll-pane">;

/**
 * Native Factorio scroll pane container.
 * Supports `scroll_pane`, `naked_scroll_pane`, and `deep_slots_scroll_pane` styles.
 *
 * @example
 * ```tsx
 * <ScrollPane
 *   style="naked_scroll_pane"
 *   vertical_scroll_policy="auto"
 *   horizontal_scroll_policy="never"
 *   styles={{ maximal_height: 300, horizontally_stretchable: true }}
 * >
 *   <VFlow>{items}</VFlow>
 * </ScrollPane>
 * ```
 */
export function ScrollPane(props: ScrollPaneProps) {
  const { style = "scroll_pane", ...rest } = props;
  return createElement("scroll-pane", { style, ...rest }, props.children);
}
