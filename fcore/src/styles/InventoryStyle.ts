export type VanillaInventoryStyleName = "inventory";

/**
 * Extension interface for mods to register custom inventory styles.
 */
export interface ModInventoryStyles {}

export type InventoryStyleName = VanillaInventoryStyleName | keyof ModInventoryStyles;
