data:extend({
  -- 3x1 GREEN (Bulk)
  {
    type = "inserter",
    name = "crane-short",
    icon = "__cranes__/graphics/crane-short-icon.png",
    icon_size = 64,
    flags = { "placeable-neutral", "placeable-player", "player-creation" },
    subgroup = "inserter",
    orded = "z-r[crane-short]",
    filter_count = 5,
    stack_size_bonus = 250,
    bulk = true,
    minable = { mining_time = data.raw["inserter"]["bulk-inserter"].minable.mining_time * 3, result = "crane-short" },
    max_health = data.raw["inserter"]["bulk-inserter"].max_health * 3,
    corpse = "inserter-remnants",
    collision_box = { { -1.3, -0.15 }, { 1.3, 0.15 } },
    selection_box = { { -1.5, -0.5 }, { 1.5, 0.5 } },
    pickup_position = { 0, -1 },
    insert_position = { 0, 1.2 },
    energy_source = { type = "electric", usage_priority = "secondary-input", drain = "3kW" },
    energy_per_rotation = "10MW",
    energy_per_movement = "10MW",
    rotation_speed = 0.025,
    extension_speed = 0.025,
    fast_replaceable_group = "short-crane",
    vehicle_impact_sound = { filename = "__base__/sound/car-metal-impact.ogg", volume = 1.0 },
    open_sound = { filename = "__base__/sound/machine-open.ogg", volume = 0.5 },
    close_sound = { filename = "__base__/sound/machine-close.ogg", volume = 0.5 },
    working_sound = {
      match_progress_to_activity = true,
      sound = {
        { filename = "__base__/sound/inserter-fast-1.ogg", volume = 0.75 },
        { filename = "__base__/sound/inserter-fast-2.ogg", volume = 0.75 },
        { filename = "__base__/sound/inserter-fast-3.ogg", volume = 0.75 },
        { filename = "__base__/sound/inserter-fast-4.ogg", volume = 0.75 },
        { filename = "__base__/sound/inserter-fast-5.ogg", volume = 0.75 }
      }
    },
    hand_base_picture = table.deepcopy(data.raw["inserter"]["bulk-inserter"].hand_base_picture),
    hand_closed_picture = table.deepcopy(data.raw["inserter"]["bulk-inserter"].hand_closed_picture),
    hand_open_picture = table.deepcopy(data.raw["inserter"]["bulk-inserter"].hand_open_picture),
    hand_base_shadow = table.deepcopy(data.raw["inserter"]["bulk-inserter"].hand_base_shadow),
    hand_closed_shadow = table.deepcopy(data.raw["inserter"]["bulk-inserter"].hand_closed_shadow),
    hand_open_shadow = table.deepcopy(data.raw["inserter"]["bulk-inserter"].hand_open_shadow),

    -- Base Platform Layer
    platform_picture = make_4way_animation_from_spritesheet({
      layers =
      {
        {
          filename = "__cranes__/graphics/crane-platform-3x1.png",
          priority = "extra-high",
          width = 384,
          height = 192,
          scale = 0.5
        },
        {
          filename = "__cranes__/graphics/crane-platform-3x1-sh.png",
          priority = "extra-high",
          width = 384,
          height = 192,
          draw_as_shadow = true,
          scale = 0.5
        }
      }
    }),

    -- Overlay Platform Layer
    integration_patch_render_layer = "object",
    integration_patch = make_4way_animation_from_spritesheet({
      layers =
      {
        {
          filename = "__cranes__/graphics/crane-platform-3x1-oh.png",
          priority = "extra-high",
          width = 384,
          height = 192,
          scale = 0.5
        }
      }
    }),

    -- Circuit connection points
    circuit_connector = circuit_connector_definitions["short-crane"],
    circuit_wire_max_distance = inserter_circuit_wire_max_distance,
    default_stack_control_input_signal = inserter_default_stack_control_input_signal
  },

  -- 6x1 GREEN (Bulk)
  {
    type = "inserter",
    name = "crane",
    icon = "__cranes__/graphics/crane-icon.png",
    icon_size = 64,
    flags = { "placeable-neutral", "placeable-player", "player-creation" },
    subgroup = "inserter",
    orded = "z-s[crane]",
    filter_count = 5,
    stack_size_bonus = 250,
    bulk = true,
    minable = { mining_time = data.raw["inserter"]["bulk-inserter"].minable.mining_time * 6, result = "crane" },
    max_health = data.raw["inserter"]["bulk-inserter"].max_health * 6,
    corpse = "inserter-remnants",
    collision_box = { { -2.8, -0.15 }, { 2.8, 0.15 } },
    selection_box = { { -3, -0.5 }, { 3, 0.5 } },
    pickup_position = { 0.3, -1 },
    insert_position = { -0.3, 1.2 },
    energy_source = { type = "electric", usage_priority = "secondary-input", drain = "6kW" },
    energy_per_rotation = "10MW",
    energy_per_movement = "10MW",
    rotation_speed = 0.05,
    extension_speed = 0.05,
    fast_replaceable_group = "crane",
    vehicle_impact_sound = { filename = "__base__/sound/car-metal-impact.ogg", volume = 1.0 },
    open_sound = { filename = "__base__/sound/machine-open.ogg", volume = 0.5 },
    close_sound = { filename = "__base__/sound/machine-close.ogg", volume = 0.5 },
    working_sound = {
      match_progress_to_activity = true,
      sound = {
        { filename = "__base__/sound/inserter-fast-1.ogg", volume = 0.75 },
        { filename = "__base__/sound/inserter-fast-2.ogg", volume = 0.75 },
        { filename = "__base__/sound/inserter-fast-3.ogg", volume = 0.75 },
        { filename = "__base__/sound/inserter-fast-4.ogg", volume = 0.75 },
        { filename = "__base__/sound/inserter-fast-5.ogg", volume = 0.75 }
      }
    },
    hand_base_picture = table.deepcopy(data.raw["inserter"]["bulk-inserter"].hand_base_picture),
    hand_closed_picture = table.deepcopy(data.raw["inserter"]["bulk-inserter"].hand_closed_picture),
    hand_open_picture = table.deepcopy(data.raw["inserter"]["bulk-inserter"].hand_open_picture),
    hand_base_shadow = table.deepcopy(data.raw["inserter"]["bulk-inserter"].hand_base_shadow),
    hand_closed_shadow = table.deepcopy(data.raw["inserter"]["bulk-inserter"].hand_closed_shadow),
    hand_open_shadow = table.deepcopy(data.raw["inserter"]["bulk-inserter"].hand_open_shadow),

    -- Base Platform Layer
    platform_picture = make_4way_animation_from_spritesheet({
      layers =
      {
        {
          filename = "__cranes__/graphics/crane-platform-6x1.png",
          priority = "extra-high",
          width = 408,
          height = 384,
          scale = 0.5
        },
        {
          filename = "__cranes__/graphics/crane-platform-6x1-sh.png",
          priority = "extra-high",
          width = 408,
          height = 384,
          draw_as_shadow = true,
          scale = 0.5
        }
      }
    }),

    -- Overlay Platform Layer
    integration_patch_render_layer = "object",
    integration_patch = make_4way_animation_from_spritesheet({
      layers =
      {
        {
          filename = "__cranes__/graphics/crane-platform-6x1-oh.png",
          priority = "extra-high",
          width = 408,
          height = 384,
          scale = 0.5
        }
      }
    }),

    -- Circuit connection points
    circuit_connector = circuit_connector_definitions["crane"],
    circuit_wire_max_distance = inserter_circuit_wire_max_distance,
    default_stack_control_input_signal = inserter_default_stack_control_input_signal
  },
})
