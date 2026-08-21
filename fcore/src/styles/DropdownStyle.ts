export type VanillaDropdownStyleName = "dropdown" | "drop_down" | "game_controller_icons_dropdown" | "circuit_condition_comparator_dropdown" | "train_schedule_circuit_condition_comparator_dropdown";

/**
 * Extension interface for mods to register custom dropdown styles.
 */
export interface ModDropdownStyles {}

export type DropdownStyleName = VanillaDropdownStyleName | keyof ModDropdownStyles;
