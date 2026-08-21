import type { StringSettingDefinition } from "factorio:settings";

(data.extend as (this: typeof data, other_data: unknown[]) => void)([
  {
    type: "string-setting",
    name: "fcore-log-level",
    setting_type: "runtime-global",
    default_value: "WARN",
    allowed_values: ["TRACE", "DEBUG", "INFO", "WARN", "ERROR"],
    localised_name: ["", "Log level"],
  } satisfies StringSettingDefinition,
]);
