import type { FrameGuiElement, EmptyWidgetGuiElement, LuaGuiElement, OnGuiClickEvent, LocalisedString } from "factorio:runtime";
import { createElement } from "../react";
import { CloseButton } from "./CloseButton";
import { Label } from "./Label";
import { EmptyWidget } from "./EmptyWidget";
import { HFlow, type HFlowProps } from "./HFlow";

/**
 * Props for the `Titlebar` window header component.
 */
export type TitlebarProps = HFlowProps & {
  /** Title text or localized string. */
  caption?: LocalisedString;
  /**
   * Whether to display a draggable spacer across the header.
   * @default true
   */
  draggable?: boolean;
  /**
   * Whether to display a close button.
   * @default true
   */
  closable?: boolean;
  /** Callback fired when the close button is clicked. */
  onClose?: (this: void, ev?: OnGuiClickEvent) => void;
  /** Ref callback to access the draggable empty widget element. */
  dragHandleRef?: (this: void, elem: EmptyWidgetGuiElement | undefined) => void;
  /** Native parent frame target for dragging. */
  drag_target?: FrameGuiElement;
};

/**
 * Standard Factorio window titlebar header.
 * Features title label with `frame_title` style, draggable handle area, custom action buttons, and a close button.
 *
 * @example
 * ```tsx
 * <Titlebar
 *   caption="Combinator GUI"
 *   drag_target={frameRef.current}
 *   onClose={() => setOpened(false)}
 * />
 * ```
 */
export function Titlebar(props: TitlebarProps) {
  const { caption, draggable = true, closable = true, onClose, dragHandleRef, drag_target, children, style = "react_titlebar_flow", styles, ...rest } = props;
  const hasClose = closable || onClose;

  return (
    <HFlow
      style={style}
      styles={{
        horizontally_stretchable: true,
        ...(styles || {}),
      }}
      {...rest}
    >
      <Label caption={caption} style="frame_title" drag_target={drag_target} />

      {draggable && (
        <EmptyWidget
          ref={dragHandleRef}
          drag_target={drag_target}
          style="draggable_space"
          styles={{
            horizontally_stretchable: true,
            height: 24,
            left_margin: 4,
            right_margin: 4,
          }}
        />
      )}

      {children}

      {hasClose && <CloseButton onClick={onClose} />}
    </HFlow>
  );
}
