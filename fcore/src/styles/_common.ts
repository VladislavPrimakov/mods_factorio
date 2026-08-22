import type { GuiElementType, BaseStyle, ButtonStyle, FlowStyle, FrameStyle, ImageStyle, LabelStyle, ProgressBarStyle, ScrollPaneStyle, TableStyle } from "factorio:runtime";
import type { ButtonStyleSpecification, Color, StyleSpecification } from "factorio:prototype";

import type { ButtonStyles } from "./ButtonStyle";
import type { FrameStyles } from "./FrameStyle";
import type { LabelStyles } from "./LabelStyle";
import type { EmptyWidgetStyles } from "./EmptyWidgetStyle";
import type { FlowStyles } from "./FlowStyle";
import type { ScrollPaneStyles } from "./ScrollPaneStyle";
import type { TableStyles } from "./TableStyle";
import type { TextboxStyles } from "./TextboxStyle";
import type { TabbedPaneStyles } from "./TabbedPaneStyle";
import type { ImageStyles } from "./ImageStyle";
import type { CheckboxStyles } from "./CheckboxStyle";
import type { LineStyles } from "./LineStyle";
import type { DropdownStyles } from "./DropdownStyle";
import type { ListboxStyles } from "./ListboxStyle";
import type { SliderStyles } from "./SliderStyle";
import type { ProgressbarStyles } from "./ProgressbarStyle";
import type { SwitchStyles } from "./SwitchStyle";
import type { TabStyles } from "./TabStyle";
import type { CameraStyles } from "./CameraStyle";
import type { ChooseElemButtonStyles } from "./ChooseElemButtonStyle";
import type { MinimapStyles } from "./MinimapStyle";
import type { EntityPreviewStyles } from "./EntityPreviewStyle";
import type { InventoryStyles } from "./InventoryStyle";

/* ========================================================================== */
/*                             COLOR & ASSET CONSTANTS                        */
/* ========================================================================== */

export const SLOT_COLORS = ["default", "grey", "red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"] as const;

export const INDICATOR_COLORS = ["black", "white", "red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"] as const;

export const ACTION_ICON_VARIANTS = ["black", "white", "disabled"] as const;

export type SlotColor = (typeof SLOT_COLORS)[number];
export type IndicatorColor = (typeof INDICATOR_COLORS)[number];
export type ActionIconVariant = (typeof ACTION_ICON_VARIANTS)[number];
export type { Color };

export const GRAPHICS_PATH = "__fcore__/graphics/";
export const png_slot_tileset = GRAPHICS_PATH + "slots.png";
export const png_subheader_line = GRAPHICS_PATH + "subheader-line.png";
export const png_frame_action_icons = GRAPHICS_PATH + "frame-action-icons.png";
export const png_indicators = GRAPHICS_PATH + "indicators.png";
export const png_dark_red_button = GRAPHICS_PATH + "dark-red-button.png";

/* ========================================================================== */
/*                       ELEMENT RUNTIME STYLE PROPERTIES                     */
/* ========================================================================== */

export type LuaStyleInternalKeys = "valid" | "get_style" | "gui" | "object_name" | "column_alignments";
export type CleanStyle<T> = Partial<Omit<T, LuaStyleInternalKeys>>;
export type BaseLuaStyle = CleanStyle<BaseStyle>;
export type LuaStyles = BaseLuaStyle;

export interface ElementStylesMap {
  button: CleanStyle<ButtonStyle>;
  "sprite-button": CleanStyle<ButtonStyle>;
  label: CleanStyle<LabelStyle>;
  table: CleanStyle<TableStyle>;
  flow: CleanStyle<FlowStyle>;
  frame: CleanStyle<FrameStyle>;
  progressbar: CleanStyle<ProgressBarStyle>;
  "scroll-pane": CleanStyle<ScrollPaneStyle>;
  sprite: CleanStyle<ImageStyle>;
}

export type StylesFor<E extends string = string> = E extends keyof ElementStylesMap ? ElementStylesMap[E] : BaseLuaStyle;

/* ========================================================================== */
/*                             PROTOTYPE HELPERS                              */
/* ========================================================================== */

export function getDefaultStyles(): Record<string, any> | undefined {
  return data.raw?.["gui-style"]?.["default"];
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

/* ========================================================================== */
/*                       PROTOTYPE STYLE MAPPINGS                             */
/* ========================================================================== */

export type ElementStyleMap = {
  [K in GuiElementType]: {
    button: ButtonStyles;
    "sprite-button": ButtonStyles;
    checkbox: CheckboxStyles;
    radiobutton: CheckboxStyles;
    flow: FlowStyles;
    frame: FrameStyles;
    label: LabelStyles;
    line: LineStyles;
    progressbar: ProgressbarStyles;
    table: TableStyles;
    textfield: TextboxStyles;
    "text-box": TextboxStyles;
    sprite: ImageStyles;
    "scroll-pane": ScrollPaneStyles;
    "drop-down": DropdownStyles;
    "list-box": ListboxStyles;
    camera: CameraStyles;
    "choose-elem-button": ChooseElemButtonStyles;
    slider: SliderStyles;
    minimap: MinimapStyles;
    "entity-preview": EntityPreviewStyles;
    "empty-widget": EmptyWidgetStyles;
    "tabbed-pane": TabbedPaneStyles;
    tab: TabStyles;
    switch: SwitchStyles;
    inventory: InventoryStyles;
  }[K];
};

export type StyleFor<E extends string = string> = E extends GuiElementType ? ElementStyleMap[E] | (string & {}) : string;
