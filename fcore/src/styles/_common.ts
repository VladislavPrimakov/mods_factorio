import type { ButtonStyleSpecification, Color } from "factorio:prototype";
import type { TypedGuiStyle } from "./_types";

export const SLOT_COLORS = ["default", "grey", "red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"] as const;
export const INDICATOR_COLORS = ["black", "white", "red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"] as const;
export const ACTION_ICON_VARIANTS = ["black", "white", "disabled"] as const;

export const GRAPHICS_PATH = "__fcore__/graphics/";
export const png_slot_tileset = GRAPHICS_PATH + "slots.png";
export const png_subheader_line = GRAPHICS_PATH + "subheader-line.png";
export const png_frame_action_icons = GRAPHICS_PATH + "frame-action-icons.png";
export const png_indicators = GRAPHICS_PATH + "indicators.png";
export const png_dark_red_button = GRAPHICS_PATH + "dark-red-button.png";

export function getDefaultStyles(): TypedGuiStyle | undefined {
  return data.raw["gui-style"]["default"] as TypedGuiStyle | undefined;
}

export function gen_slot(x: number, y: number, default_offset?: number): ButtonStyleSpecification {
  default_offset = default_offset || 0;
  return {
    type: "button_style",
    parent: "slot",
    size: 40,
    clicked_vertical_offset: 0,
    default_graphical_set: {
      base: {
        border: 4,
        position: [x + default_offset, y],
        size: 80,
        filename: png_slot_tileset,
      },
    },
    hovered_graphical_set: {
      base: {
        border: 4,
        position: [x + 80, y],
        size: 80,
        filename: png_slot_tileset,
      },
    },
    clicked_graphical_set: {
      base: {
        border: 4,
        position: [x + 160, y],
        size: 80,
        filename: png_slot_tileset,
      },
    },
    disabled_graphical_set: {
      base: {
        border: 4,
        position: [x + default_offset, y],
        size: 80,
        filename: png_slot_tileset,
      },
    },
  };
}

export function gen_slot_button(x: number, y: number, default_offset?: number, glow?: Color): ButtonStyleSpecification {
  default_offset = default_offset || 0;
  return {
    type: "button_style",
    parent: "slot_button",
    size: 40,
    clicked_vertical_offset: 0,
    default_graphical_set: {
      base: {
        border: 4,
        position: [x + default_offset, y],
        size: 80,
        filename: png_slot_tileset,
      },
      shadow: offset_by_2_rounded_corners_glow(default_dirt_color),
    },
    hovered_graphical_set: {
      base: {
        border: 4,
        position: [x + 80, y],
        size: 80,
        filename: png_slot_tileset,
      },
      shadow: offset_by_2_rounded_corners_glow(default_dirt_color),
      glow: offset_by_2_rounded_corners_glow(glow),
    },
    clicked_graphical_set: {
      base: {
        border: 4,
        position: [x + 160, y],
        size: 80,
        filename: png_slot_tileset,
      },
      shadow: offset_by_2_rounded_corners_glow(default_dirt_color),
    },
    disabled_graphical_set: {
      base: {
        border: 4,
        position: [x + default_offset, y],
        size: 80,
        filename: png_slot_tileset,
      },
      shadow: offset_by_2_rounded_corners_glow(default_dirt_color),
    },
  };
}

export function gen_standalone_slot_button(x: number, y: number, default_offset?: number): ButtonStyleSpecification {
  default_offset = default_offset || 0;
  return {
    type: "button_style",
    parent: "slot_button",
    size: 40,
    clicked_vertical_offset: 0,
    default_graphical_set: {
      base: {
        border: 4,
        position: [x + default_offset, y],
        size: 80,
        filename: png_slot_tileset,
      },
      shadow: offset_by_4_rounded_corners_shallow_inset,
    },
    hovered_graphical_set: {
      base: {
        border: 4,
        position: [x + 80, y],
        size: 80,
        filename: png_slot_tileset,
      },
      shadow: offset_by_4_rounded_corners_shallow_inset,
    },
    clicked_graphical_set: {
      base: {
        border: 4,
        position: [x + 160, y],
        size: 80,
        filename: png_slot_tileset,
      },
      shadow: offset_by_4_rounded_corners_shallow_inset,
    },
    disabled_graphical_set: {
      base: {
        border: 4,
        position: [x + default_offset, y],
        size: 80,
        filename: png_slot_tileset,
      },
      shadow: offset_by_4_rounded_corners_shallow_inset,
    },
  };
}
