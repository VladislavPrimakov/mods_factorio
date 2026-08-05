circuit_connector_definitions["crane"] = circuit_connector_definitions.create_vector(universal_connector_template,
  {
    { variation = 24, main_offset = util.by_pixel(-87, -6), shadow_offset = util.by_pixel(-83, -4), show_shadow = false },
    { variation = 24, main_offset = util.by_pixel(-11, 67), shadow_offset = util.by_pixel(-8, 69),  show_shadow = false },
    { variation = 24, main_offset = util.by_pixel(-87, -6), shadow_offset = util.by_pixel(-83, -4), show_shadow = false },
    { variation = 24, main_offset = util.by_pixel(-11, 67), shadow_offset = util.by_pixel(-8, 69),  show_shadow = false }
  }
)
circuit_connector_definitions["short-crane"] = circuit_connector_definitions.create_vector(universal_connector_template,
  {
    { variation = 24, main_offset = util.by_pixel(-40, -6), shadow_offset = util.by_pixel(-36, -4), show_shadow = false },
    { variation = 24, main_offset = util.by_pixel(-11, 22), shadow_offset = util.by_pixel(-8, 25),  show_shadow = false },
    { variation = 24, main_offset = util.by_pixel(-40, -6), shadow_offset = util.by_pixel(-36, -4), show_shadow = false },
    { variation = 24, main_offset = util.by_pixel(-11, 22), shadow_offset = util.by_pixel(-8, 25),  show_shadow = false }
  }
)

local params_short_cranes = {
  fast_replaceable_group = "short-crane",
  mining_time = 0.5,
  collision_box = { { -1.3, -0.15 }, { 1.3, 0.15 } },
  selection_box = { { -1.5, -0.5 }, { 1.5, 0.5 } },
  pickup_position = { 0, -1 },
  insert_position = { 0, 1.2 },
  circuit_connector = circuit_connector_definitions["short-crane"],
  platform_picture = make_4way_animation_from_spritesheet({
    layers =
    {
      {
        filename = "__pyindustrygraphics__/graphics/entity/crane/crane-platform-3x1.png",
        priority = "extra-high",
        width = 384,
        height = 192,
        scale = 0.5
      },
      {
        filename = "__pyindustrygraphics__/graphics/entity/crane/crane-platform-3x1-sh.png",
        priority = "extra-high",
        width = 384,
        height = 192,
        draw_as_shadow = true,
        scale = 0.5
      }
    }
  }),
  integration_patch = make_4way_animation_from_spritesheet({
    layers =
    {
      {
        filename = "__pyindustrygraphics__/graphics/entity/crane/crane-platform-3x1-oh.png",
        priority = "extra-high",
        width = 384,
        height = 192,
        scale = 0.5
      }
    }
  }),
}

local params_cranes = {
  fast_replaceable_group = "crane",
  mining_time = 1,
  collision_box = { { -2.8, -0.15 }, { 2.8, 0.15 } },
  selection_box = { { -3, -0.5 }, { 3, 0.5 } },
  pickup_position = { 0.3, -1 },
  insert_position = { -0.3, 1.2 },
  circuit_connector = circuit_connector_definitions["crane"],
  platform_picture = make_4way_animation_from_spritesheet({
    layers =
    {
      {
        filename = "__pyindustrygraphics__/graphics/entity/crane/crane-platform-6x1.png",
        priority = "extra-high",
        width = 408,
        height = 384,
        scale = 0.5
      },
      {
        filename = "__pyindustrygraphics__/graphics/entity/crane/crane-platform-6x1-sh.png",
        priority = "extra-high",
        width = 408,
        height = 384,
        draw_as_shadow = true,
        scale = 0.5
      }
    }
  }),
  integration_patch = make_4way_animation_from_spritesheet({
    layers =
    {
      {
        filename = "__pyindustrygraphics__/graphics/entity/crane/crane-platform-6x1-oh.png",
        priority = "extra-high",
        width = 408,
        height = 384,
        scale = 0.5
      }
    }
  }),
}

