import type { LocalisedString } from "factorio:runtime";
import { createElement, useState, getComponentTypeName, type ReactNode, type ReactElement } from "../react";
import { VFlow } from "./VFlow";
import { HFlow } from "./HFlow";
import { Frame } from "./Frame";
import { Button } from "./Button";
import type { TabProps } from "./Tab";
import { Tab } from "./Tab";
import type { StylesFor } from "../styles";

/**
 * Props for the `TabbedPane` multi-tab container.
 */
export type TabbedPaneProps = {
  /** `<Tab>` child elements. */
  children?: ReactNode;
  /** Controlled 1-based index of the active tab. */
  selected_tab_index?: number;
  /**
   * Initial active tab index (1-based) in uncontrolled mode.
   * @default 1
   */
  default_tab_index?: number;
  /** Callback fired when the active tab index changes. */
  onSelectedTabChanged?: (this: void, index: number) => void;
  /** Custom styles applied to the outer layout container flow. */
  styles?: StylesFor<"flow">;
};

/**
 * Native Factorio tabbed pane layout with lazy tab content mounting.
 * Automatically builds header tab buttons and renders the active `<Tab>` content inside an inner frame.
 *
 * @example
 * ```tsx
 * <TabbedPane default_tab_index={1}>
 *   <Tab caption="General">
 *     <GeneralSettings />
 *   </Tab>
 *   <Tab caption="Advanced">
 *     <AdvancedSettings />
 *   </Tab>
 * </TabbedPane>
 * ```
 */
export function TabbedPane(props: TabbedPaneProps) {
  const { children, selected_tab_index: controlledIndex, default_tab_index = 1, onSelectedTabChanged, styles } = props;

  const [uncontrolledIndex, setUncontrolledIndex] = useState<number>(() => (controlledIndex !== undefined ? controlledIndex : default_tab_index));

  const activeIndex = controlledIndex !== undefined ? controlledIndex : uncontrolledIndex;

  const flatChildren: ReactElement[] = [];
  if (children !== undefined && typeof children === "object") {
    if ((children as ReactElement).type !== undefined) {
      flatChildren.push(children as ReactElement);
    } else {
      for (const [_, c] of pairs(children as Record<number, ReactNode>)) {
        if (c !== undefined && c !== false && typeof c === "object") {
          if ((c as ReactElement).type !== undefined) {
            flatChildren.push(c as ReactElement);
          }
        }
      }
    }
  }

  const tabHeaders: ReactNode[] = [];
  let activeContent: ReactNode = undefined;

  let tabCounter = 1;
  for (const tabEl of flatChildren) {
    if (tabEl && typeof tabEl === "object" && (getComponentTypeName(tabEl.type) === "Tab" || tabEl.type === Tab || tabEl.type === "tab")) {
      const targetIndex = tabCounter++;
      const isSelected = targetIndex === activeIndex;
      const { caption, badge_text, children: tabContent, ...tabProps } = tabEl.props || {};

      const tabCaption = badge_text !== undefined ? (["", caption, " (", badge_text, ")"] as LocalisedString) : caption;

      tabHeaders.push(
        <Button
          key={`tab_header_${targetIndex}`}
          style="react_tab_button"
          toggled={isSelected}
          caption={tabCaption}
          onClick={() => {
            if (controlledIndex === undefined) {
              setUncontrolledIndex(targetIndex);
            }
            if (onSelectedTabChanged) {
              onSelectedTabChanged(targetIndex);
            }
          }}
          {...tabProps}
        />,
      );

      if (isSelected) {
        activeContent = tabContent;
      }
    }
  }

  return (
    <VFlow styles={{ horizontally_stretchable: true, ...styles }}>
      <HFlow styles={{ horizontally_stretchable: true, horizontal_spacing: 0 }}>{tabHeaders}</HFlow>
      <Frame
        style="inside_shallow_frame_with_padding"
        direction="vertical"
        styles={{
          horizontally_stretchable: true,
          vertically_stretchable: true,
          top_margin: -4,
        }}
      >
        {activeContent}
      </Frame>
    </VFlow>
  );
}
