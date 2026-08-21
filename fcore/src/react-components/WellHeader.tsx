import { createElement, type ReactNode } from "../react";
import { Frame, type FrameProps } from "./Frame";
import { Label } from "./Label";
import { HFlow } from "./HFlow";

/**
 * Props for the `WellHeader` component.
 */
export type WellHeaderProps = FrameProps & {
  /** Optional custom React node used as caption element. */
  caption_element?: ReactNode;
};

/**
 * Subheader bar styled with `subheader_frame` and `subheader_caption_label`.
 *
 * @example
 * ```tsx
 * <WellHeader caption="Section Title">
 *   <Button caption="Actions" style="mini_button" />
 * </WellHeader>
 * ```
 */
export function WellHeader(props: WellHeaderProps) {
  const { caption, caption_element, children, styles, ...rest } = props;

  let captionElement = caption_element;
  if (caption) {
    captionElement = <Label style="subheader_caption_label" caption={caption} />;
  }

  return (
    <Frame
      style="subheader_frame"
      styles={{
        horizontally_stretchable: true,
        bottom_margin: 4,
        ...styles,
      }}
      {...rest}
    >
      {captionElement}
      <HFlow styles={{ horizontally_stretchable: true }} />
      {children}
    </Frame>
  );
}
