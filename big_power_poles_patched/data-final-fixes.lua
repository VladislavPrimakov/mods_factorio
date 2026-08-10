local ingredients = nil
if mods["pycoalprocessing"] then
    ingredients = util.table.deepcopy(data.raw["recipe"]["big-electric-pole"].ingredients)
    for _, ing in pairs(ingredients) do
        ing.amount = ing.amount * 2
    end
else
    ingredients = {
        { type = "item", name = "iron-stick",   amount = 16 },
        { type = "item", name = "steel-plate",  amount = 10 },
        { type = "item", name = "copper-plate", amount = 5 },
    }
end

data:extend({
    {
        type = "recipe",
        name = "extreme_power_pole",
        enabled = false,
        ingredients = ingredients,
        results = { { type = "item", name = "extreme_power_pole", amount = 1 } }
    },
})
