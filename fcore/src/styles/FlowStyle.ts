import type { FlowStyle as FactorioFlowStyle } from "factorio:runtime";
import type { CleanStyle } from "./_types";
import { getDefaultStyles } from "./_common";

export type FlowStyles = CleanStyle<FactorioFlowStyle>;

export type ReactFlowStyleName = "react_indicator_flow" | "react_titlebar_flow";

export type VanillaFlowStyleName =
  | "flow"
  | "horizontal_flow"
  | "vertical_flow"
  | "packed_horizontal_flow"
  | "compact_horizontal_flow"
  | "dialog_buttons_horizontal_flow"
  | "player_input_horizontal_flow"
  | "inset_frame_container_horizontal_flow"
  | "inset_frame_container_horizontal_flow_in_tabbed_pane"
  | "train_schedule_mode_switch_horizontal_flow"
  | "horizontal_flow_with_extra_right_margin"
  | "relative_gui_top_flow"
  | "relative_gui_bottom_flow"
  | "two_module_spacing_horizontal_flow"
  | "relative_gui_left_flow"
  | "relative_gui_right_flow"
  | "packed_vertical_flow"
  | "padded_vertical_flow"
  | "quickbar_holder_flow"
  | "inset_frame_container_vertical_flow"
  | "two_module_spacing_vertical_flow"
  | "new_game_difficulty_vertical_flow"
  | "crafting_queue_flow"
  | "centering_horizontal_flow";

/**
 * Extension interface for mods to register custom flow styles.
 */
export interface ModFlowStyles {}

export type FlowStyleName = ReactFlowStyleName | VanillaFlowStyleName | keyof ModFlowStyles;

const styles = getDefaultStyles();
if (styles) {
  styles.react_indicator_flow = {
    type: "horizontal_flow_style",
    vertical_align: "center",
  };

  styles.react_titlebar_flow = {
    type: "horizontal_flow_style",
    horizontal_spacing: 8,
  };
}
