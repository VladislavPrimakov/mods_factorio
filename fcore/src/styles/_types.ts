import type { GuiElementType, BaseStyle } from "factorio:runtime";
import type {
  StyleSpecification,
  ButtonStyleSpecification,
  FrameStyleSpecification,
  LabelStyleSpecification,
  TableStyleSpecification,
  FlowStyleSpecification,
  HorizontalFlowStyleSpecification,
  VerticalFlowStyleSpecification,
  TabStyleSpecification,
  TabbedPaneStyleSpecification,
  TextBoxStyleSpecification,
  ScrollPaneStyleSpecification,
  ProgressBarStyleSpecification,
  ImageStyleSpecification,
  DropDownStyleSpecification,
  ListBoxStyleSpecification,
  CheckBoxStyleSpecification,
  SliderStyleSpecification,
  SwitchStyleSpecification,
  LineStyleSpecification,
  CameraStyleSpecification,
  MinimapStyleSpecification,
  EmptyWidgetStyleSpecification,
  Color,
} from "factorio:prototype";

import type { ButtonStyleName, ButtonStyles } from "./ButtonStyle";
import type { FrameStyleName, FrameStyles } from "./FrameStyle";
import type { LabelStyleName, LabelStyles } from "./LabelStyle";
import type { EmptyWidgetStyleName } from "./EmptyWidgetStyle";
import type { FlowStyleName, FlowStyles } from "./FlowStyle";
import type { ScrollPaneStyleName, ScrollPaneStyles } from "./ScrollPaneStyle";
import type { TableStyleName, TableStyles } from "./TableStyle";
import type { TextboxStyleName, TextboxStyles } from "./TextboxStyle";
import type { TabbedPaneStyleName, TabbedPaneStyles } from "./TabbedPaneStyle";
import type { ImageStyleName, ImageStyles } from "./ImageStyle";
import type { CheckboxStyleName } from "./CheckboxStyle";
import type { LineStyleName } from "./LineStyle";
import type { DropdownStyleName } from "./DropdownStyle";
import type { ListboxStyleName } from "./ListboxStyle";
import type { SliderStyleName } from "./SliderStyle";
import type { ProgressbarStyleName, ProgressbarStyles } from "./ProgressbarStyle";
import type { SwitchStyleName } from "./SwitchStyle";
import type { TabStyleName, TabStyles } from "./TabStyle";
import type { CameraStyleName } from "./CameraStyle";
import type { ChooseElemButtonStyleName } from "./ChooseElemButtonStyle";
import type { MinimapStyleName } from "./MinimapStyle";
import type { EntityPreviewStyleName } from "./EntityPreviewStyle";
import type { InventoryStyleName } from "./InventoryStyle";
import type { SLOT_COLORS, INDICATOR_COLORS, ACTION_ICON_VARIANTS } from "./_common";

/* ========================================================================== */
/*                             COMMON COLOR TYPES                             */
/* ========================================================================== */

export type { Color };

export type SlotColor = (typeof SLOT_COLORS)[number];
export type IndicatorColor = (typeof INDICATOR_COLORS)[number];
export type ActionIconVariant = (typeof ACTION_ICON_VARIANTS)[number];

/* ========================================================================== */
/*                       ELEMENT RUNTIME STYLE PROPERTIES                     */
/* ========================================================================== */

export type { ButtonStyles, TableStyles, LabelStyles, TextboxStyles, FlowStyles, FrameStyles, ProgressbarStyles, ScrollPaneStyles, TabStyles, TabbedPaneStyles, ImageStyles };

/**
 * Internal properties and methods on Factorio's C++ `LuaStyle` object that are not visual style overrides.
 */
export type LuaStyleInternalKeys = "valid" | "get_style" | "gui" | "object_name" | "column_alignments";

/**
 * Utility type to clean internal Factorio methods/keys and make all properties optional.
 */
export type CleanStyle<T> = Partial<Omit<T, LuaStyleInternalKeys>>;

/**
 * Base common `LuaStyle` properties shared across ALL Factorio GUI elements.
 */
export type BaseLuaStyle = CleanStyle<BaseStyle>;

/**
 * Default generic LuaStyles property modifier type.
 */
export type LuaStyles = BaseLuaStyle;

/**
 * Mapping of element types that have dedicated/extended LuaStyle properties.
 */
export interface ElementStylesMap {
  button: ButtonStyles;
  "sprite-button": ButtonStyles;
  label: LabelStyles;
  table: TableStyles;
  flow: FlowStyles;
  "tabbed-pane": TabbedPaneStyles;
  frame: FrameStyles;
  progressbar: ProgressbarStyles;
  "scroll-pane": ScrollPaneStyles;
  sprite: ImageStyles;
  tab: TabStyles;
  textfield: TextboxStyles;
  "text-box": TextboxStyles;
}