local entities_cranes = {
  {
    name = "crane-short-mk1",
    next_upgrade = "crane-short-mk2",
    stack_size_bonus = 250,
    filter_count = 5,
    max_health = 500,
    drain = "5kW",
    energy_per_rotation = "5MW",
    energy_per_movement = "5MW",
    rotation_speed = 0.025,
    extension_speed = 0.025,
    inserter = "inserter",
    collision_box = params_short_cranes.collision_box,
    selection_box = params_short_cranes.selection_box,
    pickup_position = params_short_cranes.pickup_position,
    insert_position = params_short_cranes.insert_position,
    mining_time = params_short_cranes.mining_time,
    fast_replaceable_group = params_short_cranes.fast_replaceable_group,
    circuit_connector = params_short_cranes.circuit_connector,
    platform_picture = params_short_cranes.platform_picture,
  },
  {
    name = "crane-short-mk2",
    next_upgrade = "crane-short-mk3",
    stack_size_bonus = 250,
    filter_count = 5,
    max_health = 1000,
    drain = "10kW",
    energy_per_rotation = "10MW",
    energy_per_movement = "10MW",
    rotation_speed = 0.0375,
    extension_speed = 0.0375,
    inserter = "fast-inserter",
    collision_box = params_short_cranes.collision_box,
    selection_box = params_short_cranes.selection_box,
    pickup_position = params_short_cranes.pickup_position,
    insert_position = params_short_cranes.insert_position,
    mining_time = params_short_cranes.mining_time,
    fast_replaceable_group = params_short_cranes.fast_replaceable_group,
    circuit_connector = params_short_cranes.circuit_connector,
    platform_picture = params_short_cranes.platform_picture,
  },
  {
    name = "crane-short-mk3",
    next_upgrade = "crane-short-mk4",
    stack_size_bonus = 250,
    filter_count = 5,
    max_health = 1500,
    drain = "15kW",
    energy_per_rotation = "15MW",
    energy_per_movement = "15MW",
    rotation_speed = 0.05,
    extension_speed = 0.05,
    inserter = "bulk-inserter",
    collision_box = params_short_cranes.collision_box,
    selection_box = params_short_cranes.selection_box,
    pickup_position = params_short_cranes.pickup_position,
    insert_position = params_short_cranes.insert_position,
    mining_time = params_short_cranes.mining_time,
    fast_replaceable_group = params_short_cranes.fast_replaceable_group,
    circuit_connector = params_short_cranes.circuit_connector,
    platform_picture = params_short_cranes.platform_picture,
  },
  {
    name = "crane-short-mk4",
    next_upgrade = nil,
    stack_size_bonus = 250,
    filter_count = 5,
    max_health = 2000,
    drain = "20kW",
    energy_per_rotation = "20MW",
    energy_per_movement = "20MW",
    rotation_speed = 0.0725,
    extension_speed = 0.0725,
    inserter = "py-stack-inserter",
    collision_box = params_short_cranes.collision_box,
    selection_box = params_short_cranes.selection_box,
    pickup_position = params_short_cranes.pickup_position,
    insert_position = params_short_cranes.insert_position,
    mining_time = params_short_cranes.mining_time,
    fast_replaceable_group = params_short_cranes.fast_replaceable_group,
    circuit_connector = params_short_cranes.circuit_connector,
    platform_picture = params_short_cranes.platform_picture,
  },
  {
    name = "crane-mk1",
    next_upgrade = "crane-mk2",
    stack_size_bonus = 250,
    filter_count = 5,
    max_health = 1000,
    drain = "10kW",
    energy_per_rotation = "10MW",
    energy_per_movement = "10MW",
    rotation_speed = 0.05,
    extension_speed = 0.05,
    inserter = "inserter",
    collision_box = params_cranes.collision_box,
    selection_box = params_cranes.selection_box,
    pickup_position = params_cranes.pickup_position,
    insert_position = params_cranes.insert_position,
    mining_time = params_cranes.mining_time,
    fast_replaceable_group = params_cranes.fast_replaceable_group,
    circuit_connector = params_cranes.circuit_connector,
    platform_picture = params_cranes.platform_picture,
  },
  {
    name = "crane-mk2",
    next_upgrade = "crane-mk3",
    stack_size_bonus = 250,
    filter_count = 5,
    max_health = 2000,
    drain = "20kW",
    energy_per_rotation = "20MW",
    energy_per_movement = "20MW",
    rotation_speed = 0.0750,
    extension_speed = 0.0750,
    inserter = "fast-inserter",
    collision_box = params_cranes.collision_box,
    selection_box = params_cranes.selection_box,
    pickup_position = params_cranes.pickup_position,
    insert_position = params_cranes.insert_position,
    mining_time = params_cranes.mining_time,
    fast_replaceable_group = params_cranes.fast_replaceable_group,
    circuit_connector = params_cranes.circuit_connector,
    platform_picture = params_cranes.platform_picture,
  },
  {
    name = "crane-mk3",
    next_upgrade = "crane-mk4",
    stack_size_bonus = 250,
    filter_count = 5,
    max_health = 3000,
    drain = "30kW",
    energy_per_rotation = "30MW",
    energy_per_movement = "30MW",
    rotation_speed = 0.1,
    extension_speed = 0.1,
    inserter = "bulk-inserter",
    collision_box = params_cranes.collision_box,
    selection_box = params_cranes.selection_box,
    pickup_position = params_cranes.pickup_position,
    insert_position = params_cranes.insert_position,
    mining_time = params_cranes.mining_time,
    fast_replaceable_group = params_cranes.fast_replaceable_group,
    circuit_connector = params_cranes.circuit_connector,
    platform_picture = params_cranes.platform_picture,
  },
  {
    name = "crane-mk4",
    next_upgrade = nil,
    stack_size_bonus = 250,
    filter_count = 5,
    max_health = 4000,
    drain = "40kW",
    energy_per_rotation = "40MW",
    energy_per_movement = "40MW",
    rotation_speed = 0.125,
    extension_speed = 0.125,
    inserter = "py-stack-inserter",
    collision_box = params_cranes.collision_box,
    selection_box = params_cranes.selection_box,
    pickup_position = params_cranes.pickup_position,
    insert_position = params_cranes.insert_position,
    mining_time = params_cranes.mining_time,
    fast_replaceable_group = params_cranes.fast_replaceable_group,
    circuit_connector = params_cranes.circuit_connector,
    platform_picture = params_cranes.platform_picture,
  }
}

