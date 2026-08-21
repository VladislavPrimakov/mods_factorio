import type { TableStyle as FactorioTableStyle } from "factorio:runtime";
import type { CleanStyle } from "./_types";
import { getDefaultStyles } from "./_common";

export type TableStyles = CleanStyle<FactorioTableStyle>;

export type ReactTableStyleName = "react_table_white_lines";

export type VanillaTableStyleName =
  | "table"
  | "slot_table"
  | "compact_slot_table"
  | "bordered_table"
  | "table_with_selection"
  | "players_table"
  | "mods_explore_results_table"
  | "browse_games_table"
  | "browse_games_on_lan_table"
  | "inset_frame_container_table"
  | "map_generator_frequency_table"
  | "player_input_table"
  | "graphics_settings_table"
  | "control_settings_bordered_table"
  | "sync_mods_table"
  | "removed_content_table"
  | "finished_game_table"
  | "filter_slot_table"
  | "editor_mode_selection_table"
  | "splitter_settings_table"
  | "trains_widget_table"
  | "undelete_space_platforms_table"
  | "research_queue_table"
  | "mappers_table";

/**
 * Extension interface for mods to register custom table styles.
 */
export interface ModTableStyles {}

export type TableStyleName = ReactTableStyleName | VanillaTableStyleName | keyof ModTableStyles;

const styles = getDefaultStyles();
if (styles) {
  styles.react_table_white_lines = {
    type: "table_style",
    horizontal_line_color: [1, 1, 1],
    vertical_line_color: [1, 1, 1],
    top_cell_padding: 1,
    bottom_cell_padding: 2,
    left_cell_padding: 3,
    right_cell_padding: 2,
  };
}
