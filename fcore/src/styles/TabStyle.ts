import type { TabStyle as FactorioTabStyle } from "factorio:runtime";
import type { CleanStyle } from "./_types";

export type TabStyles = CleanStyle<FactorioTabStyle>;

export type VanillaTabStyleName = "tab" | "frame_tab" | "filter_group_tab" | "slightly_smaller_tab" | "filter_group_slot_tab";

/**
 * Extension interface for mods to register custom tab styles.
 */
export interface ModTabStyles {}

export type TabStyleName = VanillaTabStyleName | keyof ModTabStyles;
