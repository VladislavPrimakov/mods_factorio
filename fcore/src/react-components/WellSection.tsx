import type { LocalisedString } from "factorio:runtime";
import { createElement, type ReactNode } from "../react";
import { WellHeader } from "./WellHeader";
import { VFlow, type VFlowProps } from "./VFlow";

/**
 * Props for the `WellSection` container component.
 */
export type WellSectionProps = VFlowProps & {
  /** Text or localized string caption for the header bar. */
  caption?: LocalisedString;
  /** Optional custom React node for the header caption. */
  caption_element?: ReactNode;
  /** Whether the body content is hidden. */
  collapsed?: boolean;
  /** Optional right-aligned action buttons or badges in the header bar. */
  header_decoration?: ReactNode | ReactNode[];
};

/**
 * Grouped content section with a styled subheader bar and padded body flow.
 *
 * @example
 * ```tsx
 * <WellSection caption="Signal Filters">
 *   <SlotButtonTable column_count={5}>{slots}</SlotButtonTable>
 * </WellSection>
 * ```
 */
export function WellSection(props: WellSectionProps) {
  const { caption, caption_element, collapsed = false, visible = true, header_decoration, styles, children, ...rest } = props;

  return (
    <VFlow
      visible={visible}
      styles={{
        bottom_margin: 6,
        horizontally_stretchable: true,
        ...styles,
      }}
      {...rest}
    >
      <WellHeader caption={caption} caption_element={caption_element}>
        {header_decoration}
      </WellHeader>

      <VFlow
        visible={!collapsed}
        styles={{
          left_padding: 4,
          right_padding: 4,
          horizontally_stretchable: true,
        }}
      >
        {children}
      </VFlow>
    </VFlow>
  );
}
