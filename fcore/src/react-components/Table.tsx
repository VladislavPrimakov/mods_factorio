import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the `Table` component.
 */
export type TableProps = PrimitiveProps<"table">;

/**
 * Grid layout table container (`column_count` determines the number of columns).
 *
 * @example
 * ```tsx
 * <Table column_count={4}>
 *   <SlotButton slot={1} />
 *   <SlotButton slot={2} />
 * </Table>
 * ```
 */
export function Table(props: TableProps) {
  return createElement("table", props, props.children);
}
