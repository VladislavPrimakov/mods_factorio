---@param res_name string
---@param mining_time double
local function set_mining_time_to_resource(res_name, mining_time)
    if data.raw["resource"][res_name] then
        data.raw["resource"][res_name].minable.mining_time = mining_time
    end
end

---@param entity_name string
---@param effect string
local function set_allowed_effects(entity_name, effect)
    if type(effect) == "string" then
        if effect == "consumption" or effect == "speed" or effect == "productivity" or effect == "pollution" or effect == "quality" then
            if data.raw["assembling-machine"][entity_name] then
                if data.raw["assembling-machine"][entity_name].allowed_effects == nil then
                    data.raw["assembling-machine"][entity_name].allowed_effects = { effect }
                else
                    table.insert(data.raw["assembling-machine"][entity_name].allowed_effects, effect)
                end
            end
        end
    end
end

---@param loader_name string
---@param stack_size uint
local function set_loader_max_belt_stack_size(loader_name, stack_size)
    if stack_size and data.raw["loader-1x1"][loader_name] then
        data.raw["loader-1x1"][loader_name].max_belt_stack_size = stack_size
    end
end

---@param recipe_name string
---@param ingredients table
local function set_recipe_ingredients(recipe_name, ingredients)
    if data.raw["recipe"][recipe_name] then
        data.raw["recipe"][recipe_name].ingredients = ingredients
    end
end

---@param tech_name string
---@param recipe_name string
local function add_recipe_unlock_to_technology(tech_name, recipe_name)
    if data.raw["technology"][tech_name] then
        if not data.raw["technology"][tech_name].effects then
            data.raw["technology"][tech_name].effects = {}
        end
        table.insert(data.raw["technology"][tech_name].effects, { type = "unlock-recipe", recipe = recipe_name })
    end
end

-- mining mining time for big drills
set_mining_time_to_resource("aluminium-rock", 1)

-- neutron-absorver add speed modules
for i = 1, 4 do
    set_allowed_effects("neutron-absorber-mk0" .. i, "speed")
end

-- loaders
local max_belt_stack_size
if data.raw["inserter"]["py-stack-inserter"] then
    max_belt_stack_size = data.raw["inserter"]["py-stack-inserter"].max_belt_stack_size
end

set_loader_max_belt_stack_size("transport-belt-loader", max_belt_stack_size)
set_loader_max_belt_stack_size("fast-transport-belt-loader", max_belt_stack_size)
set_loader_max_belt_stack_size("express-transport-belt-loader", max_belt_stack_size)

set_recipe_ingredients("transport-belt-loader", {
    { type = "item", name = "transport-belt",     amount = 1 },
    { type = "item", name = "electronic-circuit", amount = 1 },
    { type = "item", name = "small-parts-01",     amount = 10 },
    { type = "item", name = "duralumin",          amount = 5 },
})

set_recipe_ingredients("fast-transport-belt-loader", {
    { type = "item", name = "fast-transport-belt", amount = 1 },
    { type = "item", name = "advanced-circuit",    amount = 1 },
    { type = "item", name = "small-parts-02",      amount = 10 },
    { type = "item", name = "stainless-steel",     amount = 5 },
})

set_recipe_ingredients("express-transport-belt-loader", {
    { type = "item", name = "express-transport-belt", amount = 1 },
    { type = "item", name = "processing-unit",        amount = 1 },
    { type = "item", name = "small-parts-03",         amount = 10 },
    { type = "item", name = "super-steel",            amount = 5 },
})

-- stack inserter
local item_sounds = require("__base__.prototypes.item_sounds")
local hit_effects = require("__base__.prototypes.entity.hit-effects")
local sounds = require("__base__.prototypes.entity.sounds")

