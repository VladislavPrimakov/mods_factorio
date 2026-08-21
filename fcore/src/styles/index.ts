// 1. Runtime registration of prototype styles on `data.raw["gui-style"]`
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

// 2. Extension interfaces for module augmentation by consumer mods
export type { ModButtonStyles } from "./ButtonStyle";
export type { ModCameraStyles } from "./CameraStyle";
export type { ModCheckboxStyles } from "./CheckboxStyle";
export type { ModChooseElemButtonStyles } from "./ChooseElemButtonStyle";
export type { ModDropdownStyles } from "./DropdownStyle";
export type { ModEmptyWidgetStyles } from "./EmptyWidgetStyle";
export type { ModEntityPreviewStyles } from "./EntityPreviewStyle";
export type { ModFlowStyles } from "./FlowStyle";
export type { ModFrameStyles } from "./FrameStyle";
export type { ModImageStyles, ModSprites } from "./ImageStyle";
export type { ModInventoryStyles } from "./InventoryStyle";
export type { ModLabelStyles } from "./LabelStyle";
export type { ModLineStyles } from "./LineStyle";
export type { ModListboxStyles } from "./ListboxStyle";
export type { ModMinimapStyles } from "./MinimapStyle";
export type { ModProgressbarStyles } from "./ProgressbarStyle";
export type { ModScrollPaneStyles } from "./ScrollPaneStyle";
export type { ModSliderStyles } from "./SliderStyle";
export type { ModSwitchStyles } from "./SwitchStyle";
export type { ModTabStyles } from "./TabStyle";
export type { ModTabbedPaneStyles } from "./TabbedPaneStyle";
export type { ModTableStyles } from "./TableStyle";
export type { ModTextboxStyles } from "./TextboxStyle";

// 3. Common color and variant types
export type { SlotColor, IndicatorColor, ActionIconVariant, Color } from "./_types";

// 4. Universal style helpers
export type { StyleFor, StylesFor, AnyGuiStyleName, LuaStyles, BaseLuaStyle, TypedGuiStyle } from "./_types";
