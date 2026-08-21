import { createElement } from "../react";
import { SpriteButton, type SpriteButtonProps } from "./SpriteButton";

/**
 * Props for the Factorio `CloseButton` component.
 */
export type CloseButtonProps = SpriteButtonProps;

/**
 * Standard Factorio window close action button (red cross in titlebar).
 * Pre-configured with `frame_action_button` style and `utility/close` sprite.
 *
 * @example
 * ```tsx
 * <CloseButton onClick={() => setOpened(false)} />
 * ```
 */
export function CloseButton(props: CloseButtonProps) {
  return (
    <SpriteButton style="frame_action_button" sprite="utility/close" hovered_sprite="utility/close" mouse_button_filter={["left"]} {...props}>
      {props.children}
    </SpriteButton>
  );
}
