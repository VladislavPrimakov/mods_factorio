import type { ButtonStyleName } from "./ButtonStyle";

export type VanillaChooseElemButtonStyleName = "choose_elem_button" | "slot_button";

/**
 * Extension interface for mods to register custom choose elem button styles.
 */
export interface ModChooseElemButtonStyles {}

export type ChooseElemButtonStyleName = ButtonStyleName | VanillaChooseElemButtonStyleName | keyof ModChooseElemButtonStyles;
