<!--
Thanks for the PR. Keep it focused — one control, one concern.
See CONTRIBUTING.md for the full workflow.
-->

## What and why

<!-- What changes, and what problem it solves. Link the issue if there is one. -->

Closes #

## Control parts touched

<!-- A control spans every part of the Control Anatomy table in AGENTS.md. Tick
     what this PR updates, and delete the ones that genuinely do not apply. -->

- [ ] Control source (`packages/controls/src/…`)
- [ ] Theme template (`packages/themes/src/templates/…`)
- [ ] Base theme part
- [ ] Themed parts (nova / shade / material)
- [ ] Tests (`tests/components/…`)
- [ ] Playwright harnesses (`packages/playwright/src/components/…`)
- [ ] Docs page (`index.md`, `api.md`, `a11y.md`, i18n tab)
- [ ] Demos

## Checks

- [ ] `pnpm check:changed` passes
- [ ] `pnpm docs:build` passes
- [ ] Tests cover the changed behaviour
- [ ] Keyboard interaction verified, and `a11y.md` updated if it changed
- [ ] Public classes carry `@category control` / `@category directive`
- [ ] Changeset added (`pnpm changeset`) — an empty one if nothing published changes

## Breaking changes

<!-- None, or: what breaks and what consumers need to do. -->

None.

## Screenshots

<!-- For anything visual, before/after in addition to the
     changed / new visual regression test snapshots -->
