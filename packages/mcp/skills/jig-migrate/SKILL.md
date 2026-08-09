---
name: jig-migrate
description: Migrate an Angular app from PrimeNG, Angular Material, or Syncfusion to @awdlab/jig (jig). Use when replacing another component library with jig, or when the user mentions porting/migrating p-*, mat-*, or ejs-* components.
metadata:
  version: 1
---

# Migrating to @awdlab/jig

Use the `@awdlab/jig-mcp` server as the mapping source of truth. Do not
guess jig equivalents or their inputs — the maps and control APIs are exact.

## Workflow

1. **Pick the source** — call `list_migration_sources` to confirm the library is
   covered (`primeng`, `angular-material`, `syncfusion`).
2. **Inventory** — grep the project templates for the source library's selectors
   (`p-*`, `mat-*` / `mat…` attributes, `ejs-*`). Build a checklist of every
   component in use.
3. **Map each component** — call `map_component(source, component)` for the jig
   target, prop/event mappings, and **gaps** (source features with no direct jig
   equivalent). Use `search_migration(query, source?)` when the exact source name
   is unknown.
4. **Confirm the target API** — before rewriting, call `get_control` on the jig
   target to confirm the real inputs. The migration map tells you _what maps to
   what_; `get_control` is authoritative for _how it's actually spelled_.
5. **Rewrite** — port templates + component code:
   - `[(ngModel)]="x"` → the signal model, usually `[(value)]="x"` (or reactive
     forms via `jig-input-field`).
   - Wrap standalone form controls in `jig-input-field` for label/hint/error.
   - Move an `id` from the source input onto the wrapper's `inputId`
     (`<jig-input-field [inputId]="'old-id'">`) — the field overwrites an `id`
     left on the projected `<input>`, silently breaking every external
     `<label for>`, `aria-describedby`, and `document.getElementById` that
     referenced it.
   - Map `severity` / `color` onto jig `kind` + `color` (see `get_theme_options`).
6. **Flag gaps** — where a map lists a gap or a feature has no equivalent, surface
   it to the user rather than fabricating an input that doesn't exist.
7. **Verify** — build and visually check each migrated screen.

## Rules

- Never introduce a jig input that `get_control` does not list.
- Migrate incrementally (screen by screen), verifying as you go — especially for
  data-heavy components like tables where feature parity varies.