local function make_entity_crane(params)
  data:extend({
    {
      type = "inserter",
      name = params.name,
      icon = "__pyindustrygraphics__/graphics/icons/" .. params.name .. ".png",
      icon_size = 64,
      icon_draw_specification = { scale = 0.5 },
      flags = { "placeable-neutral", "placeable-player", "player-creation" },
      subgroup = "inserter",
      bulk = true,
      wait_for_full_hand = settings.startup["cranes_pyanodon_setting_wait_for_full_hand"].value,
      enter_drop_mode_if_held_stack_spoiled = true,
      filter_count = params.filter_count,
      stack_size_bonus = params.stack_size_bonus,
      minable = { mining_time = params.mining_time, result = params.name },
      max_health = params.max_health,
      corpse = data.raw["inserter"][params.inserter].corpse,
      collision_box = params.collision_box,
      selection_box = params.selection_box,
      pickup_position = params.pickup_position,
      insert_position = params.insert_position,
      next_upgrade = params.next_upgrade,
      energy_source = { type = "electric", usage_priority = "secondary-input", drain = params.drain },
      energy_per_rotation = params.energy_per_rotation,
      energy_per_movement = params.energy_per_movement,
      rotation_speed = params.rotation_speed,
      extension_speed = params.extension_speed,
      fast_replaceable_group = params.fast_replaceable_group,
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
      hand_base_picture = table.deepcopy(data.raw["inserter"][params.inserter].hand_base_picture),
      hand_closed_picture = table.deepcopy(data.raw["inserter"][params.inserter].hand_closed_picture),
      hand_open_picture = table.deepcopy(data.raw["inserter"][params.inserter].hand_open_picture),
      hand_base_shadow = table.deepcopy(data.raw["inserter"][params.inserter].hand_base_shadow),
      hand_closed_shadow = table.deepcopy(data.raw["inserter"][params.inserter].hand_closed_shadow),
      hand_open_shadow = table.deepcopy(data.raw["inserter"][params.inserter].hand_open_shadow),
      platform_picture = params.platform_picture,
      integration_patch_render_layer = "object",
      integration_patch = params.integration_patch,
      circuit_connector = params.circuit_connector,
      circuit_wire_max_distance = inserter_circuit_wire_max_distance,
      default_stack_control_input_signal = inserter_default_stack_control_input_signal
    }
  })
end

for _, value in ipairs(entities_cranes) do
  make_entity_crane(value)
end
