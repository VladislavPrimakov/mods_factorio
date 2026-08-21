import type { SignalID, LuaGuiElement, DropDownGuiElement, TextFieldGuiElement, ChooseElemButtonGuiElement, OnGuiClickEvent, OnGuiElemChangedEvent } from "factorio:runtime";
import { createElement, useState, useEffect, useRef, type Key, type ReactNode } from "../react";
import type { StyleFor, StylesFor } from "../styles";
import { Checkbox } from "./Checkbox";
import { Dropdown } from "./Dropdown";
import { EmptyWidget } from "./EmptyWidget";
import { Frame } from "./Frame";
import { Input } from "./Input";
import { Label } from "./Label";
import { HFlow } from "./HFlow";
import { SpriteButton } from "./SpriteButton";
import { SlotButtonTable } from "./SlotButtonTable";
import { SlotButton } from "./SlotButton";
import { VFlow } from "./VFlow";

/**
 * Retrieves all unique logistic group names across forces in the game using the native Factorio API (LuaForce::get_logistic_groups).
 */
export function getAllGlobalGroups(): string[] {
  const groupMap: Record<string, true> = {};

  if (typeof game !== "undefined" && game && game.forces) {
    for (const [_, force] of pairs(game.forces)) {
      if (force && force.valid) {
        if (typeof force.get_logistic_groups === "function") {
          const [ok, groups] = pcall(function () {
            return force.get_logistic_groups();
          });
          if (ok && groups) {
            for (const groupName of groups) {
              if (groupName && groupName !== "") {
                groupMap[groupName] = true;
              }
            }
          }
        }
      }
    }
  }

  const names: string[] = [];
  for (const [name] of pairs(groupMap)) {
    names.push(name as string);
  }
  names.sort();
  return names;
}

export interface SectionSlotData {
  signal?: SignalID;
  count?: number;
  selected?: boolean;
  upper?: number;
}

export interface SectionGroupProps {
  key?: Key;
  /** Name of the group */
  name?: string;
  /** Placeholder text when name is empty */
  placeholder?: string;
  /** Whether the section is active / enabled */
  active?: boolean;
  /** Callback when active checkbox state changes */
  onActiveChange?: (this: void, active: boolean) => void;
  /** Callback when name is edited */
  onNameChange?: (this: void, newName: string) => void;
  /** Callback when section is deleted */
  onDelete?: (this: void) => void;
  /** Total number of slots to display (default: 10) */
  slotCount?: number;
  /** Number of columns in slot table (default: 10) */
  columnCount?: number;
  /** Style for slot table (default: "table") */
  tableStyle?: StyleFor<"table">;
  /** Array or Record of slot data (1-based index or array) */
  slots?: Record<number, SectionSlotData | undefined> | SectionSlotData[];
  /** Currently selected slot index (1-based) */
  selectedSlot?: number;
  /** Callback when a slot is clicked */
  onSlotClick?: (this: void, slotIndex: number, ev: OnGuiClickEvent) => void;
  /** Callback when a slot's signal is changed / chosen in picker */
  onSlotChange?: (this: void, slotIndex: number, signal: SignalID | undefined, ev: OnGuiElemChangedEvent | OnGuiClickEvent) => void;
  /** Custom styles for the root container flow */
  styles?: StylesFor<"flow">;
}

/**
 * Logistic/Combinator section group component.
 * Features an active toggle checkbox, in-line name editing with autofocus,
 * global logistic group presets dropdown, delete button, and a customizable slot grid.
 *
 * @example
 * ```tsx
 * <SectionGroup
 *   name="Fuel Supply"
 *   active={true}
 *   slotCount={10}
 *   columnCount={10}
 *   slots={groupSlots}
 *   onActiveChange={(active) => setGroupActive(active)}
 *   onNameChange={(name) => setGroupName(name)}
 *   onSlotChange={(slotIdx, sig) => updateSlot(slotIdx, sig)}
 * />
 * ```
 */
