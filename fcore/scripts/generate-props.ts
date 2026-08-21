import { Project, InterfaceDeclaration, PropertySignature, SetAccessorDeclaration } from "ts-morph";
import * as fs from "fs";

const project = new Project({
  skipAddingFilesFromTsConfig: true,
});

const classesSf = project.addSourceFileAtPath("node_modules/typed-factorio/runtime/generated/classes.d.ts");
const runtimeMod = classesSf.getModules().find((m) => m.getName().replace(/['"]/g, "") === "factorio:runtime")!;

const GUI_TYPES: Record<string, { specName: string; membersName: string }> = {
  button: { specName: "ButtonGuiSpec", membersName: "ButtonGuiElementMembers" },
  "sprite-button": { specName: "SpriteButtonGuiSpec", membersName: "SpriteButtonGuiElementMembers" },
  checkbox: { specName: "CheckboxGuiSpec", membersName: "CheckboxGuiElementMembers" },
  radiobutton: { specName: "RadioButtonGuiSpec", membersName: "RadioButtonGuiElementMembers" },
  flow: { specName: "FlowGuiSpec", membersName: "FlowGuiElementMembers" },
  frame: { specName: "FrameGuiSpec", membersName: "FrameGuiElementMembers" },
  label: { specName: "BaseGuiSpec", membersName: "LabelGuiElementMembers" },
  line: { specName: "LineGuiSpec", membersName: "LineGuiElementMembers" },
  progressbar: { specName: "ProgressBarGuiSpec", membersName: "ProgressBarGuiElementMembers" },
  table: { specName: "TableGuiSpec", membersName: "TableGuiElementMembers" },
  textfield: { specName: "TextFieldGuiSpec", membersName: "TextFieldGuiElementMembers" },
  "text-box": { specName: "TextBoxGuiSpec", membersName: "TextBoxGuiElementMembers" },
  sprite: { specName: "SpriteGuiSpec", membersName: "SpriteGuiElementMembers" },
  "scroll-pane": { specName: "ScrollPaneGuiSpec", membersName: "ScrollPaneGuiElementMembers" },
  "drop-down": { specName: "DropDownGuiSpec", membersName: "DropDownGuiElementMembers" },
  "list-box": { specName: "ListBoxGuiSpec", membersName: "ListBoxGuiElementMembers" },
  camera: { specName: "CameraGuiSpec", membersName: "CameraGuiElementMembers" },
  "choose-elem-button": { specName: "ChooseElemButtonGuiSpec", membersName: "ChooseElemButtonGuiElementMembers" },
  slider: { specName: "SliderGuiSpec", membersName: "SliderGuiElementMembers" },
  minimap: { specName: "MinimapGuiSpec", membersName: "MinimapGuiElementMembers" },
  "entity-preview": { specName: "BaseGuiSpec", membersName: "EntityPreviewGuiElementMembers" },
  "empty-widget": { specName: "BaseGuiSpec", membersName: "EmptyWidgetGuiElementMembers" },
  "tabbed-pane": { specName: "BaseGuiSpec", membersName: "TabbedPaneGuiElementMembers" },
  tab: { specName: "TabGuiSpec", membersName: "TabGuiElementMembers" },
  switch: { specName: "SwitchGuiSpec", membersName: "SwitchGuiElementMembers" },
  inventory: { specName: "InventoryGuiSpec", membersName: "InventoryGuiElementMembers" },
};

const baseSpecIface = runtimeMod.getInterfaceOrThrow("BaseGuiSpec");
const baseMemberIface = runtimeMod.getInterfaceOrThrow("BaseGuiElement");

function cleanTypeString(typeStr: string): string {
  return (
    typeStr
      .replace(/import\(".*?"\)\./g, "")
      .replace(/\b(double|float|uint32|int32|uint16|int16|uint8|int8|uint)\b/g, "number")
      .replace(/ \| undefined/g, "")
      .replace(/undefined \| /g, "")
      .replace(/\bundefined\b/g, "")
      .replace(/ \| nil/g, "")
      .replace(/nil \| /g, "")
      .replace(/\bnil\b/g, "")
      .trim() || "any"
  );
}

function extractPropType(p: PropertySignature, iface: InterfaceDeclaration): string {
  const typeStr = p.getTypeNode()?.getText() || p.getType().getText(iface);
  return cleanTypeString(typeStr);
}

function extractSetAccessorType(s: SetAccessorDeclaration, iface: InterfaceDeclaration): string {
  const param = s.getParameters()[0];
  const typeStr = param?.getTypeNode()?.getText() || param?.getType().getText(iface) || "any";
  return cleanTypeString(typeStr);
}

interface GuiTypeData {
  allProps: { name: string; type: string }[];
  create: string[];
  update: string[];
  post: { name: string; type: string }[];
}

const results = new Map<string, GuiTypeData>();

for (const [guiType, config] of Object.entries(GUI_TYPES)) {
  const specIface = runtimeMod.getInterface(config.specName) || baseSpecIface;
  const memberIface = runtimeMod.getInterface(config.membersName) || baseMemberIface;

  // 1. Collect Spec Properties
  const specProps = new Map<string, string>();
  function collectSpecProps(iface: InterfaceDeclaration) {
    for (const p of iface.getProperties()) {
      const name = p.getName().replace(/['"]/g, "");
      if (name !== "type" && name !== "style" && name !== "children" && name !== "tags") {
        specProps.set(name, extractPropType(p, iface));
      }
    }
  }
  collectSpecProps(baseSpecIface);
  if (specIface !== baseSpecIface) {
    collectSpecProps(specIface);
  }

  // 2. Collect Writable Member Properties (Properties and Set Accessors)
  const writableMembers = new Map<string, string>();
  function collectWritable(iface: InterfaceDeclaration) {
    for (const prop of iface.getProperties()) {
      const name = prop.getName().replace(/['"]/g, "");
      if (!prop.isReadonly()) {
        writableMembers.set(name, extractPropType(prop, iface));
      }
    }
    for (const setter of iface.getSetAccessors()) {
      const name = setter.getName().replace(/['"]/g, "");
      writableMembers.set(name, extractSetAccessorType(setter, iface));
    }
  }
  collectWritable(baseMemberIface);
  if (memberIface !== baseMemberIface) {
    collectWritable(memberIface);
  }

  // 3. Classify into create, update, post
  const createList = Array.from(specProps.keys()).sort();
  const updateList = createList.filter((prop) => writableMembers.has(prop));

  const postList: { name: string; type: string }[] = [];
  for (const [name, typeStr] of writableMembers.entries()) {
    if (!specProps.has(name) && name !== "style" && name !== "children" && name !== "tags" && name !== "valid") {
      postList.push({ name, type: typeStr });
    }
  }
  postList.sort((a, b) => a.name.localeCompare(b.name));

  // 4. Combined All Props for JSX Typing
  const allPropsMap = new Map<string, string>();
  for (const [k, v] of specProps.entries()) {
    allPropsMap.set(k, v);
  }
  for (const p of postList) {
    allPropsMap.set(p.name, p.type);
  }

  const allProps = Array.from(allPropsMap.entries())
    .map(([name, type]) => ({ name, type }))
    .sort((a, b) => a.name.localeCompare(b.name));

  results.set(guiType, {
    allProps,
    create: createList,
    update: updateList,
    post: postList,
  });
}

// Extract imports
const importsSet = new Set<string>(["GuiElementType"]);
for (const data of results.values()) {
  for (const p of data.allProps) {
    const matches = p.type.match(/\b[A-Z][a-zA-Z0-9_]*\b/g);
    if (matches) {
      for (const m of matches) {
        if (m !== "Record" && m !== "Array" && m !== "Boolean" && m !== "String" && m !== "Number") {
          importsSet.add(m);
        }
      }
    }
  }
}

let out = `// AUTO-GENERATED FILE. DO NOT EDIT. Run 'npm run generate' to update.\n`;
if (importsSet.size > 0) {
  out += `import type { ${Array.from(importsSet).sort().join(", ")} } from "factorio:runtime";\n`;
}
out += `import type { EventMapping } from "./types";\n\n`;

out += `/**\n * Unified native Factorio GUI element props mapping for JSX.\n */\n`;
out += `export interface NativeElementPropsMap {\n`;
for (const [guiType, data] of results.entries()) {
  out += `  "${guiType}": {\n`;
  for (const p of data.allProps) {
    const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(p.name) ? p.name : JSON.stringify(p.name);
    out += `    ${key}?: ${p.type};\n`;
  }
  out += `  };\n`;
}
out += `}\n\n`;

out += `/**\n * Resolves all valid native GUI props for element type T.\n */\n`;
out += `export type NativePropsFor<T extends string> = T extends keyof NativeElementPropsMap ? NativeElementPropsMap[T] : {};\n\n`;

out += `/**\n * Exact set of all 14 native Factorio GUI event handler prop names.\n */\n`;
out += `export const GUI_EVENT_PROPS: Readonly<Record<keyof EventMapping, true>> = {\n`;
out += `  onClick: true,\n`;
out += `  onClosed: true,\n`;
out += `  onConfirmed: true,\n`;
out += `  onTextChanged: true,\n`;
out += `  onCheckedStateChanged: true,\n`;
out += `  onElemChanged: true,\n`;
out += `  onValueChanged: true,\n`;
out += `  onSelectionStateChanged: true,\n`;
out += `  onSwitchStateChanged: true,\n`;
out += `  onSelectedTabChanged: true,\n`;
out += `  onHover: true,\n`;
out += `  onLeave: true,\n`;
out += `  onLocationChanged: true,\n`;
out += `  onOpened: true,\n`;
out += `};\n\n`;

out += `export interface ElementSchema {\n`;
out += `  /** Whitelist of properties accepted during parent.add(params) */\n`;
out += `  create: Record<string, true>;\n`;
out += `  /** Whitelist of writable properties allowed to update on live LuaGuiElement */\n`;
out += `  update: Record<string, true>;\n`;
out += `  /** Whitelist of post-creation properties assigned directly to LuaGuiElement */\n`;
out += `  post: Record<string, true>;\n`;
out += `}\n\n`;

out += `/**\n * Single source of truth element property schemas for Factorio GUI bridge.\n */\n`;
out += `export const ELEMENT_SCHEMA: Record<GuiElementType, ElementSchema> = {\n`;
for (const [guiType, data] of results.entries()) {
  out += `  "${guiType}": {\n`;
  out += `    create: { ${data.create.map((p) => `"${p}": true`).join(", ")} },\n`;
  out += `    update: { ${data.update.map((p) => `"${p}": true`).join(", ")} },\n`;
  out += `    post: { ${data.post.map((p) => `"${p.name}": true`).join(", ")} },\n`;
  out += `  },\n`;
}
out += `};\n`;

fs.writeFileSync("src/react/generated-props.ts", out);
console.log("Successfully generated src/react/generated-props.ts with escaped keys!");
