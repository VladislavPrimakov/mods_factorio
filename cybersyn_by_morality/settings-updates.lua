local setting_types = { "bool-setting", "int-setting", "double-setting", "string-setting" }

local function change_setting(setting_name, setting_value)
    for _, setting_type in pairs(setting_types) do
        if data.raw[setting_type][setting_name] then
            data.raw[setting_type][setting_name].default_value = setting_value
        end
    end
end

-- cybersyn
change_setting("cybersyn-manager-enabled", true)
change_setting("cybersyn-request-threshold", 40)
change_setting("cybersyn-priority", 10)
-- cybersyn-combinator
change_setting("cybersyn-combinator-use-stacks", true)
-- WideChests
change_setting("WideChests_mergeable-chest-steel-chest", "chest-warehouse")
change_setting("WideChests_max-chest-width", 40)
change_setting("WideChests_max-chest-height", 40)
change_setting("WideChests_max-chest-area", 1600)
change_setting("WideChests_inventory-size-multiplier", 1)
change_setting("WideChests_inventory-size-limit", 10000)
change_setting("WideChests_whitelist-chest-sizes", "1xN 2xN 3xN 4xN 5xN")
change_setting("WideChests_mirror-whitelists", true)
-- WideChestsLogistic
change_setting("WideChests_mergeable-chest-passive-provider-chest", "chest-warehouse")
change_setting("WideChests_mergeable-chest-active-provider-chest", "chest-warehouse")
change_setting("WideChests_mergeable-chest-storage-chest", "chest-warehouse")
change_setting("WideChests_mergeable-chest-buffer-chest", "chest-warehouse")
change_setting("WideChests_mergeable-chest-requester-chest", "chest-warehouse")
