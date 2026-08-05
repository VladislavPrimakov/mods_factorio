local items_cranes = {
  {
    name = "crane-short-mk1",
    stack_size = 20,
  },
  {
    name = "crane-short-mk2",
    stack_size = 20,
  },
  {
    name = "crane-short-mk3",
    stack_size = 20,
  },
  {
    name = "crane-short-mk4",
    stack_size = 20,
  },
  {
    name = "crane-mk1",
    stack_size = 10,
  },
  {
    name = "crane-mk2",
    stack_size = 10,
  },
  {
    name = "crane-mk3",
    stack_size = 10,
  },
  {
    name = "crane-mk4",
    stack_size = 10,
  }
}

local function make_item_crane(params)
  data:extend({
    {
      type = "item",
      name = params.name,
      icon = "__pyindustrygraphics__/graphics/icons/" .. params.name .. ".png",
      icon_size = 64,
      subgroup = "inserter",
      order = "z-r[" .. params.name .. "]",
      place_result = params.name,
      stack_size = params.stack_size
    },
  })
end

for _, value in ipairs(items_cranes) do
  make_item_crane(value)
end
