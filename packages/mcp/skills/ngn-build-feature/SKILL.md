---
name: ngn-build-feature
description: Build a new feature or screen by composing @ngneers/controls (ngn) — pick the right controls for a goal, follow composition recipes (forms, tables, dialogs), and wire them with signals. Use when building new UI in an app that uses @ngneers/controls.
metadata:
  version: 1
---

# Building a feature with @ngneers/controls

Use the `@ngneers/controls-mcp` server to choose and compose controls. This is the
task-oriented layer on top of the docs: it helps decide _what to build with_.

## Workflow

1. **Recommend** — call `recommend_controls(goal)` with a plain-language
   description (e.g. "a filterable table with row selection and status badges").
   It returns the ngn controls to reach for and any matching composition recipe.
2. **Read the recipe** — if a recipe matches, read it via the
   `ngn://recipe/<slug>` resource. Recipes give the composition shape (which
   controls combine, the `ngn-input-field` chrome pattern, signal/`computed`
   state wiring) with a skeleton.
3. **Confirm each control** — call `get_control` on every control before wiring
   it, to use its real inputs/outputs. Use `get_theme_options` to resolve any
   `kind` / `color` values.
4. **Scaffold with ngn conventions**:
   - Signals for state: `signal()` / `computed()`; two-way bind with `[(value)]`.
   - Wrap form controls in `ngn-input-field` for label/hint/error.
   - `ngn-dialog` / `ngn-drawer` are declarative — drive them from an `[(open)]`
     signal, not an imperative service.
   - Style through theme tokens; no hardcoded CSS.
5. **Verify** — build and visually check the feature.

## Rule

Prefer an existing recipe's shape over inventing a composition. Always confirm
control inputs with `get_control` before writing template bindings.
