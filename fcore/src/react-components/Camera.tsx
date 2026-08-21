import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the `Camera` component.
 */
export type CameraProps = PrimitiveProps<"camera">;

/**
 * World camera view element.
 */
export function Camera(props: CameraProps) {
  return createElement("camera", props);
}
