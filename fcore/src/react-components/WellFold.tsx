import { createElement, useState } from "../react";
import { WellSection, type WellSectionProps } from "./WellSection";
import { SpriteButton } from "./SpriteButton";

/**
 * Props for the `WellFold` collapsible section component.
 */
export type WellFoldProps = Omit<WellSectionProps, "header_decoration" | "collapsed"> & {
  /**
   * Whether the section starts collapsed by default.
   * @default true
   */
  defaultCollapsed?: boolean;
};

/**
 * Collapsible well section with an expand/collapse toggle button in the header.
 *
 * @example
 * ```tsx
 * <WellFold caption="Advanced Options" defaultCollapsed={true}>
 *   <Label caption="Detailed settings..." />
 * </WellFold>
 * ```
 */
export function WellFold(props: WellFoldProps) {
  const { defaultCollapsed = true, ...rest } = props;
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <WellSection
      {...rest}
      collapsed={collapsed}
      header_decoration={
        <SpriteButton style="frame_action_button" sprite={collapsed ? "utility/expand" : "utility/collapse"} mouse_button_filter={["left"]} onClick={() => setCollapsed(!collapsed)} />
      }
    />
  );
}
