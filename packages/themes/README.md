<div align="center">

<img src="https://raw.githubusercontent.com/awdlab/jig/main/apps/docs/public/img/logo-mark.png" alt="" width="88" />

# @awdlab/jig-themes

**Theme presets and the theming engine for
[@awdlab/jig](https://www.npmjs.com/package/@awdlab/jig).**

[![Main package](https://img.shields.io/badge/Main%20package-%40ngneers%2Fcontrols-e90464?style=for-the-badge)](https://www.npmjs.com/package/@awdlab/jig)
[![Theming guide](https://img.shields.io/badge/Theming%20guide-jig.awdlab.dev-8514f5?style=for-the-badge)](https://jig.awdlab.dev/guides/overview)

</div>

Controls in `@awdlab/jig` are headless — this package supplies their styling. The
engine maps each control's named scopes to CSS built on `--jig-*` design tokens and injects
it into `<head>` at runtime (no stylesheet import, no Tailwind required).

Three presets ship built in: **`nova`** (fully themed, dark-mode aware), **`shade`**
(shadcn-style) and **`material`** (Material Design 3). Each is a `Theme` object you pass to
`provideJigControls({ theme: { preset } })`; `createTheme` / `createThemePart` /
`createControlTemplate` let you author your own.

## Install

```bash
pnpm add @awdlab/jig @awdlab/jig-themes
```

```ts
import { nova } from '@awdlab/jig-themes/nova';
```

## Documentation

Tokens, kinds, colors, dark mode and custom themes are documented with the main package:
**[jig.awdlab.dev/guides/overview](https://jig.awdlab.dev/guides/overview)**

## License

MIT © awdlab
