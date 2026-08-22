import type { SlotColor, Color } from "./_common";
import { getDefaultStyles, gen_slot, gen_slot_button, gen_standalone_slot_button, png_dark_red_button } from "./_common";

export type ButtonStyles =
  | `react_slot_button_${SlotColor}`
  | `react_selected_slot_button_${SlotColor}`
  | `react_standalone_slot_button_${SlotColor}`
  | `react_selected_standalone_slot_button_${SlotColor}`
  | "react_selected_frame_action_button"
  | "react_selected_tool_button"
  | "react_tool_button_light_green"
  | "react_tool_button_dark_red"
  | "react_invisible_button"
  | "react_tab_button"
  | "button"
  | "confirm_button"
  | "confirm_button_without_tooltip"
  | "confirm_double_arrow_button"
  | "tips_and_tricks_notification_button"
  | "red_confirm_button"
  | "red_back_button"
  | "red_button"
  | "green_button"
  | "back_button"
  | "forward_button"
  | "slot_button"
  | "slot_button_in_shallow_frame"
  | "transparent_slot"
  | "frame_action_button"
  | "close_button"
  | "action_button"
  | "mini_button"
  | "mini_button_aligned_to_text_vertically_when_centered"
  | "mini_button_aligned_to_text_vertically_when_centered_with_extra_bottom_margin"
  | "rounded_button"
  | "rounded_button_without_padding"
  | "tool_button"
  | "tool_button_red"
  | "tool_button_green"
  | "tool_button_blue"
  | "mini_button"
  | "mini_button_aligned_to_text_vertically"
  | "mini_button_aligned_to_text_vertically_when_centered"
  | "mini_tool_button_red"
  | "highlighted_tool_button"
  | "confirm_in_load_game_button"
  | "back_button"
  | "forward_button"
  | "menu_button"
  | "menu_button_continue"
  | "side_menu_button"
  | "dialog_button"
  | "control_settings_button"
  | "control_settings_section_button"
  | "quick_bar_page_button"
  | "slot_button_in_shallow_frame"
  | "yellow_slot_button"
  | "red_slot_button"
  | "slot_sized_button"
  | "compact_slot_sized_button"
  | "slot_sized_button_blue"
  | "slot_sized_button_red"
  | "slot_sized_button_green"
  | "shortcut_bar_button"
  | "shortcut_bar_button_blue"
  | "shortcut_bar_button_red"
  | "shortcut_bar_button_green"
  | "shortcut_bar_button_small"
  | "shortcut_bar_button_small_green"
  | "shortcut_bar_button_small_red"
  | "shortcut_bar_button_small_blue"
  | "compact_slot"
  | "slot"
  | "red_slot"
  | "yellow_slot"
  | "green_slot"
  | "blue_slot"
  | "inventory_slot"
  | "filter_inventory_slot"
  | "closed_inventory_slot"
  | "red_inventory_slot"
  | "yellow_inventory_slot"
  | "filter_group_button_tab_slightly_larger"
  | "blueprint_record_slot_button"
  | "blueprint_record_selection_button"
  | "compact_red_slot"
  | "inventory_limit_slot_button"
  | "working_weapon_button"
  | "not_working_weapon_button"
  | "transparent_button"
  | "transparent_slot"
  | "universe_connection_button"
  | "universe_platform_button"
  | "frame_action_button"
  | "train_schedule_action_button"
  | "train_schedule_delete_button"
  | "train_schedule_collapse_button"
  | "shortcut_bar_expand_button"
  | "open_armor_button"
  | "item_and_count_select_confirm"
  | "tool_bar_open_button"
  | "map_view_add_button"
  | "tool_equip_ammo_slot"
  | "choose_chat_icon_button"
  | "choose_chat_icon_in_textbox_button"
  | "decider_combinator_signal_select_button"
  | "decider_combinator_fulfilled_signal_select_button"
  | "add_logistic_section_button"
  | "omitted_technology_slot"
  | "crafting_queue_slot"
  | "promised_crafting_queue_slot"
  | "image_tab_slot"
  | "image_tab_selected_slot"
  | "red_circuit_network_content_slot"
  | "green_circuit_network_content_slot"
  | "drop_target_button"
  | "minimap_slot"
  | "locomotive_minimap_button"
  | "browse_games_gui_toggle_favorite_on_button"
  | "browse_games_gui_toggle_favorite_off_button"
  | "research_queue_cancel_button"
  | "new_game_header_list_box_item"
  | "list_box_item"
  | "train_status_button"
  | "station_train_status_button"
  | "title_tip_item"
  | "default_permission_group_list_box_item"
  | "target_station_in_schedule_in_train_view_list_box_item"
  | "no_path_station_in_schedule_in_train_view_list_box_item"
  | "not_accessible_station_in_station_selection"
  | "partially_accessible_station_in_station_selection"
  | "other_settings_gui_button"
  | "map_generator_preview_button"
  | "map_generator_close_preview_button"
  | "map_generator_confirm_button"
  | "train_schedule_comparison_type_button"
  | "train_schedule_add_wait_condition_button"
  | "train_schedule_add_station_button"
  | "train_schedule_add_interrupt_station_button"
  | "train_schedule_item_select_button"
  | "train_schedule_fulfilled_item_select_button"
  | "train_schedule_fulfilled_delete_button"
  | "train_schedule_temporary_station_delete_button"
  | "train_schedule_condition_time_selection_button"
  | "entity_variation_button"
  | "tile_variation_button"
  | "cancel_close_button"
  | "close_button"
  | "mods_filter_exclude_button"
  | "lab_research_info_button"
  | "current_research_info_button"
  | "train_schedule_partially_fulfilled_delete_button"
  | "train_schedule_partially_fulfilled_item_select_button"
  | "cancel_button"
  | "rounded_button"
  | "side_menu_slot_button";

