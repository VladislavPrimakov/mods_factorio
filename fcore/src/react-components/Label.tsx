import { createElement, type PrimitiveProps } from "../react";
import type { StylesFor } from "../styles";

/**
 * Props for the Factorio `Label` component.
 */
export type LabelProps = PrimitiveProps<"label"> & {
  /** If true, applies `font = "default-bold"`. */
  bold?: boolean;
  /** If true, applies `font = "default-large"`. */
  large?: boolean;
  /** If true, enables rich text tags `[item=...]`, `[color=...]` in caption. */
  richText?: boolean;
  /** If true, allows the text to wrap across multiple lines (`single_line = false`). */
  multiline?: boolean;
};

/**
 * Factorio label component with built-in shortcuts for bold, large, multiline, and rich text.
 *
 * @example
 * ```tsx
 * <Label
 *   caption="Section Title"
 *   bold={true}
 *   styles={{ font_color: { r: 1, g: 0.9, b: 0.7 } }}
 * />
 * ```
 */
export function Label(props: LabelProps) {
  const { bold, large, richText, multiline, styles, ...rest } = props;

  const customStyles: StylesFor<"label"> = { ...styles };
  if (bold) customStyles.font = "default-bold";
  if (large) customStyles.font = "default-large";

  if (richText) customStyles.rich_text_setting = defines.rich_text_setting.enabled;
  if (multiline) customStyles.single_line = false;

  const hasCustomStyles = next(customStyles) !== undefined;

  return createElement(
    "label",
    {
      styles: hasCustomStyles ? customStyles : undefined,
      ...rest,
    },
    props.children,
  );
}
