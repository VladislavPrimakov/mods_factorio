import { getDefaultStyles } from "./_common";

export type LabelStyles =
  | "react_frame_title"
  | "react_label_signal_count"
  | "react_label_signal_count_upper"
  | "react_semibold_label"
  | "react_large_semibold_label"
  | "react_multiline_label"
  | "label"
  | "current_research_info_percent_label"
  | "frame_title"
  | "caption_label"
  | "semibold_caption_label"
  | "semibold_label"
  | "bold_label"
  | "green_label"
  | "bold_black_label"
  | "bold_green_label"
  | "red_label"
  | "bold_red_label"
  | "electric_usage_label"
  | "count_label"
  | "recipe_count_line_label"
  | "recipe_ghost_count_line_label"
  | "tooltip_label"
  | "tooltip_title_label"
  | "subheader_label"
  | "subheader_caption_label"
  | "subheader_semibold_label"
  | "subheader_right_aligned_label"
  | "heading_1_label"
  | "heading_2_label"
  | "heading_3_label"
  | "achievement_unlocked_title_label"
  | "achievement_locked_title_label"
  | "achievement_failed_title_label"
  | "achievement_failed_description_label"
  | "achievement_failed_reason_label"
  | "tips_and_tricks_title_label"
  | "steam_friend_label"
  | "frame_subheading_label"
  | "orange_label"
  | "bold_orange_label"
  | "purple_label"
  | "grey_label"
  | "bold_grey_label"
  | "tooltip_heading_label"
  | "tooltip_heading_label_category"
  | "squashable_label"
  | "black_label"
  | "black_squashable_label"
  | "black_label_with_left_padding"
  | "black_squashable_label_with_left_padding"
  | "black_clickable_label"
  | "black_clickable_squashable_label"
  | "color_picker_label"
  | "tooltip_item_label"
  | "clickable_label"
  | "clickable_squashable_label"
  | "label_with_left_padding"
  | "squashable_label_with_left_padding"
  | "train_schedule_unavailable_stop_label"
  | "train_schedule_non_existent_stop_label"
  | "hyperlink_label"
  | "info_label"
  | "control_input_shortcut_label"
  | "main_menu_version_label"
  | "label_under_widget"
  | "finished_game_label"
  | "train_stop_subheader"
  | "inventory_frame_title_style"
  | "mods_filter_hit_count_label"
  | "slot_column_header_label"
  | "description_label"
  | "label_with_bold_title";

const styles = getDefaultStyles();
if (styles) {
  styles.react_frame_title = {
    type: "label_style",
    parent: "frame_title",
    bottom_padding: 3,
    top_margin: -3,
  };

  styles.react_label_signal_count = {
    type: "label_style",
    parent: "count_label",
    size: 36,
    horizontal_align: "right",
    vertical_align: "bottom",
    right_padding: 2,
    parent_hovered_font_color: [1, 1, 1],
  };

  styles.react_label_signal_count_upper = {
    type: "label_style",
    parent: "count_label",
    width: 36,
    height: 24,
    horizontal_align: "right",
    vertical_align: "bottom",
    right_padding: 2,
    parent_hovered_font_color: [1, 1, 1],
  };

  styles.react_semibold_label = {
    type: "label_style",
    parent: "label",
    font: "default-semibold",
  };

  styles.react_large_semibold_label = {
    type: "label_style",
    parent: "label",
    font: "default-large-semibold",
  };

  styles.react_multiline_label = {
    type: "label_style",
    parent: "label",
    single_line: false,
  };
}
