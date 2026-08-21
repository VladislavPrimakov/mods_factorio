import type { LocalisedString } from "factorio:runtime";
import { createElement } from "../react";
import { Label, type LabelProps } from "./Label";
import { HFlow, type HFlowProps } from "./HFlow";
import { EmptyWidget } from "./EmptyWidget";

/**
 * Props for the `Labeled` form row component.
 */
export type LabeledProps = HFlowProps & {
  /** Text or localized string for the left label. */
  caption: LocalisedString;
  /** Optional custom props forwarded to the `Label` component. */
  label_props?: LabelProps;
};

/**
 * Horizontal form row layout containing a left-aligned label and right-aligned control
 * separated by an expandable spacer.
 *
 * @example
 * ```tsx
 * <Labeled caption="Station Priority">
 *   <Input numeric={true} text={priority} onChange={setPriority} />
 * </Labeled>
 * ```
 */
export function Labeled(props: LabeledProps) {
  const { caption, label_props, children, styles, ...rest } = props;
  return (
    <HFlow
      styles={{
        vertical_align: "center",
        horizontally_stretchable: true,
        ...styles,
      }}
      {...rest}
    >
      <Label
        styles={{
          font_color: { r: 1, g: 0.9, b: 0.75 },
          font: "default-bold",
        }}
        caption={caption}
        {...label_props}
      />
      <EmptyWidget styles={{ horizontally_stretchable: true }} />
      {children}
    </HFlow>
  );
}
