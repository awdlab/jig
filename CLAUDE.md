# CLAUDE.md — Behavioral Guidelines for @ngneers/controls

> **Self-updating instruction:** When the user provides general advice, workflow preferences, or coding guidelines during conversation, add them to the **User Preferences** section below. Keep entries concise (one bullet per concept). Do not ask for confirmation — just update the file.

## Code Style & Conventions

- Angular 21, strict TypeScript (`strict`, `noImplicitOverride`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`)
- pnpm monorepo — always use `pnpm` (never npm/yarn)
- `ChangeDetectionStrategy.OnPush` on every component (ESLint-enforced)
- Modern Angular signals API: `input()`, `model()`, `computed()`, `signal()` — never legacy `@Input()` / `@Output()` decorators
- Selector prefix: `ngn` (kebab-case for elements, camelCase for attributes)
- All controls extend `NgnBase<T>` with `provideSelf(ClassName)` in providers
- Theme injection via `this.injectThemeTemplate(controlTemplate, classMapping)`
- No component-level CSS/SCSS — all styling flows through the theme system
- Tailwind CSS for utility classes in templates
- Barrel exports via `index.ts` in every feature folder
- Use `@ngneers/*` path aliases for imports, never relative cross-package imports
- 2-space indentation, single quotes (enforced by `@ngneers/prettier-config`)
- ESLint via `@ngneers/eslint-config-angular`

## Control Anatomy

When creating or modifying a control, be aware that each control spans these parts:

| Part           | Location                                        | Key function                                                              |
| -------------- | ----------------------------------------------- | ------------------------------------------------------------------------- |
| Control source | `packages/controls/src/{name}/`                 | Component `.ts`, `.html` template, `index.ts` barrel, `ng-package.json`   |
| Theme template | `packages/themes/src/templates/{name}/index.ts` | `createControlTemplate({ scope, classNames })`                            |
| Base theme     | `packages/themes/src/base/{name}/index.ts`      | `createThemePart()` — minimal/structural styling                          |
| Nova theme     | `packages/themes/src/nova/{name}/index.ts`      | `createThemePart()` — full themed styling (colors, dark mode, responsive) |
| Tests          | `tests/components/{name}.test.ts`               | Vitest + Angular TestBed, snapshot dir alongside                          |
| Docs page      | `apps/docs/src/app/docs/components/{name}/`     | `page.ts`, `index.md`, `api.md`, `playground.ts`                          |
| Demos          | `apps/docs/src/app/demos/{name}/`               | Scenario-based standalone Angular components                              |

Always check **all** parts when making changes to a control — a rename or new input affects templates, themes, tests, docs, and demos.

## Testing

- **Unit**: Vitest with Angular TestBed
- **E2E**: Playwright
- Test files live in `tests/components/`, not next to source

## User Preferences

- E2E tests (Playwright) auto-start the dev server via `webServer` in `playwright.config.ts` — no need to manually start a server before running tests

<!-- Entries below are added automatically when the user gives general advice -->
