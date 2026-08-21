import type { LocalisedString, RadioButtonGuiElement, OnGuiCheckedStateChangedEvent } from "factorio:runtime";
import { createElement } from "../react";
import { RadioButton } from "./RadioButton";
import { HFlow } from "./HFlow";
import { VFlow } from "./VFlow";

/**
 * Single item descriptor for `RadioButtons` group.
 */
export interface RadioButtonItem<T> {
  /** Unique value or identifier for this radio choice. */
  key: T;
  /** Localised caption to display next to the radio button. */
  caption: LocalisedString;
}

/**
 * Props for the `RadioButtons` group component.
 */
export interface RadioButtonsProps<T> {
  /** Array of radio button item choices. */
  buttons?: RadioButtonItem<T>[];
  /** Currently selected choice key. */
  value?: T;
  /** Callback fired with the newly selected key when the user selects a choice. */
  onChange?: (this: void, value: T) => void;
  /**
   * Layout direction for the radio group.
   * @default "vertical"
   */
  direction?: "horizontal" | "vertical";
}

/**
 * Grouped single-selection radio button list.
 *
 * @example
 * ```tsx
 * <RadioButtons
 *   value={selectedMode}
 *   buttons={[
 *     { key: "counts", caption: "Counts Mode" },
 *     { key: "stacks", caption: "Stacks Mode" },
 *   ]}
 *   onChange={(mode) => setSelectedMode(mode)}
 * />
 * ```
 */
export function RadioButtons<T>(props: RadioButtonsProps<T>) {
  const { buttons = [], value, onChange, direction = "vertical" } = props;

  const FlowComponent = direction === "horizontal" ? HFlow : VFlow;

  return (
    <FlowComponent>
      {buttons.map((elem, i) => (
        <RadioButton
          key={tostring(elem.key) || tostring(i)}
          caption={elem.caption}
          state={elem.key === value}
          styles={{ horizontally_stretchable: true }}
          onCheckedStateChanged={(ev: OnGuiCheckedStateChangedEvent) => {
            const elt = ev.element as RadioButtonGuiElement;
            if (elt && elt.valid && elt.state && onChange) {
              onChange(elem.key);
            }
          }}
        />
      ))}
    </FlowComponent>
  );
}
