# CLAUDE.md — Behavioral Guidelines for @awdlab/jig

> **Self-updating instruction:** When the user provides general advice, workflow preferences, or coding guidelines during conversation, add them to the **User Preferences** section below. Keep entries concise (one bullet per concept). Do not ask for confirmation — just update the file.

## Code Style & Conventions

- Angular 22, strict TypeScript (`strict`, `noImplicitOverride`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`)
- pnpm monorepo — always use `pnpm` (never npm/yarn)
- Zoneless change detection (Angular 22 default) — `ChangeDetectionStrategy.OnPush` no longer lint-enforced
- Modern Angular signals API: `input()`, `model()`, `computed()`, `signal()` — never legacy `@Input()` / `@Output()` decorators
- Selector prefix: `jig` (kebab-case for elements, camelCase for attributes)
- All controls extend `JigBase<T>` with `provideSelf(ClassName)` in providers
- Theme injection via `this.injectThemeTemplate(controlTemplate, classMapping)`
- No component-level CSS/SCSS — all styling flows through the theme system
- Tailwind CSS for utility classes in templates
- Barrel exports via `index.ts` in every feature folder
- Use `@awdlab/*` path aliases for imports, never relative cross-package imports
- 2-space indentation, single quotes (oxfmt formats `.ts`/`.json`/`.md`; Prettier + `@ngneers/prettier-config` formats `.html`)
- Linting via oxlint with type-aware rules (tsgolint, `--type-aware`); config in root `.oxlintrc.json`. No ESLint.

## Naming & Style Conventions

_Decided 2026-07-08 (repo-wide audit). Apply to all new/edited controls; migrate existing ones opportunistically._

### Component / template structure

- Extract a `{Name}Templates` base class (extending `JigBase` / `ValueControlBase`) **only for controls that expose template or `contentChild` projection inputs**. The component then `extends {Name}Templates` so template wiring stays out of the component class. Reference: `dialog` → `DialogTemplates`.
- Controls with **no** template inputs stay flat: component extends the base directly and calls `injectThemeTemplate` inline. Do **not** create empty template base classes.

### Naming

- Control folder name and `jig-` element selector are kebab-case and identical: folder `x-y` ⇒ selector `jig-x-y`.
- The "input" family is **modifier-first**: `number-input`, `mask-input` (rename `input-mask` → `mask-input`). The bare `input` directive keeps its name. **Exception:** `input-field` stays input-first (`JigInputField`, `jig-input-field`) — it composes/projects other controls rather than being a variant of `input`, so the family rule does not apply to it.
- Attribute directives applied to native elements (`jigButton`, `jigInput`) intentionally keep camelCase attribute selectors — this is **not** a violation.
- Every control ships all anatomy parts (see below), including a theme template, docs page, and demos.

### Input / output properties

- **Icon** inputs use an `icon` **prefix**: `iconClose`, `iconFilter`, `iconDropdown` — never `closeIcon` / `filterIcon`.
- **Boolean** inputs always use the transform: `input(false, { transform: booleanAttribute })`.
- **Directive** inputs expose a public alias `jig{Directive}{Prop}`. `@angular-eslint/no-input-rename` only permits an alias that is **exactly** the selector, or the selector + `PascalCase(propertyName)` — so the alias suffix must equal the property name. Pick the property name so the alias reads well (e.g. property `container` → alias `jigScrollAmountContainer`, not property `scrollContainer` which would force `jigScrollAmountScrollContainer`). Reference: `tooltip` — property `size` aliased to `jigTooltipSize`.

### TSDoc (reference: `select`)

- Every `input()` / `model()` / `output()` gets a snappy 1–2 sentence TSDoc.
- Use `@default <value>` **unquoted** (e.g. `@default false`) for non-obvious defaults.
- Use `{@link other}` to cross-reference interacting inputs; note incompatibilities inline. Complex inputs get an extra sentence or example.

## Control Anatomy

When creating or modifying a control, be aware that each control spans these parts:

| Part           | Location                                        | Key function                                                                 |
| -------------- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| Control source | `packages/controls/src/{name}/`                 | Component `.ts`, `.html` template, `index.ts` barrel, `ng-package.json`      |
| Theme template | `packages/themes/src/templates/{name}/index.ts` | `createControlTemplate({ scope, classNames })`                               |
| Base theme     | `packages/themes/src/base/{name}/index.ts`      | `createThemePart()` — minimal/structural styling                             |
| Nova theme     | `packages/themes/src/nova/{name}/index.ts`      | `createThemePart()` — full themed styling (colors, dark mode, responsive)    |
| Shade theme    | `packages/themes/src/shade/{name}/index.ts`     | `createThemePart()` — flat, low-chrome styling                               |
| Material theme | `packages/themes/src/material/{name}/index.ts`  | `createThemePart()` — Material-flavoured styling                             |
| Test harness   | `packages/playwright/src/components/{name}.ts`  | `Jig{Name}Harness` + export from `components/index.ts`                       |
| Test registry  | `apps/test-wrapper/src/app/imports.ts`          | `{name}: () => import('@awdlab/jig/{name}')` — enables `imports: ['{name}']` |
| Tests          | `tests/components/{name}.test.ts`               | Playwright + screenshot snapshots, snapshot dir alongside                    |
| Docs page      | `apps/docs/src/app/docs/components/{name}/`     | `page.ts`, `index.md`, `api.md`, `a11y.md`, `playground.ts`                  |
| Demos          | `apps/docs/src/app/demos/{name}/`               | Scenario-based standalone Angular components                                 |

Each theme part also needs an empty `package.json` (`{}`) next to `index.ts`. New controls must be registered in `packages/themes/src/templates/index.ts` (`ThemeTemplate`), each theme's `index.ts`, and `apps/docs/src/app/docs/components/index.ts` (`COMPONENT_GROUPS`).

Always check **all** parts when making changes to a control — a rename or new input affects templates, themes, tests, docs, and demos.

## Testing

- **Unit**: Vitest with Angular TestBed — `.spec.ts` files next to source (rare; mostly utilities)
- **Component/E2E**: Playwright — `tests/components/{name}.test.ts`, driven through the
  `apps/test-wrapper` app and the `@awdlab/jig-playwright` harnesses

## User Preferences

- E2E tests (Playwright) auto-start the dev server via `webServer` in `playwright.config.ts` — no need to manually start a server before running tests

<!-- Entries below are added automatically when the user gives general advice -->

- When previewing the docs app, you must click "Get Started" on the startpage before the sidebar navigation becomes available. This is always the case.

- Always run `pnpm format` over changed files after completing edits (oxfmt for `.ts`/`.json`/`.md`, Prettier for `.html`)

- The dev server does NOT recompile when a globally `@use`d SCSS partial (e.g. `src/styles/global.scss`) changes — the watcher misses it. To force a rebuild + reload, save the app's `styles.scss` entry (which `@use`s those partials). (Component-template/TS edits hot-reload normally; this caveat is specific to global SCSS partials.)

- Comments: short and precise. Code should be self-explanatory; only comment genuinely unintuitive logic. NO decision logs, NO references to earlier states / changes / effect-registration order / "pre-existing" / task or finding numbers. State what the code does now, in one line. Trim verbose comments to a single line or remove them.

- PR descriptions: lead with a short summary readable in under a minute — the most important points at a glance. Add deeper detail below only if genuinely needed.
