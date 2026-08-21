import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the `HFlow` component.
 */
export type HFlowProps = Omit<PrimitiveProps<"flow">, "direction">;

/**
 * Horizontal layout flow container (`direction="horizontal"`).
 *
 * @example
 * ```tsx
 * <HFlow styles={{ vertical_align: "center" }}>
 *   <Label caption="Username:" />
 *   <Input text={name} onChange={setName} />
 * </HFlow>
 * ```
 */
export function HFlow(props: HFlowProps) {
  return createElement("flow", { ...props, direction: "horizontal" }, props.children);
}
