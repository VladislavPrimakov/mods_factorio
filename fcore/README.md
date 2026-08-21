# @vladislavprimakov/fcore

[![Documentation](https://img.shields.io/badge/docs-starlight-blue)](https://vladislavprimakov.github.io/mods_factorio/)
[![npm](https://img.shields.io/npm/v/@vladislavprimakov/fcore)](https://www.npmjs.com/package/@vladislavprimakov/fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Reactive Virtual DOM UI Framework & Modding Toolkit for **Factorio 2.0** mods using TypeScript-To-Lua (TSTL).

## Features

- ⚛️ **Declarative Virtual DOM & JSX:** Build Factorio GUI using functional components and React JSX.
- 🪝 **Standard & Factorio Hooks:** `useState`, `useReducer`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useInterval`, `useEntityLifecycle`, `useTransientData`.
- ⚡ **O(1) Tag-Based Event Bus:** Fast event dispatching directly to fiber handlers via `tags.__reactId`.
- ⏱️ **Bucketed Tick Scheduler:** Schedule delayed or recurring tasks across discrete tick buckets without per-tick polling.
- 🎨 **Type-Safe Style Engine:** Compile-time `StyleFor<E>` inference and smart C++ property diffing.
- 📊 **Signal & Quality Tools:** Encode/decode composite Factorio 2.0 signals (`item:iron-plate:legendary`) with O(1) performance.
- 🔍 **Structured Logger (strace):** Diagnostic logger with lazy callback evaluation and runtime settings sync.

## Documentation

Full interactive documentation, API reference, architectural patterns, and guides:
👉 **[https://vladislavprimakov.github.io/mods_factorio/](https://vladislavprimakov.github.io/mods_factorio/)**

## Installation

```bash
npm install --save-dev @vladislavprimakov/fcore
```

In your mod's `info.json`:
```json
{
  "dependencies": [
    "fcore >= 1.0.0",
    "base >= 2.1.0"
  ]
}
```

In `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "moduleResolution": "Node",
    "jsx": "react",
    "jsxFactory": "createElement",
    "jsxFragmentFactory": "Fragment",
    "types": [
      "typed-factorio/runtime",
      "typed-factorio/prototype",
      "@typescript-to-lua/language-extensions"
    ],
    "paths": {
      "fcore/*": ["./node_modules/@vladislavprimakov/fcore/dist/*"]
    }
  },
  "tstl": {
    "luaTarget": "5.2",
    "luaLibImport": "require",
    "noImplicitSelf": true,
    "sourceMapTraceback": true,
    "luaPlugins": [
      { "name": "@vladislavprimakov/fcore/plugin.cjs" }
    ],
    "noResolvePaths": ["util", "__fcore__/**", "__fcore__*"]
  }
}
```

## Quick Example

```tsx
import { createElement, useState, createRoot } from "fcore/react";
import { WindowFrame, Titlebar, Button, Label, VFlow } from "fcore/react-components";
import * as event from "fcore/utils/event";

function MyWindow(props: { playerIndex: PlayerIndex; onClose: () => void }) {
  const [count, setCount] = useState(0);

  return (
    <WindowFrame styles={{ width: 320 }}>
      <Titlebar caption="My Mod Window" onClose={props.onClose} />
      <VFlow styles={{ padding: 12 }}>
        <Label caption={`Clicked: ${count} times`} />
        <Button caption="Increment" onClick={() => setCount((prev) => prev + 1)} />
      </VFlow>
    </WindowFrame>
  );
}

event.onCustomInput("open-my-gui", (e) => {
  const player = game.get_player(e.player_index);
  if (!player) return;

  const root = createRoot(player.gui.screen, "my_mod_window");
  root.render(
    <MyWindow playerIndex={e.player_index} onClose={() => root.unmount()} />
  );
});
```

## License

MIT © [Vladislav Primakov](https://github.com/VladislavPrimakov)
