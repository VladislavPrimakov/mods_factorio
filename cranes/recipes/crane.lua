data:extend({

  -- 3x1 GREEN (Bulk)
  {
    type = "recipe",
    name = "crane-short",
    enabled = false,
    energy_required = 1.5,
    ingredients =
    {
      { type = "item", name = "iron-gear-wheel",    amount = 50 },
      { type = "item", name = "electronic-circuit", amount = 25 },
      { type = "item", name = "advanced-circuit",   amount = 10 },
      { type = "item", name = "bulk-inserter",      amount = 3 },
    },

    results = {
      { type = "item", name = "crane-short", amount = 1 }
    }
  },
  -- 6x1 GREEN (Bulk)
  {
    type = "recipe",
    name = "crane",
    enabled = false,
    energy_required = 3,
    ingredients =
    {
      { type = "item", name = "iron-gear-wheel",    amount = 100 },
      { type = "item", name = "electronic-circuit", amount = 50 },
      { type = "item", name = "advanced-circuit",   amount = 20 },
      { type = "item", name = "bulk-inserter",      amount = 6 },
    },
    results = {
      { type = "item", name = "crane", amount = 1 }
    }
  },
})
