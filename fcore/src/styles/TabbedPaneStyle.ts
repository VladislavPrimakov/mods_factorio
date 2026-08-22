import { getDefaultStyles } from "./_common";

export type TabbedPaneStyles =
  | "react_tabbed_pane"
  | "react_tabbed_pane_with_no_padding"
  | "tabbed_pane"
  | "tabbed_pane_frame"
  | "filter_tabbed_pane"
  | "frame_tabbed_pane"
  | "quick_panel_tabbed_pane"
  | "tabbed_pane_with_no_side_padding"
  | "tabbed_pane_with_extra_padding";

const styles = getDefaultStyles();
if (styles) {
  styles.react_tabbed_pane_with_no_padding = {
    type: "tabbed_pane_style",
    tab_content_frame: {
      type: "frame_style",
      top_padding: 0,
      bottom_padding: 0,
      left_padding: 0,
      right_padding: 0,
      graphical_set: {
        base: {
          top: { position: [76, 0], size: [1, 8] },
          center: { position: [76, 8], size: [1, 1] },
        },
        shadow: top_shadow,
      },
    },
  };

  styles.react_tabbed_pane = {
    type: "tabbed_pane_style",
    tab_content_frame: {
      type: "frame_style",
      parent: "tabbed_pane_frame",
      left_padding: 12,
      right_padding: 12,
      bottom_padding: 8,
    },
  };
}