const styles = getDefaultStyles();
if (styles) {
  const slot_data: { name: string; y: number; glow: Color }[] = [
    { name: "default", y: 0, glow: default_glow_color },
    { name: "grey", y: 80, glow: default_glow_color },
    { name: "red", y: 160, glow: [230, 135, 135] },
    { name: "orange", y: 240, glow: [216, 169, 122] },
    { name: "yellow", y: 320, glow: [230, 218, 135] },
    { name: "green", y: 400, glow: [153, 230, 135] },
    { name: "cyan", y: 480, glow: [135, 230, 230] },
    { name: "blue", y: 560, glow: [135, 186, 230] },
    { name: "purple", y: 640, glow: [188, 135, 230] },
    { name: "pink", y: 720, glow: [230, 135, 230] },
  ];

  for (const data of slot_data) {
    styles["react_slot_" + data.name] = gen_slot(0, data.y);
    styles["react_selected_slot_" + data.name] = gen_slot(0, data.y, 80);
    styles["react_slot_button_" + data.name] = gen_slot_button(240, data.y, 0, data.glow);
    styles["react_selected_slot_button_" + data.name] = gen_slot_button(240, data.y, 80, data.glow);
    styles["react_standalone_slot_button_" + data.name] = gen_standalone_slot_button(240, data.y);
    styles["react_selected_standalone_slot_button_" + data.name] = gen_standalone_slot_button(240, data.y, 80);
  }

  styles.react_selected_frame_action_button = {
    type: "button_style",
    parent: "frame_action_button",
    default_font_color: button_hovered_font_color,
    default_graphical_set: {
      base: { position: [225, 17], corner_size: 8 },
      shadow: { position: [440, 24], corner_size: 8, draw_type: "outer" },
    },
    hovered_font_color: button_hovered_font_color,
    hovered_graphical_set: {
      base: { position: [369, 17], corner_size: 8 },
      shadow: { position: [440, 24], corner_size: 8, draw_type: "outer" },
    },
    clicked_font_color: button_hovered_font_color,
    clicked_graphical_set: {
      base: { position: [352, 17], corner_size: 8 },
      shadow: { position: [440, 24], corner_size: 8, draw_type: "outer" },
    },
    top_padding: 1,
    bottom_padding: -1,
    clicked_vertical_offset: 0,
  };

  styles.react_selected_tool_button = {
    type: "button_style",
    parent: "tool_button",
    default_font_color: styles.button.selected_font_color,
    default_graphical_set: styles.button.selected_graphical_set,
    hovered_font_color: styles.button.selected_hovered_font_color,
    hovered_graphical_set: styles.button.selected_hovered_graphical_set,
    clicked_font_color: styles.button.selected_clicked_font_color,
    clicked_graphical_set: styles.button.selected_clicked_graphical_set,
    top_padding: 1,
    bottom_padding: -1,
    clicked_vertical_offset: 0,
  };

  styles.react_tool_button_light_green = {
    type: "button_style",
    parent: "item_and_count_select_confirm",
    padding: 2,
    top_margin: 0,
    tooltip: "",
  };

  styles.react_tool_button_dark_red = {
    type: "button_style",
    parent: "tool_button",
    default_graphical_set: {
      base: {
        filename: png_dark_red_button,
        position: [0, 0],
        corner_size: 8,
      },
      shadow: default_dirt,
    },
    hovered_graphical_set: {
      base: {
        filename: png_dark_red_button,
        position: [17, 0],
        corner_size: 8,
      },
      shadow: default_dirt,
      glow: default_glow([236, 130, 130, 127], 0.5),
    },
    clicked_graphical_set: {
      base: {
        filename: png_dark_red_button,
        position: [34, 0],
        corner_size: 8,
      },
      shadow: default_dirt,
    },
  };

  styles.react_invisible_button = {
    type: "button_style",
    default_graphical_set: {
      base: { type: "none" },
    },
    hovered_graphical_set: {
      base: { type: "none" },
    },
    clicked_graphical_set: {
      base: { type: "none" },
    },
    disabled_graphical_set: {
      base: { type: "none" },
    },
    selected_graphical_set: {
      base: { type: "none" },
    },
    selected_hovered_graphical_set: {
      base: { type: "none" },
    },
    game_controller_selected_hovered_graphical_set: {
      base: { type: "none" },
    },
    selected_clicked_graphical_set: {
      base: { type: "none" },
    },
    default_font_color: [1, 1, 1],
    hovered_font_color: [1, 1, 1],
    clicked_font_color: [1, 1, 1],
    disabled_font_color: [1, 1, 1],
    selected_font_color: [1, 1, 1],
    selected_hovered_font_color: [1, 1, 1],
    selected_clicked_font_color: [1, 1, 1],
    strikethrough_color: [1, 1, 1],
    pie_progress_color: [1, 1, 1],
    clicked_vertical_offset: 0,
    padding: 0,
    margin: 0,
  };

  styles.react_tab_button = {
    type: "button_style",
    parent: "button",
    font: styles.tab.font || "default-bold",
    default_font_color: styles.tab.default_font_color,
    default_graphical_set: styles.tab.default_graphical_set,
    hovered_graphical_set: styles.tab.hovered_graphical_set,
    clicked_graphical_set: styles.tab.clicked_graphical_set,
    selected_font_color: styles.tab.selected_font_color,
    selected_graphical_set: styles.tab.selected_graphical_set,
    selected_hovered_graphical_set: styles.tab.selected_hovered_graphical_set,
    selected_clicked_graphical_set: styles.tab.selected_clicked_graphical_set,
    disabled_font_color: styles.tab.disabled_font_color,
    disabled_graphical_set: styles.tab.disabled_graphical_set,
    left_padding: 12,
    right_padding: 12,
    top_padding: 0,
    bottom_padding: 0,
    margin: 0,
    height: 36,
    minimal_height: 36,
    maximal_height: 36,
    minimal_width: 0,
    clicked_vertical_offset: 0,
    draw_shadow_under_picture: true,
  };

  styles.tab_selected = styles.react_tab_button;
  styles.tab_button = styles.react_tab_button;
}
