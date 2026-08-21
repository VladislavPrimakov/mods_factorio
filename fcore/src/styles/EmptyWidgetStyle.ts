import { getDefaultStyles } from "./_common";

export type ReactEmptyWidgetStyleName =
  | "react_dialog_footer_drag_handle"
  | "react_dialog_footer_drag_handle_no_right"
  | "react_dialog_titlebar_drag_handle"
  | "react_horizontal_pusher"
  | "react_titlebar_drag_handle"
  | "react_vertical_pusher";

export type VanillaEmptyWidgetStyleName =
  | "empty_widget"
  | "tips_and_tricks_simulation"
  | "entity_button_base"
  | "undo_camera"
  | "tooltip_camera"
  | "wide_entity_button"
  | "fulfilled_draggable_space_in_train_schedule"
  | "color_indicator"
  | "minimap_widget_under_subheader"
  | "blueprint_preview"
  | "entity_frame_filler"
  | "tool_bar_empty_slot"
  | "research_queue_drag_handle"
  | "blueprint_drop_slot_button"
  | "blueprint_icon_preview"
  | "draggable_space"
  | "draggable_space_in_shortcut_list"
  | "draggable_space_in_temporary_train_station"
  | "draggable_space_in_train_schedule"
  | "partially_fulfilled_draggable_space_in_train_schedule";

/**
 * Extension interface for mods to register custom empty widget styles.
 */
export interface ModEmptyWidgetStyles {}

export type EmptyWidgetStyleName = ReactEmptyWidgetStyleName | VanillaEmptyWidgetStyleName | keyof ModEmptyWidgetStyles;

const styles = getDefaultStyles();
if (styles) {
  styles.react_dialog_footer_drag_handle = {
    type: "empty_widget_style",
    parent: "draggable_space",
    height: 32,
    horizontally_stretchable: "on",
  };

  styles.react_dialog_footer_drag_handle_no_right = {
    type: "empty_widget_style",
    parent: "react_dialog_footer_drag_handle",
    right_margin: 0,
  };

  styles.react_titlebar_drag_handle = {
    type: "empty_widget_style",
    parent: "draggable_space",
    left_margin: 4,
    right_margin: 4,
    height: 24,
    horizontally_stretchable: "on",
  };

  styles.react_dialog_titlebar_drag_handle = {
    type: "empty_widget_style",
    parent: "react_titlebar_drag_handle",
    right_margin: 0,
  };

  styles.react_horizontal_pusher = {
    type: "empty_widget_style",
    horizontally_stretchable: "on",
  };

  styles.react_vertical_pusher = {
    type: "empty_widget_style",
    vertically_stretchable: "on",
  };
}
