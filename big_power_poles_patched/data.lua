local prerequisites = nil
if mods["pycoalprocessing"] then
    prerequisites = { "electric-energy-distribution-2" }
else
    prerequisites = { "electronics", "steel-processing", "electric-energy-distribution-1" }
end
data:extend({
    {
        type = "electric-pole",
        name = "extreme_power_pole",
        icon = "__base__/graphics/icons/big-electric-pole.png",
        icon_size = 32,
        flags = { "placeable-neutral", "player-creation" },
        minable = { mining_time = 0.1, result = "extreme_power_pole" },
        max_health = 150,
        corpse = "medium-remnants",
        resistances =
        {
            {
                type = "fire",
                percent = 100
            }
        },
        collision_box = { { -0.65, -0.65 }, { 0.65, 0.65 } },
        selection_box = { { -1, -1 }, { 1, 1 } },
        drawing_box = { { -1, -3 }, { 1, 0.5 } },
        maximum_wire_distance = 64,
        supply_area_distance = 2,
        vehicle_impact_sound = { filename = "__base__/sound/car-metal-impact.ogg", volume = 0.65 },
        pictures =
        {
            layers =
            {
                {
                    filename = "__base__/graphics/entity/big-electric-pole/big-electric-pole.png",
                    priority = "extra-high",
                    width = 148,
                    height = 312,
                    direction_count = 4,
                    shift = util.by_pixel(1, -51),
                    scale = 0.5

                },
                {
                    filename = "__base__/graphics/entity/big-electric-pole/big-electric-pole-shadow.png",
                    priority = "extra-high",
                    width = 374,
                    height = 94,
                    direction_count = 4,
                    shift = util.by_pixel(60, 0),
                    draw_as_shadow = true,
                    scale = 0.5

                }
            }
        },
        connection_points =
        {
            {
                shadow =
                {
                    copper = util.by_pixel_hr(245.0, -34.0),
                    red = util.by_pixel_hr(301.0, -0.0),
                    green = util.by_pixel_hr(206.0, -0.0)
                },
                wire =
                {
                    copper = util.by_pixel_hr(0, -246.0),
                    red = util.by_pixel_hr(58.0, -211.0),
                    green = util.by_pixel_hr(-58.0, -211.0)
                }
            },
            {
                shadow =
                {
                    copper = util.by_pixel_hr(279.0, -24.0),
                    red = util.by_pixel_hr(284.0, 28.0),
                    green = util.by_pixel_hr(204.0, -31.0)
                },
                wire =
                {
                    copper = util.by_pixel_hr(34.0, -235.0),
                    red = util.by_pixel_hr(41.0, -183.0),
                    green = util.by_pixel_hr(-40.0, -240.0)
                }
            },
            {
                shadow =
                {
                    copper = util.by_pixel_hr(292.0, 0.0),
                    red = util.by_pixel_hr(244.0, 41.0),
                    green = util.by_pixel_hr(244.0, -41.0)
                },
                wire =
                {
                    copper = util.by_pixel_hr(47.0, -212.0),
                    red = util.by_pixel_hr(1.0, -170.0),
                    green = util.by_pixel_hr(1.0, -251.0)
                }
            },
            {
                shadow =
                {
                    copper = util.by_pixel_hr(277.0, 23.0),
                    red = util.by_pixel_hr(204.0, 30.0),
                    green = util.by_pixel_hr(286.0, -29.0)
                },
                wire =
                {
                    copper = util.by_pixel_hr(33.0, -188.0),
                    red = util.by_pixel_hr(-41.0, -182.5),
                    green = util.by_pixel_hr(41.0, -239.0)
                }
            }
        },
        radius_visualisation_picture =
        {
            filename = "__base__/graphics/entity/small-electric-pole/electric-pole-radius-visualization.png",
            width = 12,
            height = 12,
            priority = "extra-high-no-scale"
        }
    },
    {
        type = "item",
        name = "extreme_power_pole",
        icon = "__base__/graphics/icons/big-electric-pole.png",
        icon_size = 32,
        subgroup = "energy-pipe-distribution",
        order = "a[energy]-c[big-electric-pole]",
        place_result = "extreme_power_pole",
        stack_size = 25
    },
    {
        type = "technology",
        name = "extreme_power_pole",
        icon_size = 128,
        icon = "__base__/graphics/technology/electric-energy-distribution-1.png",
        effects =
        {
            {
                type = "unlock-recipe",
                recipe = "extreme_power_pole"
            },
        },
        prerequisites = prerequisites,
        unit =
        {
            count = 100,
            ingredients = {
                { "automation-science-pack", 1 },
                { "logistic-science-pack",   1 },
            },
            time = 30,
        },
        order = "c-e-c"
    },
})
