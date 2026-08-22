import type { ElementImageSetStruct } from "factorio:prototype";
import { getDefaultStyles } from "./_common";

export type FrameStyles =
  | "react_shallow_frame_in_shallow_frame"
  | "react_deep_frame_in_shallow_frame_stretchable"
  | "react_raised_frame"
  | "react_raised_frame_slot_buttons"
  | "react_frame_slot_buttons_deep"
  | "react_frame_slot_buttons_shallow"
  | "react_table_row_frame"
  | "react_table_row_frame_top"
  | "react_table_row_frame_selected"
  | "frame"
  | "universe_frame"
  | "non_draggable_frame"
  | "invisible_frame"
  | "frame_with_even_paddings"
  | "naked_frame"
  | "outer_frame_without_shadow"
  | "inside_shallow_frame"
  | "shallow_frame_with_light_frame"
  | "bordered_frame"
  | "dark_frame"
  | "deep_frame"
  | "inside_shallow_frame_with_padding"
  | "inside_deep_frame"
  | "inside_deep_frame_for_tabs"
  | "inside_shallow_frame_with_padding_and_vertical_spacing"
  | "deep_frame"
  | "deep_frame_in_shallow_frame"
  | "deep_frame_in_tabbed_pane"
  | "slot_button_deep_frame"
  | "inventory_frame"
  | "quick_panel_slot_button_deep_frame"
  | "filter_frame"
  | "train_inventory_frame"
  | "tooltip_frame"
  | "tooltip_description_frame"
  | "blueprint_tooltip_description_frame"
  | "goal_frame"
  | "goal_inner_frame"
  | "shortcut_bar_window_frame"
  | "quick_bar_inner_panel"
  | "tool_equip_inner_panel"
  | "shortcut_bar_inner_panel"
  | "subfooter_frame"
  | "subfooter_frame_with_left_edge"
  | "tips_and_tricks_info_frame"
  | "tips_and_tricks_info_frame_small_screen"
  | "tips_and_tricks_subfooter"
  | "right_container_frame"
  | "minimap_frame"
  | "side_menu_frame"
  | "achievement_frame"
  | "completed_achievement_frame"
  | "tips_and_tricks_frame"
  | "failed_achievement_frame"
  | "achievement_notification_frame"
  | "tips_and_tricks_notification_frame"
  | "subheader_frame"
  | "repeated_subheader_frame"
  | "subheader_frame_with_text_on_the_right"
  | "negative_subheader_frame"
  | "logistic_section_subheader_frame"
  | "logistic_section_repeated_subheader_frame"
  | "slot_group_frame"
  | "inside_shallow_frame_packed"
  | "slot_window_frame"
  | "quick_bar_slot_window_frame"
  | "technology_card_frame"
  | "research_progress_inner_frame_inactive"
  | "research_progress_inner_frame_active"
  | "shallow_frame"
  | "control_settings_section_frame"
  | "technology_gui_outer_frame"
  | "technology_gui_left_frame"
  | "technology_graph_title_frame"
  | "train_schedule_station_frame"
  | "train_schedule_station_in_interrupt_frame"
  | "train_schedule_temporary_station_frame"
  | "train_schedule_condition_frame"
  | "blueprint_parameter_frame"
  | "train_schedule_fullfilled_condition_frame"
  | "train_schedule_comparison_type_frame"
  | "train_schedule_comparison_type_frame_indented"
  | "train_schedule_comparison_type_frame_extra_indented"
  | "sync_mods_default_status_frame"
  | "sync_mods_downloading_status_frame"
  | "tooltip_title_frame_light"
  | "tooltip_panel_background"
  | "number_input_frame"
  | "neutral_message_frame"
  | "negative_message_frame"
  | "positive_message_frame"
  | "shortcut_selection_row"
  | "frame_tabbed_pane_corner"
  | "frame_tabbed_pane_frame_header"
  | "tabbed_pane_frame"
  | "frame_without_left_side"
  | "frame_without_left_and_right_side"
  | "character_gui_left_side"
  | "search_popup_frame"
  | "bonus_card_frame"
  | "empty_bonus_card_frame"
  | "inset_frame_container_frame"
  | "chart_search_result_frame"
  | "pins_frame"
  | "blueprint_book_edit_frame"
  | "main_progressbar_frame"
  | "editor_mode_selection_frame"
  | "editor_inner_frame"
  | "new_game_subfooter"
  | "entity_frame"
  | "entity_button_frame"
  | "train_with_minimap_frame"
  | "right_side_frame"
  | "decider_combinator_frame"
  | "decider_combinator_condition_frame"
  | "decider_combinator_fulfilled_frame"
  | "decider_combinator_fulfilled_condition_frame"
  | "frame_around_top"
  | "frame_around_bottom"
  | "frame_around_left"
  | "frame_around_right"
  | "frame_around_center"
  | "control_settings_bordered_frame"
  | "train_schedule_partially_fullfilled_condition_frame"
  | "dialog_frame"
  | "flat_frame";

