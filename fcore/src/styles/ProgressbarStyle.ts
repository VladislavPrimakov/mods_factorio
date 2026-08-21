import type { ProgressBarStyle as FactorioProgressBarStyle } from "factorio:runtime";
import type { CleanStyle } from "./_types";

export type ProgressbarStyles = CleanStyle<FactorioProgressBarStyle>;

export type VanillaProgressbarStyleName =
  | "progressbar"
  | "production_progressbar"
  | "burning_progressbar"
  | "health_progressbar"
  | "vehicle_health_progressbar"
  | "mining_progressbar"
  | "shield_progressbar"
  | "bonus_progressbar"
  | "battery_progressbar"
  | "electric_satisfaction_progressbar"
  | "electric_satisfaction_statistics_progressbar"
  | "electric_statistics_progressbar"
  | "electric_satisfaction_in_description_progressbar"
  | "item_spoilage_in_description_progress_bar"
  | "thick_progressbar"
  | "disk_usage_progressbar"
  | "achievement_progressbar"
  | "achievement_card_progressbar"
  | "heat_progressbar"
  | "rocket_weight_used_progress_bar";

/**
 * Extension interface for mods to register custom progressbar styles.
 */
export interface ModProgressbarStyles {}

export type ProgressbarStyleName = VanillaProgressbarStyleName | keyof ModProgressbarStyles;
