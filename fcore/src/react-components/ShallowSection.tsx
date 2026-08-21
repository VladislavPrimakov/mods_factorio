import { createElement } from "../react";
import { VFlow } from "./VFlow";
import { Frame, type FrameProps } from "./Frame";

/**
 * Props for the `ShallowSection` component.
 */
export type ShallowSectionProps = FrameProps;

/**
 * Padded sub-panel styled with `inside_shallow_frame_with_padding`.
 * Ideal for grouping sub-controls or dialog panels within a main window frame.
 *
 * @example
 * ```tsx
 * <ShallowSection>
 *   <Label caption="Network Settings" bold={true} />
 *   <Input text={networkMask} onChange={setNetworkMask} />
 * </ShallowSection>
 * ```
 */
export function ShallowSection(props: ShallowSectionProps) {
  const { visible, styles, children, ...rest } = props;
  return (
    <Frame
      style="inside_shallow_frame_with_padding"
      direction="vertical"
      styles={{
        bottom_margin: 6,
        ...styles,
      }}
      {...rest}
    >
      <VFlow visible={visible}>{children}</VFlow>
    </Frame>
  );
}
