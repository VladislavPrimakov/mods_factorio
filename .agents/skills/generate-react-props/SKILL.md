---
name: generate-react-props
description: Generate and synchronize JSX element props for fcore (src/react/generated-props.ts) by analyzing typed-factorio prototype specifications using ts-morph.
---

# Generate React JSX Props for fcore

Use this skill when updating `typed-factorio` or when adding support for new Factorio GUI element types and specifications in `fcore`.

---

## 🛠️ Generator Workflow

### 1. Source & Target

- **Generator Script:** `fcore/scripts/generate-props.ts`
- **Output File:** `fcore/src/react/generated-props.ts`
- **Engine:** `ts-morph` AST parser inspecting `typed-factorio` declaration files.

### 2. Execution

Run the npm script from the `fcore` directory:

```bash
cd fcore
npm run generate
```

### 3. Verification

After running the generator:

1. Ensure all standard GUI specs (e.g. `ButtonGuiSpec`, `FrameGuiSpec`, `LabelGuiSpec`) are properly mapped to `ReactInternalProps`.
2. Verify that custom injected props (`styles: StylesFor<T>`, `children?: ReactNode`, event callbacks) remain properly typed.
3. Run `npm run build` in `fcore` to verify zero TypeScript compilation errors.
