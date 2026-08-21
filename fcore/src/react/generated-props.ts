// AUTO-GENERATED FILE. DO NOT EDIT. Run 'npm run generate' to update.
import type {
  ElemID,
  ElemType,
  EmptySlotInfo,
  FrameGuiElement,
  GuiAnchor,
  GuiDirection,
  GuiElementType,
  GuiLocation,
  GuiLocationArray,
  LocalisedString,
  LuaEntity,
  LuaInventory,
  MapPosition,
  MapPositionArray,
  MouseButtonFlagsWrite,
  PrototypeFilterWrite,
  PrototypeWithQuality,
  ScrollPolicy,
  SignalIDWrite,
  SpritePath,
  SurfaceIndex,
  SwitchState,
} from "factorio:runtime";
import type { EventMapping } from "./types";

/**
 * Unified native Factorio GUI element props mapping for JSX.
 */
export interface NativeElementPropsMap {
  button: {
    anchor?: GuiAnchor;
    auto_toggle?: boolean;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    mouse_button_filter?: MouseButtonFlagsWrite;
    name?: string;
    raise_hover_events?: boolean;
    toggled?: boolean;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  "sprite-button": {
    anchor?: GuiAnchor;
    auto_toggle?: boolean;
    caption?: LocalisedString;
    clicked_sprite?: SpritePath;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    hovered_sprite?: SpritePath;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    mouse_button_filter?: MouseButtonFlagsWrite;
    name?: string;
    number?: number;
    quality?: string;
    raise_hover_events?: boolean;
    show_percent_for_small_numbers?: boolean;
    sprite?: SpritePath;
    toggled?: boolean;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  checkbox: {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    state?: boolean;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  radiobutton: {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    state?: boolean;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  flow: {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    direction?: GuiDirection;
    drag_target?: FrameGuiElement;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  frame: {
    anchor?: GuiAnchor;
    auto_center?: boolean;
    caption?: LocalisedString;
    direction?: GuiDirection;
    drag_target?: FrameGuiElement;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  label: {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    drag_target?: FrameGuiElement;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  line: {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    direction?: GuiDirection;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  progressbar: {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    tooltip?: LocalisedString;
    value?: number;
    visible?: boolean;
  };
  table: {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    column_count?: number;
    drag_target?: FrameGuiElement;
    draw_horizontal_line_after_headers?: boolean;
    draw_horizontal_lines?: boolean;
    draw_vertical_lines?: boolean;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    tooltip?: LocalisedString;
    vertical_centering?: boolean;
    visible?: boolean;
  };
  textfield: {
    allow_decimal?: boolean;
    allow_negative?: boolean;
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    icon_selector?: boolean;
    ignored_by_interaction?: boolean;
    index?: number;
    is_password?: boolean;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    lose_focus_on_confirm?: boolean;
    name?: string;
    numeric?: boolean;
    raise_hover_events?: boolean;
    text?: string;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  "text-box": {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    icon_selector?: boolean;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    read_only?: boolean;
    selectable?: boolean;
    text?: string;
    tooltip?: LocalisedString;
    visible?: boolean;
    word_wrap?: boolean;
  };
  sprite: {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    resize_to_sprite?: boolean;
    sprite?: SpritePath;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  "scroll-pane": {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    horizontal_scroll_policy?: ScrollPolicy;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    read_only?: boolean;
    selectable?: boolean;
    tooltip?: LocalisedString;
    vertical_scroll_policy?: ScrollPolicy;
    visible?: boolean;
    word_wrap?: boolean;
  };
  "drop-down": {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    items?: readonly LocalisedString[];
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    selected_index?: number;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  "list-box": {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    items?: readonly LocalisedString[];
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    selected_index?: number;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  camera: {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    entity?: LuaEntity;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    position?: MapPosition | MapPositionArray;
    raise_hover_events?: boolean;
    surface_index?: SurfaceIndex;
    tooltip?: LocalisedString;
    visible?: boolean;
    zoom?: number;
  };
  "choose-elem-button": {
    achievement?: string;
    anchor?: GuiAnchor;
    "asteroid-chunk"?: string;
    caption?: LocalisedString;
    decorative?: string;
    elem_filters?: PrototypeFilterWrite;
    elem_tooltip?: ElemID;
    elem_type?: ElemType;
    elem_value?: string | SignalIDWrite | PrototypeWithQuality;
    enabled?: boolean;
    entity?: string;
    "entity-with-quality"?: PrototypeWithQuality;
    equipment?: string;
    "equipment-with-quality"?: PrototypeWithQuality;
    fluid?: string;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    item?: string;
    "item-group"?: string;
    "item-with-quality"?: PrototypeWithQuality;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    recipe?: string;
    "recipe-with-quality"?: PrototypeWithQuality;
    signal?: SignalIDWrite;
    "space-location"?: string;
    technology?: string;
    tile?: string;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  slider: {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    discrete_values?: boolean;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    maximum_value?: number;
    minimum_value?: number;
    name?: string;
    raise_hover_events?: boolean;
    slider_value?: number;
    tooltip?: LocalisedString;
    value?: number;
    value_step?: number;
    visible?: boolean;
  };
  minimap: {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    chart_player_index?: number;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    entity?: LuaEntity;
    force?: string;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    minimap_player_index?: number;
    name?: string;
    position?: MapPosition | MapPositionArray;
    raise_hover_events?: boolean;
    surface_index?: SurfaceIndex;
    tooltip?: LocalisedString;
    visible?: boolean;
    zoom?: number;
  };
  "entity-preview": {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    entity?: LuaEntity;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  "empty-widget": {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    drag_target?: FrameGuiElement;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  "tabbed-pane": {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    selected_tab_index?: number;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  tab: {
    anchor?: GuiAnchor;
    badge_text?: LocalisedString;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  switch: {
    allow_none_state?: boolean;
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    ignored_by_interaction?: boolean;
    index?: number;
    left_label_caption?: LocalisedString;
    left_label_tooltip?: LocalisedString;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    right_label_caption?: LocalisedString;
    right_label_tooltip?: LocalisedString;
    switch_state?: SwitchState;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
  inventory: {
    anchor?: GuiAnchor;
    caption?: LocalisedString;
    elem_tooltip?: ElemID;
    empty_slot_info?: EmptySlotInfo;
    enabled?: boolean;
    game_controller_interaction?: defines.game_controller_interaction;
    handle_cursor_split?: boolean;
    handle_cursor_transfer?: boolean;
    handle_open_item?: boolean;
    handle_open_mod_item?: boolean;
    handle_send_stack_to_trash?: boolean;
    handle_send_stacks_to_trash?: boolean;
    ignored_by_interaction?: boolean;
    index?: number;
    inventory?: LuaInventory;
    location?: GuiLocation | GuiLocationArray;
    locked?: boolean;
    name?: string;
    raise_hover_events?: boolean;
    slots_per_row?: number;
    tooltip?: LocalisedString;
    visible?: boolean;
  };
}

/**
 * Resolves all valid native GUI props for element type T.
 */
export type NativePropsFor<T extends string> = T extends keyof NativeElementPropsMap ? NativeElementPropsMap[T] : {};

/**
 * Exact set of all 14 native Factorio GUI event handler prop names.
 */
export const GUI_EVENT_PROPS: Readonly<Record<keyof EventMapping, true>> = {
  onClick: true,
  onClosed: true,
  onConfirmed: true,
  onTextChanged: true,
  onCheckedStateChanged: true,
  onElemChanged: true,
  onValueChanged: true,
  onSelectionStateChanged: true,
  onSwitchStateChanged: true,
  onSelectedTabChanged: true,
  onHover: true,
  onLeave: true,
  onLocationChanged: true,
  onOpened: true,
};

export interface ElementSchema {
  /** Whitelist of properties accepted during parent.add(params) */
  create: Record<string, true>;
  /** Whitelist of writable properties allowed to update on live LuaGuiElement */
  update: Record<string, true>;
  /** Whitelist of post-creation properties assigned directly to LuaGuiElement */
  post: Record<string, true>;
}

/**
 * Single source of truth element property schemas for Factorio GUI bridge.
 */
export const ELEMENT_SCHEMA: Record<GuiElementType, ElementSchema> = {
  button: {
    create: {
      anchor: true,
      auto_toggle: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      mouse_button_filter: true,
      name: true,
      raise_hover_events: true,
      toggled: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      auto_toggle: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      mouse_button_filter: true,
      name: true,
      raise_hover_events: true,
      toggled: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true },
  },
  "sprite-button": {
    create: {
      anchor: true,
      auto_toggle: true,
      caption: true,
      clicked_sprite: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      hovered_sprite: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      mouse_button_filter: true,
      name: true,
      number: true,
      quality: true,
      raise_hover_events: true,
      show_percent_for_small_numbers: true,
      sprite: true,
      toggled: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      auto_toggle: true,
      caption: true,
      clicked_sprite: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      hovered_sprite: true,
      ignored_by_interaction: true,
      mouse_button_filter: true,
      name: true,
      number: true,
      quality: true,
      raise_hover_events: true,
      show_percent_for_small_numbers: true,
      sprite: true,
      toggled: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true },
  },
  checkbox: {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      state: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      state: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true },
  },
  radiobutton: {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      state: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      state: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true },
  },
  flow: {
    create: {
      anchor: true,
      caption: true,
      direction: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    post: { drag_target: true, location: true },
  },
  frame: {
    create: {
      anchor: true,
      caption: true,
      direction: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    post: { auto_center: true, drag_target: true, location: true },
  },
  label: {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    post: { drag_target: true, location: true },
  },
  line: {
    create: {
      anchor: true,
      caption: true,
      direction: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true },
  },
  progressbar: {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      value: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      value: true,
      visible: true,
    },
    post: { location: true },
  },
  table: {
    create: {
      anchor: true,
      caption: true,
      column_count: true,
      draw_horizontal_line_after_headers: true,
      draw_horizontal_lines: true,
      draw_vertical_lines: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      vertical_centering: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      draw_horizontal_line_after_headers: true,
      draw_horizontal_lines: true,
      draw_vertical_lines: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      vertical_centering: true,
      visible: true,
    },
    post: { drag_target: true, location: true },
  },
  textfield: {
    create: {
      allow_decimal: true,
      allow_negative: true,
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      icon_selector: true,
      ignored_by_interaction: true,
      index: true,
      is_password: true,
      locked: true,
      lose_focus_on_confirm: true,
      name: true,
      numeric: true,
      raise_hover_events: true,
      text: true,
      tooltip: true,
      visible: true,
    },
    update: {
      allow_decimal: true,
      allow_negative: true,
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      is_password: true,
      lose_focus_on_confirm: true,
      name: true,
      numeric: true,
      raise_hover_events: true,
      text: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true },
  },
  "text-box": {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      icon_selector: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      text: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      text: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true, read_only: true, selectable: true, word_wrap: true },
  },
  sprite: {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      resize_to_sprite: true,
      sprite: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      resize_to_sprite: true,
      sprite: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true },
  },
  "scroll-pane": {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      horizontal_scroll_policy: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      vertical_scroll_policy: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      horizontal_scroll_policy: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      vertical_scroll_policy: true,
      visible: true,
    },
    post: { location: true, read_only: true, selectable: true, word_wrap: true },
  },
  "drop-down": {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      items: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      selected_index: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      items: true,
      name: true,
      raise_hover_events: true,
      selected_index: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true },
  },
  "list-box": {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      items: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      selected_index: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      items: true,
      name: true,
      raise_hover_events: true,
      selected_index: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true },
  },
  camera: {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      position: true,
      raise_hover_events: true,
      surface_index: true,
      tooltip: true,
      visible: true,
      zoom: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      position: true,
      raise_hover_events: true,
      surface_index: true,
      tooltip: true,
      visible: true,
      zoom: true,
    },
    post: { entity: true, location: true },
  },
  "choose-elem-button": {
    create: {
      achievement: true,
      anchor: true,
      "asteroid-chunk": true,
      caption: true,
      decorative: true,
      elem_filters: true,
      elem_tooltip: true,
      elem_type: true,
      enabled: true,
      entity: true,
      "entity-with-quality": true,
      equipment: true,
      "equipment-with-quality": true,
      fluid: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      item: true,
      "item-group": true,
      "item-with-quality": true,
      locked: true,
      name: true,
      raise_hover_events: true,
      recipe: true,
      "recipe-with-quality": true,
      signal: true,
      "space-location": true,
      technology: true,
      tile: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_filters: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    post: { elem_value: true, location: true },
  },
  slider: {
    create: {
      anchor: true,
      caption: true,
      discrete_values: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      maximum_value: true,
      minimum_value: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      value: true,
      value_step: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true, slider_value: true },
  },
  minimap: {
    create: {
      anchor: true,
      caption: true,
      chart_player_index: true,
      elem_tooltip: true,
      enabled: true,
      force: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      position: true,
      raise_hover_events: true,
      surface_index: true,
      tooltip: true,
      visible: true,
      zoom: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      force: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      position: true,
      raise_hover_events: true,
      surface_index: true,
      tooltip: true,
      visible: true,
      zoom: true,
    },
    post: { entity: true, location: true, minimap_player_index: true },
  },
  "entity-preview": {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    post: { entity: true, location: true },
  },
  "empty-widget": {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    post: { drag_target: true, location: true },
  },
  "tabbed-pane": {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true, selected_tab_index: true },
  },
  tab: {
    create: {
      anchor: true,
      badge_text: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      badge_text: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true },
  },
  switch: {
    create: {
      allow_none_state: true,
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      index: true,
      left_label_caption: true,
      left_label_tooltip: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      right_label_caption: true,
      right_label_tooltip: true,
      switch_state: true,
      tooltip: true,
      visible: true,
    },
    update: {
      allow_none_state: true,
      anchor: true,
      caption: true,
      elem_tooltip: true,
      enabled: true,
      game_controller_interaction: true,
      ignored_by_interaction: true,
      left_label_caption: true,
      left_label_tooltip: true,
      name: true,
      raise_hover_events: true,
      right_label_caption: true,
      right_label_tooltip: true,
      switch_state: true,
      tooltip: true,
      visible: true,
    },
    post: { location: true },
  },
  inventory: {
    create: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      empty_slot_info: true,
      enabled: true,
      game_controller_interaction: true,
      handle_cursor_split: true,
      handle_cursor_transfer: true,
      handle_open_item: true,
      handle_open_mod_item: true,
      handle_send_stack_to_trash: true,
      handle_send_stacks_to_trash: true,
      ignored_by_interaction: true,
      index: true,
      locked: true,
      name: true,
      raise_hover_events: true,
      slots_per_row: true,
      tooltip: true,
      visible: true,
    },
    update: {
      anchor: true,
      caption: true,
      elem_tooltip: true,
      empty_slot_info: true,
      enabled: true,
      game_controller_interaction: true,
      handle_cursor_split: true,
      handle_cursor_transfer: true,
      handle_open_item: true,
      handle_open_mod_item: true,
      handle_send_stack_to_trash: true,
      handle_send_stacks_to_trash: true,
      ignored_by_interaction: true,
      name: true,
      raise_hover_events: true,
      slots_per_row: true,
      tooltip: true,
      visible: true,
    },
    post: { inventory: true, location: true },
  },
};
