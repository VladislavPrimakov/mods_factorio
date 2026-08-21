import type { Color, ElementImageSetLayer } from "factorio:prototype";
import type { CoreStorage } from "./types";

declare global {
  interface Object {
    [Symbol.iterator](): Iterator<any>;
  }

  // Factorio core style helpers provided by `__core__/prototypes/style.lua`
  function offset_by_2_rounded_corners_glow(tint_value?: Color): ElementImageSetLayer;
  function default_glow(tint_value?: Color, scale_value?: number): ElementImageSetLayer;
  const default_dirt_color: Color;
  const default_glow_color: Color;
  const offset_by_4_rounded_corners_shallow_inset: ElementImageSetLayer;
  const button_hovered_font_color: Color;
  const default_dirt: ElementImageSetLayer;
  const default_inner_shadow: ElementImageSetLayer;
  const top_shadow: ElementImageSetLayer;

  interface Storage extends CoreStorage {}

  const storage: Storage;
}

declare module "factorio:runtime" {
  interface BaseGuiElement {
    [key: string]: any;
  }
  interface LuaStyle {
    [key: string]: any;
  }
}