export function SectionGroup(props: SectionGroupProps) {
  const {
    name = "",
    placeholder = "[no group assigned]",
    active = true,
    onActiveChange,
    onNameChange,
    onDelete,
    slotCount = 10,
    columnCount = 10,
    tableStyle = "slot_table",
    slots,
    selectedSlot,
    onSlotClick,
    onSlotChange,
    styles,
  } = props;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draftName, setDraftName] = useState<string>(name);
  const [presets, setPresets] = useState<string[]>(() => {
    const globalGroups = getAllGlobalGroups();
    return globalGroups.length > 0 ? ["Presets...", ...globalGroups] : ["Presets..."];
  });

  const refreshPresets = () => {
    const globalGroups = getAllGlobalGroups();
    if (globalGroups.length > 0) {
      setPresets(["Presets...", ...globalGroups]);
    } else {
      setPresets(["Presets..."]);
    }
  };

  const inputRef = useRef<TextFieldGuiElement>();

  const isPlaceholder = name === "" || name === placeholder;
  const rawDisplayName = isPlaceholder ? placeholder : name;
  const maxCaptionLen = 22;
  const displayCaption = rawDisplayName.length > maxCaptionLen ? rawDisplayName.substring(0, maxCaptionLen - 3) + "..." : rawDisplayName;
  const tooltipText = rawDisplayName;

  const handleStartEdit = () => {
    setDraftName(name);
    refreshPresets();
    setIsEditing(true);
  };

  const handleSave = () => {
    const finalName = draftName === placeholder ? "" : draftName;
    if (onNameChange) {
      onNameChange(finalName);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftName(name);
    setIsEditing(false);
  };

  // Autofocus input textfield when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current && inputRef.current.valid) {
      inputRef.current.focus();
      inputRef.current.select_all();
    }
  }, [isEditing]);

  // Calculate max used slot index with a signal
  let maxUsedSlot = 0;
  if (slots !== undefined) {
    for (const [k, v] of pairs(slots as Record<number, SectionSlotData | undefined>)) {
      const idx = tonumber(k);
      if (idx !== undefined && v !== undefined && v.signal !== undefined && v.signal.name) {
        if (idx > maxUsedSlot) {
          maxUsedSlot = idx;
        }
      }
    }
  }

  const cols = columnCount || 10;
  const defaultMinSlots = slotCount !== undefined ? slotCount : 10;
  const rowsNeeded = Math.max(Math.ceil(defaultMinSlots / cols), Math.floor(maxUsedSlot / cols) + 1);
  const totalSlots = rowsNeeded * cols;

  const slotButtons: ReactNode[] = [];
  for (let slotIndex = 1; slotIndex <= totalSlots; slotIndex++) {
    const currentSlot = slotIndex;
    const sdata: SectionSlotData | undefined = slots !== undefined ? (slots as Record<number, SectionSlotData | undefined>)[currentSlot] : undefined;
    const hasFill = sdata !== undefined && sdata.signal !== undefined && sdata.signal.name;
    const isSelected = selectedSlot === currentSlot || (sdata !== undefined && sdata.selected === true);

    if (hasFill) {
      slotButtons.push(
        <SlotButton
          key={`slot-${currentSlot}`}
          signal={sdata.signal}
          count={sdata.count}
          upper={sdata.upper}
          locked={true}
          selected={isSelected}
          onClick={(ev) => {
            if (ev.button === defines.mouse_button_type.right) {
              // Right-click: remove signal from slot
              if (onSlotChange) onSlotChange(currentSlot, undefined, ev);
            } else {
              // Left-click: select slot for count/stacks editing
              if (onSlotClick) onSlotClick(currentSlot, ev);
            }
          }}
        />,
      );
    } else {
      // Empty slot: unlocked, pick a new signal via elem picker
      slotButtons.push(
        <SlotButton
          key={`slot-${currentSlot}`}
          locked={false}
          selected={isSelected}
          onChange={(chosenSignal, ev) => {
            if (chosenSignal && chosenSignal.name && slots !== undefined) {
              for (const [k, v] of pairs(slots as Record<number, SectionSlotData | undefined>)) {
                const otherIdx = tonumber(k);
                if (otherIdx !== currentSlot && v && v.signal && v.signal.name === chosenSignal.name) {
                  if (ev && ev.element && ev.element.valid) {
                    (ev.element as ChooseElemButtonGuiElement).elem_value = undefined;
                  }
                  return;
                }
              }
            }
            if (onSlotChange) onSlotChange(currentSlot, chosenSignal, ev);
          }}
        />,
      );
    }
  }

  return (
    <VFlow styles={{ bottom_margin: 6, ...styles }}>
      <Frame style="repeated_subheader_frame" direction="horizontal" styles={{ vertical_align: "center", horizontally_stretchable: true }}>
        <Checkbox
          style="subheader_caption_checkbox"
          state={active}
          onChange={(val) => {
            if (onActiveChange) onActiveChange(val);
          }}
        />

        {!isEditing ? (
          <HFlow styles={{ vertical_align: "center", horizontally_stretchable: true }}>
            <SpriteButton sprite="utility/rename_icon" style="mini_button_aligned_to_text_vertically_when_centered" tooltip="Edit section name" onClick={handleStartEdit} />
            <Label
              style="bold_label"
              caption={displayCaption}
              tooltip={tooltipText}
              styles={{
                left_margin: 4,
                maximal_width: 160,
                single_line: true,
              }}
            />
            <EmptyWidget styles={{ horizontally_stretchable: true }} />
            {onDelete && <SpriteButton sprite="utility/trash" style="tool_button_red" tooltip="Delete section" onClick={onDelete} />}
          </HFlow>
        ) : (
          <HFlow styles={{ vertical_align: "center", horizontally_stretchable: true }}>
            <SpriteButton sprite="utility/confirm_slot" style="mini_button_aligned_to_text_vertically_when_centered" tooltip="Save name" onClick={handleSave} />
            <SpriteButton sprite="utility/close" style="mini_button_aligned_to_text_vertically_when_centered" tooltip="Cancel" onClick={handleCancel} />
            <Input
              ref={inputRef}
              text={draftName}
              styles={{
                width: 160,
                height: 24,
                left_margin: 4,
              }}
              onChange={(val) => {
                setDraftName(tostring(val));
              }}
              onConfirm={() => {
                handleSave();
              }}
            />
            <Dropdown
              items={presets.length > 0 ? presets : ["Presets..."]}
              selected_index={1}
              styles={{ height: 24, width: 100, left_margin: 4 }}
              onSelectionStateChanged={(ev) => {
                const elt = ev.element as DropDownGuiElement;
                if (elt && elt.valid && elt.selected_index > 1) {
                  const chosen = presets[elt.selected_index - 1];
                  if (chosen !== undefined) {
                    setDraftName(chosen);
                    if (inputRef.current && inputRef.current.valid) {
                      inputRef.current.focus();
                      inputRef.current.select_all();
                    }
                  }
                  elt.selected_index = 1;
                }
              }}
            />
            <EmptyWidget styles={{ horizontally_stretchable: true }} />
            {onDelete && <SpriteButton sprite="utility/trash" style="tool_button_red" tooltip="Delete section" onClick={onDelete} />}
          </HFlow>
        )}
      </Frame>
      <SlotButtonTable column_count={columnCount} style={tableStyle || "slot_table"} styles={{ top_margin: 4 }}>
        {slotButtons}
      </SlotButtonTable>
    </VFlow>
  );
}
