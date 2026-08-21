export type VanillaMinimapStyleName = "minimap";

/**
 * Extension interface for mods to register custom minimap styles.
 */
export interface ModMinimapStyles {}

export type MinimapStyleName = VanillaMinimapStyleName | keyof ModMinimapStyles;
