local setting_types = { "bool-setting", "int-setting", "double-setting", "string-setting" }

local function change_setting(setting_name, setting_value)
    for _, setting_type in pairs(setting_types) do
        if data.raw[setting_type][setting_name] then
            data.raw[setting_type][setting_name].default_value = setting_value
        end
    end
end

-- flow control
change_setting("flow-control-new-group", false)
-- pumps
change_setting("osm-pumps-landfill-goes-boom", false)
-- qol reseach
change_setting("qol-player-reach-research-enabled", false)
-- autodeconstruct
change_setting("autodeconstruct-remove-fluid-drills", false)
-- statsgui
change_setting("statsgui-single-line", false)
change_setting("statsgui-adjust-for-clock", true)
change_setting("statsgui-show-sensor-daytime", false)
change_setting("statsgui-show-sensor-pollution", false)
change_setting("statsgui-ms-max-speed-vehicle", true)
-- additional paste setting
change_setting("additional-paste-settings-options-requester-multiplier-value", 4)
change_setting("additional-paste-settings-options-sumup", true)
-- nanobots
change_setting("nanobots-network-limits", false)
-- dad-jokes
change_setting("dj-nsfw", true)
-- helmod
change_setting("helmod_display_all_sheet", true)
