export type VanillaCameraStyleName = "camera";

/**
 * Extension interface for mods to register custom camera styles.
 */
export interface ModCameraStyles {}

export type CameraStyleName = VanillaCameraStyleName | keyof ModCameraStyles;
