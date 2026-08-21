import type { ScrollPaneStyle as FactorioScrollPaneStyle } from "factorio:runtime";
import type { CleanStyle } from "./_types";
import { getDefaultStyles } from "./_common";

export type ScrollPaneStyles = CleanStyle<FactorioScrollPaneStyle>;

export type ReactScrollPaneStyleName =
  "react_naked_scroll_pane" | "react_naked_scroll_pane_under_tabs" | "react_naked_scroll_pane_no_padding" | "react_shallow_scroll_pane" | "react_table_scroll_pane";

export type VanillaScrollPaneStyleName =
  | "scroll_pane"
  | "notice_scroll_pane"
  | "pins_scroll_pane"
  | "scroll_pane_in_shallow_frame"
  | "trains_scroll_pane"
  | "trains_scroll_pane_with_side_margin"
  | "stations_scroll_pane"
  | "stations_scroll_pane_small_screen"
  | "tab_scroll_pane"
  | "technology_list_scroll_pane"
  | "statistics_scroll_pane"
  | "blurry_scroll_pane"
  | "map_preview_scroll_pane"
  | "tab_shallow_scroll_pane"
  | "featured_technology_description_scroll_pane"
  | "scroll_pane_under_subheader"
  | "train_schedule_scroll_pane"
  | "train_interrupts_scroll_pane"
  | "mods_scroll_pane"
  | "stations_trains_scroll_pane"
  | "entity_frame_scroll_pane"
  | "shallow_scroll_pane"
  | "shallow_slots_scroll_pane"
  | "deep_scroll_pane"
  | "deep_scroll_pane_with_padding"
  | "deep_slots_scroll_pane"
  | "achievement_slots_scroll_pane"
  | "logistic_sections_scroll_pane"
  | "character_crafting_queue_scroll_pane"
  | "logistic_gui_items_scroll_pane"
  | "shortcut_bar_selection_scroll_pane"
  | "naked_scroll_pane"
  | "horizontally_limited_equipment_grid_scroll_pane"
  | "text_holding_scroll_pane"
  | "factoriopedia_contents_scroll_pane"
  | "factoriopedia_icon_grid_scroll_pane"
  | "decider_combinator_conditions_scroll_pane"
  | "decider_combinator_outputs_scroll_pane"
  | "mappers_scroll_pane"
  | "bare_scroll_pane";

/**
 * Extension interface for mods to register custom scroll pane styles.
 */
export interface ModScrollPaneStyles {}

export type ScrollPaneStyleName = ReactScrollPaneStyleName | VanillaScrollPaneStyleName | keyof ModScrollPaneStyles;

const styles = getDefaultStyles();
if (styles) {
  styles.react_naked_scroll_pane = {
    type: "scroll_pane_style",
    extra_padding_when_activated: 0,
    padding: 12,
    graphical_set: {
      shadow: default_inner_shadow,
    },
  };

  styles.react_naked_scroll_pane_under_tabs = {
    type: "scroll_pane_style",
    parent: "react_naked_scroll_pane",
    graphical_set: {
      base: {
        top: { position: [93, 0], size: [1, 8] },
        draw_type: "outer",
      },
      shadow: default_inner_shadow,
    },
  };

  styles.react_naked_scroll_pane_no_padding = {
    type: "scroll_pane_style",
    parent: "react_naked_scroll_pane",
    padding: 0,
  };

  styles.react_shallow_scroll_pane = {
    type: "scroll_pane_style",
    padding: 0,
    graphical_set: {
      base: { position: [85, 0], corner_size: 8, draw_type: "outer" },
      shadow: default_inner_shadow,
    },
  };

  styles.react_table_scroll_pane = {
    type: "scroll_pane_style",
    parent: "react_naked_scroll_pane_no_padding",
    vertical_flow_style: {
      type: "vertical_flow_style",
      vertically_stretchable: "on",
      horizontally_stretchable: "on",
      vertical_spacing: 0,
    },
  };
}
