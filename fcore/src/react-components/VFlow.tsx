import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the `VFlow` component.
 */
export type VFlowProps = Omit<PrimitiveProps<"flow">, "direction">;

/**
 * Vertical layout flow container (`direction="vertical"`).
 *
 * @example
 * ```tsx
 * <VFlow styles={{ horizontally_stretchable: true }}>
 *   <Label caption="Title" style="bold_label" />
 *   <Label caption="Description text..." />
 * </VFlow>
 * ```
 */
export function VFlow(props: VFlowProps) {
  return createElement("flow", { ...props, direction: "vertical" }, props.children);
}
