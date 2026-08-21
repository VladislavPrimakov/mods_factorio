export type VanillaEntityPreviewStyleName = "entity_preview";

/**
 * Extension interface for mods to register custom entity preview styles.
 */
export interface ModEntityPreviewStyles {}

export type EntityPreviewStyleName = VanillaEntityPreviewStyleName | keyof ModEntityPreviewStyles;
