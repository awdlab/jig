**@awdlab/jig** is a component library for **Angular 22+** built the way Angular
is heading: **signals everywhere, zoneless, standalone**. There are no `NgModule`s, no
`@Input()`/`@Output()` decorators, and no `ControlValueAccessor` boilerplate — every
control is a standalone component or directive whose inputs are `input()`/`model()`
signals.

### The core idea: headless behavior, swappable skin

A control ships **zero component CSS**. Its `.ts`/`.html` define behavior, accessibility,
and a set of named **scopes** (`root`, `track`, `thumb`, …). All styling lives in a
separate **theme** that maps those scopes to CSS. At runtime the theme engine injects the
CSS for each control into `<head>` the first time that control appears on the page.

That split buys you three things:

- **Restyle without forking.** Swap the theme, or override a single control's part, and
  every instance updates. See [Theming](/guides/overview).
- **Reach internals safely.** The typed [Passthrough](/guides/passthrough) system lets you
  target any internal scope with classes, styles, attributes, or listeners — no
  `::ng-deep`, no global CSS.
- **Themes react to state.** State signals like `invalid` or `disabled` drive which theme
  classes are applied — automatically. See [State](/guides/state).

### What's in the box

- **50+ controls** — inputs, actions, overlays, data display, layout, feedback, navigation.
- **Three presets** — `nova` (fully themed, dark-mode aware), `shade` (a shadcn-style
  theme), and `material` (Material Design 3) — all from `@awdlab/jig-themes`.
- **Opt-in features** — toasts, snackbars, default icons, and automatic dark mode are each
  enabled by a `with*()` feature you pass to the provider. You only ship what you use.

### Next steps

- [Installation](/guides/installation) — add the packages and register the provider.
- [Usage](/guides/usage) — render your first control.
- [Configuration](/guides/configuration) — every option the provider takes.
- [Theming › Overview](/guides/overview) — understand the theme system.
- [Browser Support](/guides/browser-support) — the Angular and browser floors.
- [Migration](/guides/migration) — coming from PrimeNG, Material or Syncfusion.
