export type VanillaSwitchStyleName = "switch";

/**
 * Extension interface for mods to register custom switch styles.
 */
export interface ModSwitchStyles {}

export type SwitchStyleName = VanillaSwitchStyleName | keyof ModSwitchStyles;
