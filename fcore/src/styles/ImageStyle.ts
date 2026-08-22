import type { SpritePrototype } from "factorio:prototype";
import type { IndicatorColor, ActionIconVariant } from "./_common";
import { getDefaultStyles, INDICATOR_COLORS, png_indicators, png_frame_action_icons } from "./_common";

export type IndicatorSpriteName = `react_indicator_${IndicatorColor}`;
type PinSpriteName = `react_pin_${ActionIconVariant}`;
type SettingsSpriteName = `react_settings_${ActionIconVariant}`;

type ReactSpriteName = IndicatorSpriteName | PinSpriteName | SettingsSpriteName;

export type ImageStyles =
  | "react_indicator"
  | "image"
  | "indicator"
  | "achievement_image"
  | "map_info_image"
  | "new_game_info_image"
  | "mod_thumbnail_image"
  | "mod_explore_thumbnail_image"
  | "mod_updates_status_image"
  | "install_mod_status_image"
  | "mod_attribute_image"
  | "tips_and_tricks_image"
  | "logistics_diode"
  | "status_image"
  | "achievement_warning_image"
  | "mods_sorting_image"
  | "recipe_tooltip_horizontal_image"
  | "tool_equip_equipment_image"
  | "current_research_info_image";

const styles = getDefaultStyles();
if (styles) {
  styles.react_indicator = {
    type: "image_style",
    size: 16,
    stretch_image_to_widget_size: true,
  };
}

const indicators: SpritePrototype[] = [];
for (let i = 0; i < INDICATOR_COLORS.length; i++) {
  const color = INDICATOR_COLORS[i];
  indicators.push({
    type: "sprite",
    name: `react_indicator_${color}`,
    filename: png_indicators,
    y: i * 32,
    size: 32,
    flags: ["icon"],
  });
}
data.extend(indicators);

const actionIcons: SpritePrototype[] = [
  {
    type: "sprite",
    name: "react_pin_black",
    filename: png_frame_action_icons,
    position: [0, 0],
    size: 32,
    flags: ["gui-icon"],
  },
  {
    type: "sprite",
    name: "react_pin_white",
    filename: png_frame_action_icons,
    position: [32, 0],
    size: 32,
    flags: ["gui-icon"],
  },
  {
    type: "sprite",
    name: "react_pin_disabled",
    filename: png_frame_action_icons,
    position: [64, 0],
    size: 32,
    flags: ["gui-icon"],
  },
  {
    type: "sprite",
    name: "react_settings_black",
    filename: png_frame_action_icons,
    position: [0, 32],
    size: 32,
    flags: ["gui-icon"],
  },
  {
    type: "sprite",
    name: "react_settings_white",
    filename: png_frame_action_icons,
    position: [32, 32],
    size: 32,
    flags: ["gui-icon"],
  },
  {
    type: "sprite",
    name: "react_settings_disabled",
    filename: png_frame_action_icons,
    position: [64, 32],
    size: 32,
    flags: ["gui-icon"],
  },
];
data.extend(actionIcons);
