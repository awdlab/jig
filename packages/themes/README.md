# @ngneers/controls-themes

Theme presets and the theming engine for **[@ngneers/controls](https://ngneers.dev)**.

Controls in `@ngneers/controls` are headless — this package supplies their styling. The
engine maps each control's named scopes to CSS built on `--ngn-*` design tokens and
injects it into `<head>` at runtime (no stylesheet import, no Tailwind required).

## Presets

- **`nova`** — a fully themed, dark-mode-aware preset (import `novaCoral` from
  `@ngneers/controls-themes/nova`).
- **`shade`** — a shadcn-style preset (`@ngneers/controls-themes/shade`).

Both are `Theme` objects you pass to `provideNgnControls({ theme: { preset } })`. You can
also author your own theme with the `createTheme` / `createThemePart` /
`createControlTemplate` API.

## Install

```bash
pnpm add @ngneers/controls @ngneers/controls-themes
```

📚 Theming guide: **[ngneers.dev](https://ngneers.dev)**

## License

MIT © NGneers
