local technologies_cranes = {
    {
        name = "cranes-mk1",
        prerequisites = { "railway" },
        effects = {
            {
                type = "unlock-recipe",
                recipe = "crane-short-mk1"
            },
            {
                type = "unlock-recipe",
                recipe = "crane-mk1"
            },
        },
        unit = {
            count = 250,
            time = 45,
            ingredients = {
                { "automation-science-pack", 2 },
                { "py-science-pack-1",       1 },
            }
        }
    },
    {
        name = "cranes-mk2",
        prerequisites = { "railway-mk02", "cranes-mk1" },
        effects = {
            {
                type = "unlock-recipe",
                recipe = "crane-short-mk2"
            },
            {
                type = "unlock-recipe",
                recipe = "crane-mk2"
            },
        },
        unit = {
            count = 250,
            time = 45,
            ingredients = {
                { "automation-science-pack", 6 },
                { "py-science-pack-1",       3 },
                { "logistic-science-pack",   2 },
                { "py-science-pack-2",       1 },
            }
        }
    },
    {
        name = "cranes-mk3",
        prerequisites = { "railway-mk03", "cranes-mk2" },
        effects = {
            {
                type = "unlock-recipe",
                recipe = "crane-short-mk3"
            },
            {
                type = "unlock-recipe",
                recipe = "crane-mk3"
            },
        },
        unit = {
            count = 250,
            time = 45,
            ingredients = {
                { "automation-science-pack", 20 },
                { "py-science-pack-1",       10 },
                { "logistic-science-pack",   6 },
                { "py-science-pack-2",       3 },
                { "chemical-science-pack",   2 },
                { "py-science-pack-3",       1 },
            }
        }
    },
    {
        name = "cranes-mk4",
        prerequisites = { "railway-mk04", "cranes-mk3" },
        effects = {
            {
                type = "unlock-recipe",
                recipe = "crane-short-mk4"
            },
            {
                type = "unlock-recipe",
                recipe = "crane-mk4"
            },
        },
        unit = {
            count = 250,
            time = 45,
            ingredients = {
                { "automation-science-pack", 60 },
                { "py-science-pack-1",       30 },
                { "logistic-science-pack",   20 },
                { "py-science-pack-2",       10 },
                { "chemical-science-pack",   6 },
                { "py-science-pack-3",       3 },
                { "production-science-pack", 2 },
                { "py-science-pack-4",       1 },
            }
        }
    },
}

local function make_technology_crane(params)
    data:extend({
        {
            type = "technology",
            name = params.name,
            icon = "__pyindustrygraphics__/graphics/icons/" .. params.name:sub(1, 5) .. params.name:sub(7) .. ".png",
            icon_size = 64,
            prerequisites = params.prerequisites,
            effects = params.effects,
            unit = params.unit
        }
    })
end

for _, value in ipairs(technologies_cranes) do
    make_technology_crane(value)
end
