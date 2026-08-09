# Contributing to @awdlab/jig

Thanks for taking the time. This document covers how to get the repo running,
what a change to a control actually involves, and what we look for in a PR.

## Prerequisites

- **Node 22+**
- **pnpm 11+** — this is a pnpm workspace; npm and yarn will not resolve the
  workspace protocol.
- **Angular 22** knowledge, in particular signals and standalone components.

```bash
pnpm install
```

## Running things

| Command              | What it does                                               |
| -------------------- | ---------------------------------------------------------- |
| `pnpm docs:serve`    | The documentation app, with every control and demo.        |
| `pnpm docs:build`    | Production build of the docs — the broadest type check.    |
| `pnpm build`         | Build every package.                                       |
| `pnpm unit-test`     | Vitest unit tests across packages.                         |
| `pnpm test`          | Playwright end-to-end tests (starts its own dev server).   |
| `pnpm lint`          | oxlint with type-aware rules.                              |
| `pnpm format`        | Format the repo (oxfmt for TS/JSON/MD, Prettier for HTML). |
| `pnpm check:changed` | Lint + format check, restricted to changed files.          |

`pnpm test` runs the full e2e suite and takes a while. During development,
target a single spec:

```bash
pnpm playwright test tests/components/select.test.ts
```

## Repository layout

```
packages/controls          the components and directives
packages/themes            theme presets (nova, shade, material) and the engine
packages/custom-types      shared type contracts between the two above
packages/mcp               MCP server exposing docs and API to AI agents
packages/playwright        Playwright harnesses for consumers
apps/docs                  the documentation site
apps/test-wrapper          host app the e2e tests mount controls into
tests/components           the e2e tests
```

## A control is eight parts

This is the thing to internalise before changing anything. A control is not one
folder — a rename or a new input touches all of these:

| #   | Part               | Location                                                    |
| --- | ------------------ | ----------------------------------------------------------- |
| 1   | Control source     | `packages/controls/src/{name}/`                             |
| 2   | Theme template     | `packages/themes/src/templates/{name}/index.ts`             |
| 3   | Base theme         | `packages/themes/src/base/{name}/index.ts`                  |
| 4   | Themed parts       | `packages/themes/src/{nova,shade,material}/{name}/index.ts` |
| 5   | Tests              | `tests/components/{name}.test.ts`                           |
| 6   | Playwright harness | `packages/playwright/src/components/{name}.ts`              |
| 7   | Docs page          | `apps/docs/src/app/docs/components/{name}/`                 |
| 8   | Demos              | `apps/docs/src/app/demos/{name}/`                           |

The [Creating a Control](https://jig.awdlab.dev/guides/creating-a-control) guide
walks through building one end to end.

A new theme part folder also needs an empty `package.json` marker and a themes
build (`pnpm themes:build`) before the e2e tests can resolve it.

## Conventions

These are enforced by review, and mostly by lint:

- **Signals only** — `input()`, `model()`, `output()`. Never `@Input()` /
  `@Output()` decorators.
- **Booleans** — `input(false, { transform: booleanAttribute })`.
- **Selectors** — `jig-{name}` for elements (folder name and selector match),
  camelCase attributes (`jigButton`) for directives on native elements.
- **Icon inputs** are `icon`-prefixed: `iconClose`, never `closeIcon`. A new
  default icon slot must be registered in the icon registry, the default icon
  set, and the provider.
- **No component CSS.** Styling lives in theme parts, always.
- **TSDoc** on every `input()` / `model()` / `output()`, with `@default` for
  non-obvious defaults.
- **`@category control` or `@category directive`** on every public control
  class — without it the class is missing from the generated API docs _and_
  from the MCP knowledge pack.
- **Comments** are short and factual. No decision logs, no references to how
  the code used to be.
- Import via `@awdlab/*` path aliases, never relative cross-package paths.

## Accessibility

Accessibility is part of the feature, not a follow-up:

- follow the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
  pattern for the widget;
- keyboard interaction must be complete before a PR is ready;
- the e2e suite runs axe with `wcag22aa` plus colour contrast — a regression
  fails CI;
- every control ships an `a11y.md` documenting its roles, keys, and what is
  left to the consumer.

## Documentation

Docs live with the code and are part of the change, not a follow-up PR. A new
or changed control needs its `index.md`, `api.md`, `a11y.md`, an i18n tab, and
at least one demo.

Demo file naming matters: a demo class `Demo_ScrollAmount_Base` must live at
`apps/docs/src/app/demos/scroll-amount/base.ts`, because the docs app fetches
the source from that path to render the code view.

## Commits and changesets

- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`…).
- Every user-facing change needs a **changeset**; CI fails the PR without one:

  ```bash
  pnpm changeset
  ```

  Pick the affected packages and a bump level, and describe the change from a
  consumer's point of view — the text ends up in the changelog. The result is a
  markdown file under `.changeset/`; commit it with your change.

## Pull requests

Before opening one:

1. `pnpm check:changed` — lint and formatting.
2. `pnpm docs:build` — the broadest type check in the repo.
3. Tests for the behaviour you changed, and the e2e spec for that control.
4. A changeset, if the change is user-facing.

Keep PRs focused. A rename that touches all eight parts of one control is a
good PR; a rename across twelve controls plus a refactor is three PRs.

## Reporting bugs and requesting features

Use the issue templates. For a bug, a minimal reproduction — a StackBlitz or a
small repo — is worth more than a long description.

## Security

Do not open a public issue for a vulnerability. See [SECURITY.md](SECURITY.md).

## Licence

By contributing you agree that your contributions are licensed under the
[MIT Licence](LICENSE).
