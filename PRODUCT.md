# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Tech leads choosing a UI library** for an Angular 22+ codebase. They compare jig against PrimeNG, Angular Material, spartan/ng and similar, weighing API modernity, accessibility, theming freedom, maturity and long-term risk.
- **App developers on Angular 22+** building product UIs. They want accessible controls that bind to signals with no boilerplate, and often adopt incrementally — one control at a time inside an existing app.

## Product Purpose

`@awdlab/jig` is a signal-based component library for Angular 22+: 60+ accessible, themeable, tree-shakeable controls (inputs, actions, overlays, data display including a full table, layout, feedback, navigation). Success means a team can drop a control into a modern Angular app, bind a signal, and ship — then restyle the whole library to their own design system without touching control markup.

## Positioning

- **Signals-native, zero `ControlValueAccessor`.** Built for zoneless, standalone Angular from day one: `input()`/`model()`/`output()`, no `NgModule`s, no `@Input()`/`@Output()` decorators, no CVA boilerplate. Typed values follow configuration (e.g. single vs. multiple selection changes the value type).
- **Zero component CSS.** Controls hold behavior, accessibility and named style scopes; all styling lives in a separate theme the engine injects at runtime. Swap the theme, keep the markup. Dark mode is a theme concern, not a per-control one.
- **Platform-native first.** Uses the popover API, `@starting-style`, cascade layers and CSS nesting directly — native where the platform is strong, custom only where it isn't.

## Operating Context

- Evaluated and learned through the docs site **jig.awdlab.dev** (`apps/docs`): startpage, guides, and a page per control with live demos, API table, A11y tab and playground.
- Installed via `pnpm add @awdlab/jig @awdlab/jig-themes`; configured with `provideJigControls({ theme: { preset } })`; each control imported from its own subpath.
- Companion packages: `@awdlab/jig-themes` (engine + presets), `@awdlab/jig-custom-types`, `@awdlab/jig-mcp` (MCP server exposing docs/API to coding agents), `@awdlab/jig-playwright` (test harnesses).

## Capabilities and Constraints

- Theme presets: **nova** (fully themed, dark-mode aware), **shade** (shadcn-style, flat), **material** (Material Design 3), plus a token-driven engine for authoring custom themes. App-defined kinds and colors.
- Requirements: Angular 22.0+, TypeScript 6.0+, Node 22+ (build only); browsers Chrome/Edge 120+, Firefox 129+, Safari 17.5+ — floors set by the platform features above.
- i18n (localized ARIA strings), RTL, SSR, animations that respect `prefers-reduced-motion`, state persistence.
- **Beta**, published under the `next` dist-tag. API close to stable; inputs may still be renamed between pre-releases, each with a changelog entry.
- MIT licensed, open source on GitHub (`awdlab/jig`).

## Brand Commitments

- Name: `@awdlab/jig` / jig. Logo at `apps/docs/public/img/logo.png`.
- **Voice (binding):** confident, terse, developer-to-developer. Short declarative headlines ("Let the browser do it", "Your design system, not ours", "Start with one control"). Concrete over hype. Honest about beta status and about what remains the app developer's responsibility.

## Evidence on Hand

- Real, runnable demos for every control on the docs site; an interactive chat-app demo shown in light and dark (`.github/assets/chat-*.png`); component gallery screenshots (`.github/assets/components-*.png`).
- Countable facts: 60+ controls, three theme presets, per-control A11y documentation.
- **No adopters, testimonials, company logos, download figures or benchmarks exist.** Future work must not fabricate any.

## Product Principles

1. **Modern Angular or nothing.** Signals, zoneless, standalone — never compromise the API to support legacy patterns.
2. **Behavior and skin stay separate.** Anything visual belongs to the theme; a control must survive a theme swap unchanged.
3. **Lean on the platform.** Prefer native browser features over JavaScript re-implementations, and state the browser floor honestly.
4. **Adoptable one control at a time.** No buy-in to an all-or-nothing framework; the first control should take minutes.
5. **Accessibility is behavior, not styling.** It ships in the control and cannot be themed away.

## Accessibility & Inclusion

Target is **WCAG 2.2 level AA**. Controls follow WAI-ARIA Authoring Practices for roles and keyboard interaction, use roving tabindex for composite widgets, trap and restore focus in modal surfaces, announce transient messages via live regions, and localize built-in ARIA strings. Accessible names, `aria-describedby` wiring and submit/server error announcements remain the app developer's responsibility and are documented per control.
