import { createElement, type PrimitiveProps } from "../react";

/**
 * Props for the `EntityPreview` component.
 */
export type EntityPreviewProps = PrimitiveProps<"entity-preview">;

/**
 * Entity preview element.
 */
export function EntityPreview(props: EntityPreviewProps) {
  return createElement("entity-preview", props);
}
