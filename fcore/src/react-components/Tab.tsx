import type { LocalisedString } from "factorio:runtime";
import { type ReactNode, type PrimitiveProps } from "../react";

/**
 * Props for the `Tab` definition component.
 */
export type TabProps = Omit<PrimitiveProps<"tab">, "children"> & {
  /** Text or localized string displayed on the tab header button. */
  caption: LocalisedString;
  /** Optional badge text displayed on the tab header (e.g. item count or notification). */
  badge_text?: LocalisedString;
  /** Content to render when this tab is active. */
  children: ReactNode | ReactNode[];
};

/**
 * Declarative Tab specification component used inside `<TabbedPane>`.
 * Content is lazily rendered only when the tab is currently active.
 *
 * @example
 * ```tsx
 * <Tab caption="Configuration" badge_text="3">
 *   <ConfigPanel />
 * </Tab>
 * ```
 */
export function Tab(props: TabProps): ReactNode {
  return undefined;
}
