import { getDefaultStyles, png_subheader_line } from "./_common";

export type ReactLineStyleName = "react_subheader_horizontal_line" | "react_titlebar_separator_line";

export type VanillaLineStyleName =
  | "line"
  | "inside_shallow_frame_with_padding_line"
  | "blurry_panel_horizontal_line"
  | "dark_line"
  | "tooltip_category_line"
  | "tooltip_horizontal_line"
  | "lab_progress_and_slot_divider"
  | "lab_progress_and_slot_divider_empty"
  | "horizontal_line"
  | "vertical_line";

/**
 * Extension interface for mods to register custom line styles.
 */
export interface ModLineStyles {}

export type LineStyleName = ReactLineStyleName | VanillaLineStyleName | keyof ModLineStyles;

const styles = getDefaultStyles();
if (styles) {
  styles.react_subheader_horizontal_line = {
    type: "line_style",
    horizontally_stretchable: "on",
    left_margin: -8,
    right_margin: -8,
    top_margin: -2,
    bottom_margin: -2,
    border: {
      border_width: 8,
      horizontal_line: { filename: png_subheader_line, size: [1, 8] },
    },
  };

  styles.react_titlebar_separator_line = {
    type: "line_style",
    top_margin: -2,
    bottom_margin: 2,
  };
}