/**
 * Resolves the strongly-typed `styles` prop object matching a specific GUI element.
 * @example
 * StylesFor<"button">    // -> ButtonStyles (BaseLuaStyle + button-specific colors/offsets)
 * StylesFor<"table">     // -> TableStyles (BaseLuaStyle + cell paddings/spacings)
 */
export type StylesFor<E extends string = string> = E extends keyof ElementStylesMap ? ElementStylesMap[E] : BaseLuaStyle;

/* ========================================================================== */
/*                        PROTOTYPE STYLE NAME MAPPINGS                       */
/* ========================================================================== */

/**
 * Mapping table from each Factorio GUI element type to its corresponding strongly-typed style name union.
 */
export type ElementStyleMap = {
  [K in GuiElementType]: {
    button: ButtonStyleName;
    "sprite-button": ButtonStyleName;
    checkbox: CheckboxStyleName;
    radiobutton: CheckboxStyleName;
    flow: FlowStyleName;
    frame: FrameStyleName;
    label: LabelStyleName;
    line: LineStyleName;
    progressbar: ProgressbarStyleName;
    table: TableStyleName;
    textfield: TextboxStyleName;
    "text-box": TextboxStyleName;
    sprite: ImageStyleName;
    "scroll-pane": ScrollPaneStyleName;
    "drop-down": DropdownStyleName;
    "list-box": ListboxStyleName;
    camera: CameraStyleName;
    "choose-elem-button": ChooseElemButtonStyleName;
    slider: SliderStyleName;
    minimap: MinimapStyleName;
    "entity-preview": EntityPreviewStyleName;
    "empty-widget": EmptyWidgetStyleName;
    "tabbed-pane": TabbedPaneStyleName;
    tab: TabStyleName;
    switch: SwitchStyleName;
    inventory: InventoryStyleName;
  }[K];
};

/**
 * Resolves the valid prototype style name union for a given Factorio GUI element.
 * @example
 * StyleFor<"button">    // -> ButtonStyleName
 * StyleFor<"frame">     // -> FrameStyleName
 */
export type StyleFor<E extends string = string> = E extends GuiElementType ? ElementStyleMap[E] | (string & {}) : string;

/**
 * Global union of all known Factorio GUI prototype style names across all element types.
 */
export type AnyGuiStyleName = ElementStyleMap[keyof ElementStyleMap];

/* ========================================================================== */
/*                      TYPED FACTORIO PROTOTYPE GUISTYLE                     */
/* ========================================================================== */

export type AnyFlowStyleSpecification = FlowStyleSpecification | HorizontalFlowStyleSpecification | VerticalFlowStyleSpecification;

/**
 * Complete strongly-typed GuiStyle map that provides full autocompletion and exact
 * prototype specification types for all known Factorio vanilla and library GUI styles.
 */
export type TypedGuiStyle = {
  [K in ButtonStyleName]: ButtonStyleSpecification;
} & {
  [K in FrameStyleName]: FrameStyleSpecification;
} & {
  [K in LabelStyleName]: LabelStyleSpecification;
} & {
  [K in TableStyleName]: TableStyleSpecification;
} & {
  [K in FlowStyleName]: AnyFlowStyleSpecification;
} & {
  [K in TabStyleName]: TabStyleSpecification;
} & {
  [K in TabbedPaneStyleName]: TabbedPaneStyleSpecification;
} & {
  [K in TextboxStyleName]: TextBoxStyleSpecification;
} & {
  [K in ScrollPaneStyleName]: ScrollPaneStyleSpecification;
} & {
  [K in ProgressbarStyleName]: ProgressBarStyleSpecification;
} & {
  [K in ImageStyleName]: ImageStyleSpecification;
} & {
  [K in DropdownStyleName]: DropDownStyleSpecification;
} & {
  [K in ListboxStyleName]: ListBoxStyleSpecification;
} & {
  [K in CheckboxStyleName]: CheckBoxStyleSpecification;
} & {
  [K in SliderStyleName]: SliderStyleSpecification;
} & {
  [K in SwitchStyleName]: SwitchStyleSpecification;
} & {
  [K in LineStyleName]: LineStyleSpecification;
} & {
  [K in CameraStyleName]: CameraStyleSpecification;
} & {
  [K in MinimapStyleName]: MinimapStyleSpecification;
} & {
  [K in EntityPreviewStyleName]: EmptyWidgetStyleSpecification;
} & {
  [K in EmptyWidgetStyleName]: EmptyWidgetStyleSpecification;
} & {
  [K in ChooseElemButtonStyleName]: ButtonStyleSpecification;
} & {
  [K in InventoryStyleName]: StyleSpecification;
} & {
  [key: string]: StyleSpecification;
};
