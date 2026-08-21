import { createElement } from "../react";
import { Table, type TableProps } from "./Table";

/**
 * Props for the `SlotButtonTable` grid component.
 */
export type SlotButtonTableProps = TableProps;

/**
 * Table grid layout specifically styled for holding `SlotButton` items.
 *
 * @example
 * ```tsx
 * <SlotButtonTable column_count={10} style="slot_table">
 *   {slotButtons}
 * </SlotButtonTable>
 * ```
 */
export function SlotButtonTable(props: SlotButtonTableProps) {
  const { style = "table", ...rest } = props;
  return (
    <Table style={style} {...rest}>
      {props.children}
    </Table>
  );
}
