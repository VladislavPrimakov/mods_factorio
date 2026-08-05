local recipes_cranes = {
  {
    name = "crane-short-mk1",
    energy_required = 2,
    ingredients = {
      { type = "item", name = "mechanical-parts-01", amount = 1 },
      { type = "item", name = "electronic-circuit",  amount = 4 },
      { type = "item", name = "steel-plate",         amount = 8 },
      { type = "item", name = "small-parts-01",      amount = 12 },
    }
  },
  {
    name = "crane-short-mk2",
    energy_required = 4,
    ingredients = {
      { type = "item", name = "crane-short-mk1",     amount = 1 },
      { type = "item", name = "mechanical-parts-02", amount = 1 },
      { type = "item", name = "advanced-circuit",    amount = 4 },
      { type = "item", name = "stainless-steel",     amount = 8 },
      { type = "item", name = "small-parts-02",      amount = 12 },
    }
  },
  {
    name = "crane-short-mk3",
    energy_required = 6,
    ingredients = {
      { type = "item", name = "crane-short-mk2",     amount = 1 },
      { type = "item", name = "mechanical-parts-03", amount = 1 },
      { type = "item", name = "processing-unit",     amount = 4 },
      { type = "item", name = "super-steel",         amount = 8 },
      { type = "item", name = "small-parts-03",      amount = 12 },
    }
  },
  {
    name = "crane-short-mk4",
    energy_required = 8,
    ingredients = {
      { type = "item", name = "crane-short-mk3",     amount = 1 },
      { type = "item", name = "mechanical-parts-04", amount = 1 },
      { type = "item", name = "intelligent-unit",    amount = 4 },
      { type = "item", name = "super-alloy",         amount = 8 },
      { type = "item", name = "small-parts-03",      amount = 12 },
    }
  },
  {
    name = "crane-mk1",
    energy_required = 4,
    ingredients = {
      { type = "item", name = "mechanical-parts-01", amount = 1 },
      { type = "item", name = "electronic-circuit",  amount = 6 },
      { type = "item", name = "steel-plate",         amount = 15 },
      { type = "item", name = "small-parts-01",      amount = 20 },
    }
  },
  {
    name = "crane-mk2",
    energy_required = 8,
    ingredients = {
      { type = "item", name = "crane-mk1",           amount = 1 },
      { type = "item", name = "mechanical-parts-02", amount = 1 },
      { type = "item", name = "advanced-circuit",    amount = 6 },
      { type = "item", name = "stainless-steel",     amount = 15 },
      { type = "item", name = "small-parts-02",      amount = 20 },
    }
  },
  {
    name = "crane-mk3",
    energy_required = 12,
    ingredients = {
      { type = "item", name = "crane-mk2",           amount = 1 },
      { type = "item", name = "mechanical-parts-03", amount = 1 },
      { type = "item", name = "processing-unit",     amount = 6 },
      { type = "item", name = "super-steel",         amount = 15 },
      { type = "item", name = "small-parts-03",      amount = 20 },
    }
  },
  {
    name = "crane-mk4",
    energy_required = 16,
    ingredients = {
      { type = "item", name = "crane-mk3",           amount = 1 },
      { type = "item", name = "mechanical-parts-04", amount = 1 },
      { type = "item", name = "intelligent-unit",    amount = 6 },
      { type = "item", name = "super-alloy",         amount = 15 },
      { type = "item", name = "small-parts-03",      amount = 20 },
    }
  }
}

local function make_recipe_crane(params)
  data:extend({
    {
      type = "recipe",
      name = params.name,
      enabled = false,
      energy_required = params.energy_required,
      ingredients = params.ingredients,
      results = {
        { type = "item", name = params.name, amount = 1 }
      }
    }
  })
end

for _, value in ipairs(recipes_cranes) do
  make_recipe_crane(value)
end