const styles = getDefaultStyles();
if (styles) {
  styles.react_shallow_frame_in_shallow_frame = {
    type: "frame_style",
    parent: "frame",
    padding: 0,
    graphical_set: {
      base: {
        position: [85, 0],
        corner_size: 8,
        center: { position: [76, 8], size: [1, 1] },
        draw_type: "outer",
      },
      shadow: default_inner_shadow,
    },
    vertical_flow_style: {
      type: "vertical_flow_style",
      vertical_spacing: 0,
    },
  };

  styles.react_deep_frame_in_shallow_frame_stretchable = {
    type: "frame_style",
    parent: "deep_frame_in_shallow_frame",
    horizontally_stretchable: "on",
  };

  styles.react_raised_frame = {
    type: "frame_style",
    graphical_set: {
      base: {
        position: [68, 0],
        corner_size: 8,
      },
      shadow: (styles.train_with_minimap_frame.graphical_set as ElementImageSetStruct)?.shadow || default_inner_shadow,
    },
    padding: 4,
  };

  styles.react_raised_frame_slot_buttons = {
    type: "frame_style",
    parent: "react_raised_frame",
    background_graphical_set: {
      position: [282, 17],
      corner_size: 8,
      overall_tiling_vertical_size: 32,
      overall_tiling_vertical_spacing: 8,
      overall_tiling_vertical_padding: 4,
      overall_tiling_horizontal_size: 32,
      overall_tiling_horizontal_spacing: 8,
      overall_tiling_horizontal_padding: 4,
    },
  };

  styles.react_frame_slot_buttons_deep = {
    type: "frame_style",
    graphical_set: { type: "none" },
    background_graphical_set: {
      position: [282, 17],
      corner_size: 8,
      overall_tiling_vertical_size: 40,
      overall_tiling_vertical_spacing: 0,
      overall_tiling_vertical_padding: 0,
      overall_tiling_horizontal_size: 40,
      overall_tiling_horizontal_spacing: 0,
      overall_tiling_horizontal_padding: 0,
    },
    padding: 0,
    margin: 0,
  };

  styles.react_frame_slot_buttons_shallow = {
    type: "frame_style",
    graphical_set: { type: "none" },
    background_graphical_set: {
      position: [256, 136],
      corner_size: 16,
      overall_tiling_vertical_size: 24,
      overall_tiling_vertical_spacing: 16,
      overall_tiling_vertical_padding: 8,
      overall_tiling_horizontal_size: 24,
      overall_tiling_horizontal_spacing: 16,
      overall_tiling_horizontal_padding: 8,
    },
    padding: 0,
    margin: 0,
  };

  styles.react_table_row_frame = {
    type: "frame_style",
    horizontally_stretchable: "on",
    parent: "shallow_frame",
    horizontal_flow_style: {
      type: "horizontal_flow_style",
      vertical_align: "center",
      horizontally_stretchable: "on",
    },
  };

  styles.react_table_row_frame_top = {
    type: "frame_style",
    horizontally_stretchable: "on",
    parent: "shallow_frame",
    horizontal_flow_style: {
      type: "horizontal_flow_style",
      vertical_align: "top",
      horizontally_stretchable: "on",
    },
  };

  styles.react_table_row_frame_selected = {
    type: "frame_style",
    horizontally_stretchable: "on",
    parent: "shallow_frame",
    graphical_set: {
      base: {
        corner_size: 8,
        position: [68, 0],
        tint: [1, 0.6, 0],
      },
    },
    horizontal_flow_style: {
      type: "horizontal_flow_style",
      vertical_align: "center",
      horizontally_stretchable: "on",
    },
  };
}
