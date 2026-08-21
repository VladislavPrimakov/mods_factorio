export type VanillaSliderStyleName =
  | "slider"
  | "notched_slider"
  | "map_generator_notched_slider"
  | "map_generator_13_notch_slider"
  | "map_generator_notched_slider_wide"
  | "red_slider"
  | "green_slider"
  | "blue_slider"
  | "other_settings_slider"
  | "notched_double_slider";

/**
 * Extension interface for mods to register custom slider styles.
 */
export interface ModSliderStyles {}

export type SliderStyleName = VanillaSliderStyleName | keyof ModSliderStyles;
