import type { FrameGuiElement, EmptyWidgetGuiElement, LuaGuiElement, LocalisedString, OnGuiClickEvent, PlayerIndex } from "factorio:runtime";
import { createElement, useWindow, useRef, useEffect, type ReactNode } from "../react";
import { Titlebar } from "./Titlebar";
import { PinButton } from "./PinButton";
import { Frame, type FrameProps } from "./Frame";

/**
 * Props for the `WindowFrame` top-level dialog component.
 */
export interface WindowFrameProps extends FrameProps {
  /** Window title displayed in the header titlebar. */
  caption: LocalisedString;
  /** Player index owning this window (used for position memory and pin state). */
  playerIndex?: PlayerIndex;
  /**
   * If true, shows the pin button and persists pinned state per player.
   * @default false
   */
  pinnable?: boolean;
  /** Initial pinned state when uncontrolled. */
  defaultPinned?: boolean;
  /** Automatically centers the window in the viewport when opened. */
  autoCenter?: boolean;
  /** Unique storage key for saving window position and pin state. */
  windowKey?: string;
  /** Delay in game ticks before saving dragged window position to storage. Default: `30` (0.5s). */
  locationDebounceTicks?: number;
  /**
   * Whether the window can be dragged by its titlebar.
   * @default true
   */
  draggable?: boolean;
  /**
   * Whether to show a close button in the titlebar.
   * @default true
   */
  closable?: boolean;
  /** Callback fired when the window is closed. */
  onClose?: (this: void, ev?: OnGuiClickEvent) => void;
  /** Controlled pinned state. */
  pinned?: boolean;
  /** Callback fired when the player toggles the pin state. */
  onTogglePin?: (this: void, pinned: boolean, ev?: OnGuiClickEvent) => void;
  /** Ref callback to access the draggable empty widget element. */
  dragHandleRef?: (this: void, elem: LuaGuiElement | undefined) => void;
  /** Extra React nodes rendered in the titlebar between title and action buttons. */
  titleDecoration?: ReactNode | ReactNode[];
}

/**
 * Standard Factorio draggable window frame.
 * Integrates `useWindow` for automatic position memory across sessions,
 * pinning behavior, auto-centering, and titlebar controls.
 *
 * @example
 * ```tsx
 * <WindowFrame
 *   caption="My Mod Window"
 *   playerIndex={playerIndex}
 *   pinnable={true}
 *   styles={{ width: 440 }}
 *   onClose={() => setOpened(false)}
 * >
 *   <TabbedPane>...</TabbedPane>
 * </WindowFrame>
 * ```
 */
export function WindowFrame(props: WindowFrameProps) {
  const {
    caption,
    playerIndex,
    pinnable = false,
    defaultPinned = false,
    autoCenter = false,
    windowKey,
    locationDebounceTicks,
    draggable = true,
    closable = true,
    onClose: externalOnClose,
    pinned: controlledPinned,
    onTogglePin: controlledOnTogglePin,
    dragHandleRef: externalDragHandleRef,
    titleDecoration,
    children,
    ...rest
  } = props;

  const win = useWindow(playerIndex ?? (1 as PlayerIndex), {
    autoCenter,
    pinnable,
    defaultPinned,
    windowKey,
    locationDebounceTicks,
  });

  const isControlledPinned = controlledPinned !== undefined;
  const isPinned = isControlledPinned ? controlledPinned : win.pinned;

  const handleTogglePin = (newPinned: boolean, ev?: OnGuiClickEvent) => {
    if (controlledOnTogglePin) {
      controlledOnTogglePin(newPinned, ev);
    } else {
      win.setPinned(newPinned);
    }
  };

  const handleClose = (ev?: OnGuiClickEvent) => {
    if (externalOnClose) {
      externalOnClose(ev);
    }
    win.close();
  };

  const frameRef = useRef<FrameGuiElement>();
  const dragHandleRef = useRef<EmptyWidgetGuiElement>();

  useEffect(() => {
    if (draggable && frameRef.current && frameRef.current.valid && dragHandleRef.current && dragHandleRef.current.valid) {
      dragHandleRef.current.drag_target = frameRef.current;
    }
  });

  return (
    <Frame direction="vertical" ref={frameRef} onLocationChanged={win.onLocationChanged} {...rest}>
      <Titlebar
        caption={caption}
        draggable={draggable}
        closable={closable}
        onClose={handleClose}
        drag_target={frameRef.current}
        dragHandleRef={(elem?: EmptyWidgetGuiElement) => {
          dragHandleRef.current = elem;
          if (draggable && elem && elem.valid && frameRef.current && frameRef.current.valid) {
            elem.drag_target = frameRef.current;
          }
          if (externalDragHandleRef) externalDragHandleRef(elem);
        }}
      >
        {pinnable && <PinButton pinned={isPinned} onTogglePin={handleTogglePin} />}
        {titleDecoration}
      </Titlebar>
      {children}
    </Frame>
  );
}
