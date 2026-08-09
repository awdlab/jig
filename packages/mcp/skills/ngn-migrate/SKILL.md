---
name: awd-migrate
description: Migrate an Angular app from PrimeNG, Angular Material, or Syncfusion to @awdlab/jig (awd). Use when replacing another component library with awd, or when the user mentions porting/migrating p-*, mat-*, or ejs-* components.
metadata:
  version: 1
---

# Migrating to @awdlab/jig

Use the `@awdlab/jig-mcp` server as the mapping source of truth. Do not
guess awd equivalents or their inputs — the maps and control APIs are exact.

## Workflow

1. **Pick the source** — call `list_migration_sources` to confirm the library is
   covered (`primeng`, `angular-material`, `syncfusion`).
2. **Inventory** — grep the project templates for the source library's selectors
   (`p-*`, `mat-*` / `mat…` attributes, `ejs-*`). Build a checklist of every
   component in use.
3. **Map each component** — call `map_component(source, component)` for the awd
   target, prop/event mappings, and **gaps** (source features with no direct awd
   equivalent). Use `search_migration(query, source?)` when the exact source name
   is unknown.
4. **Confirm the target API** — before rewriting, call `get_control` on the awd
   target to confirm the real inputs. The migration map tells you _what maps to
   what_; `get_control` is authoritative for _how it's actually spelled_.
5. **Rewrite** — port templates + component code:
   - `[(ngModel)]="x"` → the signal model, usually `[(value)]="x"` (or reactive
     forms via `awd-input-field`).
   - Wrap standalone form controls in `awd-input-field` for label/hint/error.
   - Move an `id` from the source input onto the wrapper's `inputId`
     (`<awd-input-field [inputId]="'old-id'">`) — the field overwrites an `id`
     left on the projected `<input>`, silently breaking every external
     `<label for>`, `aria-describedby`, and `document.getElementById` that
     referenced it.
   - Map `severity` / `color` onto awd `kind` + `color` (see `get_theme_options`).
6. **Flag gaps** — where a map lists a gap or a feature has no equivalent, surface
   it to the user rather than fabricating an input that doesn't exist.
7. **Verify** — build and visually check each migrated screen.

## Rules

- Never introduce an awd input that `get_control` does not list.
- Migrate incrementally (screen by screen), verifying as you go — especially for
  data-heavy components like tables where feature parity varies.
