<div align="center">

<img src="https://raw.githubusercontent.com/NGneers/controls/main/apps/docs/public/img/logo-mark.png" alt="" width="88" />

# @ngneers/controls-themes

**Theme presets and the theming engine for
[@ngneers/controls](https://www.npmjs.com/package/@ngneers/controls).**

[![Main package](https://img.shields.io/badge/Main%20package-%40ngneers%2Fcontrols-e90464?style=for-the-badge)](https://www.npmjs.com/package/@ngneers/controls)
[![Theming guide](https://img.shields.io/badge/Theming%20guide-ngneers.dev-8514f5?style=for-the-badge)](https://ngneers.dev/guides/overview)

</div>

Controls in `@ngneers/controls` are headless — this package supplies their styling. The
engine maps each control's named scopes to CSS built on `--ngn-*` design tokens and injects
it into `<head>` at runtime (no stylesheet import, no Tailwind required).

Three presets ship built in: **`nova`** (fully themed, dark-mode aware), **`shade`**
(shadcn-style) and **`material`** (Material Design 3). Each is a `Theme` object you pass to
`provideNgnControls({ theme: { preset } })`; `createTheme` / `createThemePart` /
`createControlTemplate` let you author your own.

## Install

```bash
pnpm add @ngneers/controls @ngneers/controls-themes
```

```ts
import { nova } from '@ngneers/controls-themes/nova';
```

## Documentation

Tokens, kinds, colors, dark mode and custom themes are documented with the main package:
**[ngneers.dev/guides/overview](https://ngneers.dev/guides/overview)**

## License

MIT © NGneers
