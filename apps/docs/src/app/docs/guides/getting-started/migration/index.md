Coming from **PrimeNG**, **Angular Material** or **Syncfusion**? Component
mappings for all three ship with the library — 48, 29 and 35 components
respectively — including per-property maps and, importantly, the gaps.

### Let an agent do it

The mappings are exposed through the
[MCP server](/guides/mcp-server), so a coding agent can port a screen with the
real mapping table instead of guessing:

```bash
npx -y @awdlab/jig-mcp
```

The bundled `jig-migrate` skill drives the workflow: inventory the source
selectors, map each component, confirm the target's real inputs, rewrite, and
surface anything with no equivalent rather than inventing an input.

Relevant tools: `list_migration_sources`, `search_migration(query)`,
`map_component(source, component)`, and `get_control(name)` for the
authoritative API of the target.

### The shape of the change

Whatever the source library, the same four things change.

**1. Value binding.** Values are signal `model()`s, so two-way binding is
`[(value)]`. There is no `ControlValueAccessor`, but `formControlName`,
`ngModel` and signal forms all still work — see
[Forms & Validation](/guides/forms-validation).

```html
<!-- before (Material) -->
<mat-select [(ngModel)]="city"></mat-select>

<!-- after -->
<jig-select [(value)]="city" [items]="cities" />
```

**2. Field wrappers.** `mat-form-field` and PrimeNG's float-label wrappers
become [`jig-input-field`](/components/input-field), which owns the label,
the id and the layout.

> **Watch the `id`.** The field writes its own `inputId` onto the projected
> input, replacing an `id` you set there. Move an existing id onto the wrapper —
> `<jig-input-field [inputId]="'user-email'">` — or every external
> `<label for>`, `aria-describedby` and `getElementById` that referenced it
> breaks silently.

**3. Severity becomes two axes.** `severity`, `color` and `appearance` inputs
collapse onto `kind` (the treatment) and `color` (the palette), typed against
the active theme. See [Kinds & Colors](/guides/kinds-colors).

**4. Styling.** There is no component CSS to override and no `::ng-deep`. A
per-instance tweak goes through [Passthrough](/guides/passthrough); an app-wide
change goes into the theme. See [Styling & Overrides](/guides/styling-overrides).

### Items instead of options

Where the source library used content children (`<mat-option>`, `<p-dropdown>`
templates), the jig equivalents take **data**:

```html
<jig-select [items]="items" [(value)]="value" />
```

`transformToJigItem` converts your existing objects without hand-mapping — see
[Items & Data](/guides/items-data).

### Practical advice

- **Migrate screen by screen**, verifying as you go. A big-bang rewrite hides
  which change broke what.
- **Do the form controls first.** They carry the most behaviour and set the
  patterns the rest of the port follows.
- **Leave the table for last.** Data grids are where feature parity varies
  most; check the [Table](/components/table) page against your current feature
  use before committing to a date.
- **Run both libraries side by side** during the transition. Nothing in this
  library conflicts with another — but see the note below.

### Running alongside another library

Two things to watch:

- **CSS.** Theme CSS lives in the `jig` cascade layer, so the other
  library's unlayered CSS will win where selectors collide. Scope the other
  library's styles, or use `styleScope` to keep tokens off `:root`. See
  [Configuration](/guides/configuration).
- **Types.** Only one theme may contribute `kind`/`color` types. If you import
  more than one, import the extras from their `/untyped` entry point.

### Version and support

See [Browser Support](/guides/browser-support) for the Angular, TypeScript and
browser floors before you start — Angular 22 is a hard requirement.
