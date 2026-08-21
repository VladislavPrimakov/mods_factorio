import type { TextBoxStyle as FactorioTextBoxStyle } from "factorio:runtime";
import type { CleanStyle } from "./_types";
import { getDefaultStyles } from "./_common";

export type TextboxStyles = CleanStyle<FactorioTextBoxStyle>;

export type ReactTextboxStyleName = "react_widthless_textfield" | "react_widthless_invalid_textfield" | "react_titlebar_search_textfield";

export type VanillaTextboxStyleName =
  | "textbox"
  | "textfield"
  | "changelog_textbox"
  | "console_input_textfield"
  | "invalid_value_textfield"
  | "highlighted_value_textfield"
  | "mod_startup_settings_mismatch_notice_box"
  | "notice_textbox"
  | "long_number_textfield"
  | "big_notice_textbox"
  | "small_notice_textbox"
  | "search_popup_textfield"
  | "other_settings_gui_textbox"
  | "short_number_textfield"
  | "invalid_value_short_number_textfield"
  | "very_short_number_textfield"
  | "slider_value_textfield"
  | "wide_slider_value_textfield"
  | "short_slider_value_textfield"
  | "stretchable_textfield"
  | "ime_composition_textfield"
  | "editor_lua_textbox"
  | "edit_blueprint_description_textbox"
  | "search_textfield";

/**
 * Extension interface for mods to register custom textbox styles.
 */
export interface ModTextboxStyles {}

export type TextboxStyleName = ReactTextboxStyleName | VanillaTextboxStyleName | keyof ModTextboxStyles;

const styles = getDefaultStyles();
if (styles) {
  styles.react_widthless_textfield = {
    type: "textbox_style",
    width: 0,
  };

  styles.react_widthless_invalid_textfield = {
    type: "textbox_style",
    parent: "invalid_value_textfield",
    width: 0,
  };

  styles.react_titlebar_search_textfield = {
    type: "textbox_style",
    top_margin: -2,
    bottom_margin: 1,
    width: 150,
  };
}
