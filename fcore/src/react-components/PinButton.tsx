import type { OnGuiClickEvent } from "factorio:runtime";
import { createElement } from "../react";
import { SpriteButton, type SpriteButtonProps } from "./SpriteButton";

/**
 * Props for the `PinButton` component.
 */
export type PinButtonProps = SpriteButtonProps & {
  /** Current pinned state of the window. */
  pinned?: boolean;
  /** Callback fired when the player toggles the pin button. */
  onTogglePin?: (this: void, pinned: boolean, ev: OnGuiClickEvent) => void;
};

/**
 * Window pin button for titlebars.
 * Automatically toggles between white/black pin icons and manages pinned state.
 *
 * @example
 * ```tsx
 * <PinButton pinned={isPinned} onTogglePin={(next) => setIsPinned(next)} />
 * ```
 */
export function PinButton(props: PinButtonProps) {
  const { pinned = false, onTogglePin, onClick, ...rest } = props;
  const spriteName = pinned ? "react_pin_black" : "react_pin_white";
  return (
    <SpriteButton
      style="frame_action_button"
      sprite={spriteName}
      toggled={pinned}
      tooltip="Pin this window. When pinned, it will not be automatically closed."
      mouse_button_filter={["left"]}
      onClick={(ev) => {
        if (onTogglePin) onTogglePin(!pinned, ev);
        if (onClick) onClick(ev);
      }}
      {...rest}
    />
  );
}
