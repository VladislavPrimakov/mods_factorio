// 1. Prototype registration (side-effects on data.raw["gui-style"])
import "./ButtonStyle";
import "./FrameStyle";
import "./LabelStyle";
import "./EmptyWidgetStyle";
import "./FlowStyle";
import "./ScrollPaneStyle";
import "./TableStyle";
import "./TextboxStyle";
import "./TabbedPaneStyle";
import "./ImageStyle";
import "./LineStyle";
import "./CheckboxStyle";

// 2. Element style names per GUI element
export type { ButtonStyles } from "./ButtonStyle";
export type { CameraStyles } from "./CameraStyle";
export type { CheckboxStyles } from "./CheckboxStyle";
export type { ChooseElemButtonStyles } from "./ChooseElemButtonStyle";
export type { DropdownStyles } from "./DropdownStyle";
export type { EmptyWidgetStyles } from "./EmptyWidgetStyle";
export type { EntityPreviewStyles } from "./EntityPreviewStyle";
export type { FlowStyles } from "./FlowStyle";
export type { FrameStyles } from "./FrameStyle";
export type { ImageStyles, IndicatorSpriteName } from "./ImageStyle";
export type { InventoryStyles } from "./InventoryStyle";
export type { LabelStyles } from "./LabelStyle";
export type { LineStyles } from "./LineStyle";
export type { ListboxStyles } from "./ListboxStyle";
export type { MinimapStyles } from "./MinimapStyle";
export type { ProgressbarStyles } from "./ProgressbarStyle";
export type { ScrollPaneStyles } from "./ScrollPaneStyle";
export type { SliderStyles } from "./SliderStyle";
export type { SwitchStyles } from "./SwitchStyle";
export type { TabStyles } from "./TabStyle";
export type { TabbedPaneStyles } from "./TabbedPaneStyle";
export type { TableStyles } from "./TableStyle";
export type { TextboxStyles } from "./TextboxStyle";

// 3. Resolution & runtime style types
export type { Color, SlotColor, IndicatorColor, LuaStyles, StylesFor, StyleFor } from "./_common";

// 4. Public constants & prototype helpers
export { SLOT_COLORS, INDICATOR_COLORS, getDefaultStyles } from "./_common";
