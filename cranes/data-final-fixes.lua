circuit_connector_definitions["crane"] = circuit_connector_definitions.create_vector
    (
      universal_connector_template,
      {
        { variation = 24, main_offset = util.by_pixel(-87, -6), shadow_offset = util.by_pixel(-83, -4), show_shadow = false },
        { variation = 24, main_offset = util.by_pixel(-11, 67), shadow_offset = util.by_pixel(-8, 69),  show_shadow = false },
        { variation = 24, main_offset = util.by_pixel(-87, -6), shadow_offset = util.by_pixel(-83, -4), show_shadow = false }, -- horizontal
        { variation = 24, main_offset = util.by_pixel(-11, 67), shadow_offset = util.by_pixel(-8, 69),  show_shadow = false }  -- vertical
      }
    )

circuit_connector_definitions["short-crane"] = circuit_connector_definitions.create_vector
    (
      universal_connector_template,
      {
        { variation = 24, main_offset = util.by_pixel(-40, -6), shadow_offset = util.by_pixel(-36, -4), show_shadow = false },
        { variation = 24, main_offset = util.by_pixel(-11, 22), shadow_offset = util.by_pixel(-8, 25),  show_shadow = false },
        { variation = 24, main_offset = util.by_pixel(-40, -6), shadow_offset = util.by_pixel(-36, -4), show_shadow = false }, -- horizontal
        { variation = 24, main_offset = util.by_pixel(-11, 22), shadow_offset = util.by_pixel(-8, 25),  show_shadow = false }  -- vertical
      }
    )


table.insert(data.raw["technology"]["bulk-inserter"].effects, { type = "unlock-recipe", recipe = "crane-short" })
table.insert(data.raw["technology"]["bulk-inserter"].effects, { type = "unlock-recipe", recipe = "crane" })