data:extend({
    {
        type = "corpse",
        name = "stack-inserter-remnants",
        icon = "__modpack_pyanodon__/graphics/stack-inserter.png",
        flags = { "placeable-neutral", "not-on-map" },
        hidden_in_factoriopedia = true,
        subgroup = "inserter-remnants",
        order = "a-h-a",
        selection_box = { { -0.5, -0.5 }, { 0.5, 0.5 } },
        tile_width = 1,
        tile_height = 1,
        selectable_in_game = false,
        time_before_removed = 60 * 60 * 15, -- 15 minutes
        expires = false,
        final_render_layer = "remnants",
        remove_on_tile_placement = false,
        animation = make_rotated_animation_variations_from_sheet(4,
            {
                filename = "__modpack_pyanodon__/graphics/stack-inserter-remnants.png",
                line_length = 1,
                width = 132,
                height = 96,
                direction_count = 1,
                shift = util.by_pixel(3, -1.5),
                scale = 0.5
            })
    },
    {
        type = "inserter",
        name = "stack-inserter",
        icon = "__modpack_pyanodon__/graphics/stack-inserter.png",
        flags = { "placeable-neutral", "placeable-player", "player-creation" },
        allow_custom_vectors = true,
        stack_size_bonus = 4,
        bulk = true,
        grab_less_to_match_belt_stack = true,
        wait_for_full_hand = true,
        enter_drop_mode_if_held_stack_spoiled = true,
        max_belt_stack_size = max_belt_stack_size,
        minable = { mining_time = 0.1, result = "stack-inserter" },
        max_health = 160,
        corpse = "stack-inserter-remnants",
        dying_explosion = "bulk-inserter",
        resistances =
        {
            {
                type = "fire",
                percent = 90
            }
        },
        collision_box = { { -0.15, -0.15 }, { 0.15, 0.15 } },
        selection_box = { { -0.4, -0.35 }, { 0.4, 0.45 } },
        damaged_trigger_effect = hit_effects.entity(),
        pickup_position = { 0, -1 },
        insert_position = { 0, 1.2 },
        energy_per_movement = "40kJ",
        energy_per_rotation = "40kJ",
        energy_source =
        {
            type = "electric",
            usage_priority = "secondary-input",
            drain = "1kW"
        },
        extension_speed = 0.1,
        rotation_speed = 0.04,
        filter_count = 5,
        icon_draw_specification = { scale = 0.5 },
        fast_replaceable_group = "inserter",
        open_sound = sounds.inserter_open,
        close_sound = sounds.inserter_close,
        working_sound = sounds.inserter_fast,
        hand_base_picture =
        {
            filename = "__modpack_pyanodon__/graphics/stack-inserter-hand-base.png",
            priority = "extra-high",
            width = 32,
            height = 136,
            scale = 0.25
        },
        hand_closed_picture =
        {
            filename = "__modpack_pyanodon__/graphics/stack-inserter-hand-closed.png",
            priority = "extra-high",
            width = 112,
            height = 164,
            scale = 0.25
        },
        hand_open_picture =
        {
            filename = "__modpack_pyanodon__/graphics/stack-inserter-hand-open.png",
            priority = "extra-high",
            width = 134,
            height = 164,
            scale = 0.25
        },
        hand_base_shadow =
        {
            filename = "__base__/graphics/entity/burner-inserter/burner-inserter-hand-base-shadow.png",
            priority = "extra-high",
            width = 32,
            height = 132,
            scale = 0.25
        },
        hand_closed_shadow =
        {
            filename = "__modpack_pyanodon__/graphics/stack-inserter-hand-closed-shadow.png",
            priority = "extra-high",
            width = 112,
            height = 164,
            scale = 0.25
        },
        hand_open_shadow =
        {
            filename = "__modpack_pyanodon__/graphics/stack-inserter-hand-open-shadow.png",
            priority = "extra-high",
            width = 134,
            height = 164,
            scale = 0.25
        },
        platform_picture =
        {
            sheet =
            {
                filename = "__modpack_pyanodon__/graphics/stack-inserter-platform.png",
                priority = "extra-high",
                width = 105,
                height = 79,
                shift = util.by_pixel(1.5, 7.5 - 1),
                scale = 0.5
            }
        },
        circuit_connector = circuit_connector_definitions["inserter"],
        circuit_wire_max_distance = inserter_circuit_wire_max_distance,
        default_stack_control_input_signal = inserter_default_stack_control_input_signal
    },
    {
        type = "item",
        name = "stack-inserter",
        icon = "__modpack_pyanodon__/graphics/stack-inserter.png",
        subgroup = "inserter",
        color_hint = { text = "S" },
        order = "h[a-stack-inserter]",
        inventory_move_sound = item_sounds.wire_inventory_move,
        pick_sound = item_sounds.wire_inventory_pickup,
        drop_sound = item_sounds.wire_inventory_move,
        place_result = "stack-inserter",
        stack_size = 50,
    },
    {
        type = "recipe",
        name = "stack-inserter",
        enabled = false,
        energy_required = 0.5,
        categories = { "crafting-with-fluid" },
        ingredients =
        {
            { type = "item",  name = "fast-inserter",      amount = 1 },
            { type = "item",  name = "engine-unit",        amount = 1 },
            { type = "item",  name = "electronic-circuit", amount = 3 },
            { type = "item",  name = "belt",               amount = 3 },
            { type = "item",  name = "small-parts-01",     amount = 5 },
            { type = "item",  name = "nbfe-alloy",         amount = 5 },
            { type = "fluid", name = "lubricant",          amount = 100 }
        },
        results = { { type = "item", name = "stack-inserter", amount = 1 } }
    },
})

add_recipe_unlock_to_technology("py-transport-belt-capacity-1", "stack-inserter")
