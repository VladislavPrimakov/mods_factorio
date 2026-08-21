export type VanillaCheckboxStyleName = "checkbox" | "caption_checkbox" | "subheader_caption_checkbox" | "black_checkbox" | "radiobutton" | "caption_radiobutton";

/**
 * Extension interface for mods to register custom checkbox & radiobutton styles.
 */
export interface ModCheckboxStyles {}

export type CheckboxStyleName = VanillaCheckboxStyleName | keyof ModCheckboxStyles;
