# Deep review — library & docs app

Audit date: 2026-10-24. Branch `claude/library-docs-deep-review-9e1626`, at `aebb73c6`.

Scope: `packages/controls` (31k LOC), `packages/themes` (21k LOC), `packages/playwright`,
`packages/mcp`, `apps/docs`. Static read plus a live pass over the docs app on
`localhost:4203`.

First, the honest headline: this is a well-built library. Test coverage is real (69
Playwright specs with axe, 41 unit specs), a11y is taken seriously (roles and ARIA are
present and mostly correct), the docs are unusually complete (65 component pages, 33
guides, generated API tables, a search index, an MCP server). Eight TODOs in 52k lines.
Most of what follows is polish on a solid base — but the alpha window is the only cheap
moment for the renames and base-class extractions in section B, so those are the ones to
act on now.

Findings are ordered by what I'd fix first.

> **Status (2026-10-24, same day).** Most of section A and much of B, C and D have
> since been fixed on this branch. See **What was fixed** at the bottom for the list,
> the three things that were investigated rather than changed, and what is still open.

---

## A. Bugs

### A1. 15 boolean inputs are missing `booleanAttribute` — the attribute form silently does the wrong thing

`AGENTS.md` mandates `input(false, { transform: booleanAttribute })`. These don't:

| Control                                       | Inputs                                         |
| --------------------------------------------- | ---------------------------------------------- |
| `table`                                       | `virtual`, `striped`, `paginator`, `lockSizes` |
| `slider`                                      | `vertical`                                     |
| `splitter`                                    | `lockSizes`                                    |
| `badge` (indicator)                           | `dot`, `circular`                              |
| `select-button`                               | `allowUnselect`                                |
| `menu`                                        | `autoAnchorAria`                               |
| `select`, `list-box`, `dropdown-list`, `tree` | `checkbox`                                     |

Consequence: `<jig-table virtual>` passes `""`, which is falsy, so the feature silently
stays off while the markup reads as if it's on. `<jig-slider vertical>` the same. This is
the single highest-value mechanical fix in the list — and worth a lint rule so it can't
come back.

`model()` can't take a transform, so `open`, `touched`, `completed`, `selectAllMatching`
etc. are unavoidable and fine.

### A2. `createDialog` uses `buttonClicked` before it is declared

`packages/controls/src/dialog/create-dialog.ts:78`

```ts
dialogRef.instance.buttonClicked.subscribe(value => {
  buttonClicked.next(value); // ← buttonClicked declared on the next line
});

const buttonClicked = new Subject<ButtonValues | null>();
```

The callback is deferred, so it survives today. If `JigDialog.buttonClicked` ever emits
synchronously during `subscribe`, it's a `ReferenceError` in the TDZ. Move the `const`
above the subscribe.

### A3. `PromptDialogHandle` loses a `| null` to operator precedence

`create-dialog.ts:27`

```ts
value: T extends PromptDialogBase<infer D, Buttons> ? D : never | null;
```

`never | null` collapses to `null`, so the false branch is `null` and the **true** branch
is a bare `D`. The implementation ten lines down gets it right —
`(T extends … ? D : never) | null` — so the public handle type claims a non-null value
the runtime can resolve as `null`. Add the parens.

### A4. `transformToJigItems` types `value` as the key name, not the value

`packages/controls/src/api/jig-item.ts:68`

```ts
export function transformToJigItems<Items extends readonly object[], K extends keyof Items[number]>(
  items: Items,
  fields: JigItemFields<Items[number], K>
): { [P in keyof Items]: JigItem<Items[P], K> } & readonly JigItem<Items[number], K>[];
```

`JigItem<T, V>` declares `value: V`, and `K` is a key union. So
`transformToJigItems(users, { label: 'name', value: 'id' })` produces items typed
`value: 'id'` instead of `value: number`. The singular `transformToJigItem` has it right
(`JigItem<T, T[K]>`). It goes unnoticed because `JigItem`'s defaults are `any`
(see B12) — fixing B12 will make this one loud.

### A5. The splitter's persistence throws on corrupt stored state

`packages/controls/src/utils-ng/state.ts:14`

```ts
export function loadState<T>(storage: JigStateStorage, key: string) {
  const storageType = storage === 'local' ? localStorage : sessionStorage;
  const state = storageType.getItem(key);
  return state ? (JSON.parse(state) as T) : null;
}
```

No try/catch. One truncated or hand-edited entry and the splitter throws on every
subsequent load, with no way for the user to recover short of clearing storage. `saveState`
can also throw `QuotaExceededError`, and `localStorage` access itself throws when site
data is blocked.

`JigStorage` (`api/ng/storage.ts`) already handles all of this correctly — parse guarded,
SSR guarded, logged fallback. Splitter is the only remaining caller of the old path; see
B8.

### A6. Breadcrumb items that have only a `callback` are not keyboard reachable

`packages/controls/src/breadcrumb/breadcrumb.html`

```html
<a
  [ptInt]="this"
  [ptClass]="{ item: true, 'item-clickable': !!item.callback || !!item.route }"
  (click)="item.callback?.()"
  [routerLink]="item.route"
></a>
```

With `route` undefined, `RouterLink` emits no `href`, so the anchor is not focusable, is
not announced as a link, and `(click)` is the only way in. The class binding explicitly
anticipates callback-only items, so this is a supported configuration.

Also missing on breadcrumb:

- `aria-current="page"` on the last item (required by the WAI-ARIA breadcrumb pattern);
- the component has no `host` block at all, so no `role="navigation"` and no accessible
  name — `jig-item-view` contributes `role="list"` and that's it;
- no `label` / `labelledBy` inputs, unlike every other container control.

Render a `<button>` for callback-only items (or `<span>` for the current page), add
`<nav aria-label>` semantics and `aria-current`.

### A7. Slider and rating skip PageUp / PageDown

`slider.ts:242` and `rating.ts:93` handle `ArrowLeft/Right/Up/Down`, `Home`, `End` and
nothing else. The APG slider pattern lists PageUp/PageDown for the large step. The slider
also has no large-step input at all, while `number-input` has `bigStep` — so the same
concept exists in the library and isn't wired here.

### A8. Slider step quantization drifts

`slider.ts:313`

```ts
return Math.round((unstepped - this.min()) / this.step()) * this.step() + this.min();
```

With `step=0.1` this yields values like `0.30000000000000004`, which then reach
`aria-valuenow` and the bound form value. Round to the step's decimal precision, or work
in integer step-counts and multiply out once.

### A9. The `light` and `highContrast` theme variants are declared but silently dropped

`ThemePart` accepts `root`, `light`, `dark` and `highContrast` sections. The generator
emits only `root` and `dark`:

`packages/themes/src/api/style/apply-theme.ts:189` and `:316`

```ts
// TODO: light and highContrast themes
```

Both `buildVariablesCss` and `buildStyleCss` read `light` and `highContrast` into
`cssParts` and then never use them. A theme author writing a `highContrast:` block gets no
output and no warning. No shipped theme uses either, so nothing is visibly broken today —
but it's a dead public API and a missing `prefers-contrast` story.

Related: the dark selector is hardcoded.

```ts
function getDarkSelector(scope: StyleScope | undefined): string {
  return scope ? ':root.dark &' : '&.dark';
}
```

An app that drives dark mode from `[data-theme="dark"]` or straight from
`prefers-color-scheme` cannot use Jig without also maintaining a `.dark` class. Make the
selector an `ApplyThemeOptions` field.

### A10. Smaller correctness notes

- **`JigError` drops the message from its own log.** `utils/error.ts` logs
  `` `%c💥%c[${area}]` `` plus `additionalContext`, but never `errorMsg` — the fancy log
  shows the area and the context and not the error.
- **`applyDialogConfig` is a hand-maintained key list.** Eight `if (config.x !== undefined)`
  branches in `create-dialog.ts`. Add a dialog input, forget this file, and
  `createDialog` silently ignores it. `Object.entries(config)` → `setComponentInput` is
  shorter and can't drift.
- **`beforeunload` costs you the bfcache.** `state.ts:77` registers a `beforeunload`
  listener; that alone makes a page ineligible for the back/forward cache in Firefox and
  historically Safari. `pagehide` / `visibilitychange` is the modern pair.
- **`ApplyThemeOptions.document` and `.namePrefix` are required by the type** but the code
  does `options.document ?? window.document` and `options.namePrefix ?? 'jig-'`, and the
  TSDoc documents defaults. The documented defaults are unreachable; make the fields
  optional.
- **`@angular/compiler` looks like an unused peer dependency** — nothing in
  `packages/controls/src` imports it. _(Checked after the audit: removing it breaks
  `ng test`, whose builder emits an `init-compiler.js` that imports it for JIT. Keep it.)_
- **`"@awdlab/jig-themes": "workspace:"`** in `peerDependencies` has no specifier, while
  `dependencies` uses `workspace:*`. _(Checked after the audit: not a bug —
  `resolve-workspace-dependencies.ts` handles both forms identically, on purpose.)_

---

## B. API design and consistency

This is where the alpha window matters most. Everything here is a rename or a base-class
extraction — cheap now, expensive after 1.0.

### B1. `focussable` is misspelled in the public API

```
scroller.ts:89    public readonly focusable  = input(false, …)
list-box.ts:118   public readonly focussable = input(true,  …)
tree.ts:~121      public readonly focussable = input(true,  …)
```

Both misspelled inputs have TSDoc that spells it correctly ("Whether the list box itself
is focusable…"). It's also in three `a11y.md` files and two templates. Rename to
`focusable`.

### B2. Same input, different default

`selectable` is `false` on `list-box` and `true` on `dropdown-list` and `tree`. Pick one.
(`true` reads right for all three — a list box you can't select from is the unusual case.)

### B3. `filterText` is write-only on four of the five controls that have it

`command` declares `filterText = model`. `list-box`, `dropdown-list`, `tree` and `select`
declare `input`. So you can seed the filter but never read what the user typed — which
rules out "show a result count", "persist the filter", "sync two lists". Make it a `model`
everywhere.

### B4. Extract a `CollectionControlBase`

`list-box`, `dropdown-list`, `tree` and `select` each redeclare, with duplicated TSDoc:

`items`, `multiple`, `checkbox`, `selectable`, `selectOnHover`, `separator`, `filter`,
`filterText`, `loading`, `virtual`, `itemHeight`

Eleven inputs × four controls. That duplication is exactly why B1, B2 and B3 drifted in
the first place. `ValueControlBase` already proves the pattern works.

### B5. Outputs use six different naming conventions

| Convention           | Examples                                                                   |
| -------------------- | -------------------------------------------------------------------------- |
| past participle      | `clicked`, `closed`, `completed`, `rejected`                               |
| present participle   | `closing`                                                                  |
| bare imperative verb | `upload`, `remove`, `retry`, `cancelUpload`, `closeSnackbar`, `closeToast` |
| noun phrase          | `valueCommit`, `endReached`                                                |
| `*Change`            | `filterChange`, `activeItemChange`, `filterResultChange`                   |
| plain noun           | `paginator.value`                                                          |

Three stand out:

- **`JigUpload`'s `upload` / `remove` / `retry`** read as methods you call, not events you
  receive. `uploadRequested` / `fileRemoved` / `retryRequested` / `uploadCancelled`.
- **`closeSnackbar` / `closeToast`** restate the control name and are imperative; every
  other overlay uses `closed`.
- **`JigPaginator.value` is an `OutputEmitterRef<PaginationState>`.** An output named
  `value` in Angular reads as half of a `value` / `valueChange` two-way pair, and
  `ValueControlBase.value` is a `model` on every other control. The paginator also has a
  separate `page` model, so `value` and `pageChange` both fire. Rename to `stateChange`.

A documented rule — past participle for "it happened", `*Change` for state — plus one
rename pass closes this.

### B6. Template-input naming

`template{Part}` is the house style (`templateItem`, `templateHeader`, `templateContent`,
`templateOverflow`, …). Two exceptions:

- `rating.indicatorTemplate` — should be `templateIndicator`.
- `calendar`'s internal `days` / `time` components expose `dayTemplate`, `weekDayTemplate`,
  `monthTemplate`, `yearTemplate`, `timeTemplate` as `input.required` with no TSDoc. These
  are internal plumbing (see C5) but they're public members on exported classes.

### B7. `splitter` uses `ariaLabel` / `ariaLabelledBy`

Everything else uses `label` / `labelledBy` (`ValueControlBase`, `table`, `tree`,
`list-box`). Rename for consistency.

### B8. Three APIs for "persist my state"

| Control    | Shape                                                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `splitter` | `stateStorage` (`'local' \| 'session'`) + `stateKey` + `stateData` inputs, `stateSaving` / `stateLoading` outputs, `registerState()` under the hood |
| `table`    | `storage: { key, kind: 'localstorage' \| 'sessionstorage' \| 'cookie' \| adapter, states: [...] }`, `JigStorage` under the hood                     |
| `tree`     | same as table, minus `states`                                                                                                                       |

Two different kind vocabularies (`'local'` vs `'localstorage'`), two engines, and only the
`JigStorage` one is SSR-safe, cookie-capable and crash-proof (A5). Converge the splitter
onto `storage: JigTableStorageConfig`-shaped config and delete `registerState` /
`loadState` / `saveState`. That's a net deletion.

### B9. `jigScrollShadow`'s `unstyled` means something else

`JigBase.unstyled` = "apply no theme styles". `JigScrollShadow.unstyled` (aliased
`jigScrollShadowUnstyled`) = "keep the overlay element but render it inert, I'll paint my
own shadows". Different concept, same word, and the directive doesn't extend `JigBase` so
there's no type-level clash to catch it. `ownShadows` or `overlay="none"` says what it
does.

### B10. Overlay dismissal can't express "Escape only"

```ts
export type PopoverCloseBy = 'any' | 'none';
export type CloseBy = PopoverCloseBy | 'escape';
```

`dialog` and `command` get `'escape'`; `popover`, `drawer` and `dropdown-list` don't. A
drawer that closes on Escape but ignores outside clicks is a routine requirement and
currently unexpressible. The native popover API's `auto` / `manual` is the reason, but
`'escape'` is implementable on top of it.

Also worth adding at the same time: `'outside'` (outside click but not Escape), which no
control supports.

### B11. `input<Multiple>()` makes the attribute form a type error

`select`, `list-box`, `dropdown-list` and `tree` declare
`multiple = input<Multiple>()` with `Multiple extends boolean = false`, plus `select`'s
`editable = input<Editable>()`. The generic drives the value type — `JigSelect<V, false, true>`
narrows `value` to `V[]` — which is genuinely nice typing. The cost is that bare
`<jig-select multiple>` doesn't type-check (the attribute supplies `''`), so the most
idiomatic Angular spelling is off-limits on the library's most common modifier, and the
TSDoc still says `@default false`. Worth a line in the docs at minimum; better, a
`booleanAttribute`-style transform that preserves the literal type.

### B12. `JigItem` defaults to `any`

```ts
export type JigItem<T = any, V = any> = { … }
```

In a repo that runs `strict` + `noUncheckedIndexedAccess` + type-aware lint, the central
data contract opting out of the type system is conspicuous. `unknown` defaults would
surface A4 and push call sites toward the generic form. Same for `AnyJigPassthrough`.

### B13. `mapToItems` and `flatItems` don't say what they do

```ts
mapToItems(items); // flattens groups, DROPS the group entries
flatItems(items); // flattens groups, KEEPS the group entries
```

The names convey neither "flatten" nor the difference between them. `flattenGroups` /
`flattenWithGroups`.

### B14. `JigItemFields.translate` is dead

Declared on the public type; `transformToJigItem` never reads it. Either implement it or
drop it.

### B15. No `fields` input on the collection controls — and `select`'s own docs promise one

`JigSelect.options`:

> A list of plain objects. You'll have to provide a `{@link fields}` input to specify how
> to map the plain objects to `JigItem` objects.

There is no `fields` input on `JigSelect`. The build tool confirms it —
`[api-links] JigSelect → fields` is in the unresolved list (C1).

This is the biggest DX item in the review. Every collection control today requires
`transformToJigItems(users, { label: 'name', value: 'id' })` at the call site, and
`JigItemFields<T, K>` already exists and is already typed for exactly this. Adding
`fields` as an input on `select` / `list-box` / `dropdown-list` / `tree` (and letting
`items` accept `readonly T[]` when `fields` is present) removes the most common piece of
boilerplate in the library and matches what every peer library does with
`optionLabel` / `optionValue`. If B4 lands, it's one input on one base class.

### B16. Three inputs have no TSDoc, so the docs render Angular's text instead

`readonly` and `dirty` on `ValueControlBase`, and `color` on `JigBase`, carry no TSDoc.
Because `ValueControlBase implements FormValueControl<T>`, TypeDoc inherits Angular's
descriptions, and the live Select API table shows:

> **dirty** — An input to receive the dirty status for the field. If implemented, the Fiel…
> **readonly** — An input to receive the readonly status for the field. If implemented, th…

That's Angular's signal-forms prose in Jig's docs, describing a contract the reader hasn't
met. (`color` is missing from the table entirely — see C4.) 28 of 602 inputs lack TSDoc
overall; the rest are calendar internals and `snackbar.actions`.

### B17. rxjs is a required peer for four shallow usages — and leaks into the public API

```
api/ng/dom.ts             fromEvent, Observable, Subject, Subscription
api/ng/theme-service.ts   skip
directives/scroll-amount.ts map
dialog/create-dialog.ts   Observable, Subject
```

All four are replaceable with signals, plain listeners or a promise. The one that matters
is `createDialog`, whose `DialogHandle.buttonClicked` is an `Observable` — so a
signals-native, zoneless library hands consumers an rxjs type in its programmatic dialog
API, while `PromptDialogHandle.result` right next to it is a `Promise`. Make it a signal
or a callback and rxjs drops out of `peerDependencies` entirely. That's a real marketing
line for a library whose landing page says "signals-native, zoneless".

### B18. `createDialog(injector, config)` should be an injectable

Every call site has to thread an `Injector` through. `inject(JigDialogs).open(config)` is
the shape people expect, and the function can stay for non-injection-context callers.

### B19. `select` has no `loading` input

`dropdown-list` — which `select` renders internally — has `loading`. `select` doesn't
forward it, so async option loading shows an empty list with no affordance. One-line
passthrough.

---

## C. Docs app

### C1. 141 `{@link}` references don't resolve

`prepare-docs` prints them on every build:

```
[api-links] 522 links resolved, 141 left as plain text on documented pages
```

They fall into three buckets:

1. **~120 are `stepValue` and `markTouched`** — `JigBase.canStepValue`'s TSDoc links
   `{@link stepValue}` and `ValueControlBase` links `{@link markTouched}`, both of which
   are `protected` and therefore absent from the public API tables. Every single control
   page carries a dangling `stepValue`. Fix once in the base classes (drop the link or
   make the members public).
2. **Public types with no documented home** — `BreadcrumbItem`, `MeterItem`, `JigTreeItem`,
   `JigUploadFile`, `JigDragInfo`, `JigActionButtonConfig`, `GlobalIconTemplate`,
   `JigShortcutBinding.global`, `JigToolbarRegion`. See C2.
3. **A handful of genuine mistakes** — `JigSelect → fields` (B15), `JigTable → JigTable`
   (self-link), `JigItemView → T` / `JigScroller → T` (linking a generic parameter).

The tool is already doing the right thing by reporting these; nothing consumes the report.
Make `prepare-docs` fail, or at least warn loudly, above a threshold.

### C2. There is no reference for the library's data types

`apps/docs/tools/docs-pages.ts`:

```ts
/** The typedoc groups the API table renders, and therefore the ones with anchors. */
export const API_GROUPS = new Set(['Inputs', 'Outputs', 'Properties']);
```

Interfaces and type aliases are never rendered. So the shapes a consumer _must_ construct
to use the library — `JigItem`, `BreadcrumbItem`, `MeterItem`, `JigTreeItem`,
`JigUploadFile`, `PopoverOptions`, `TableDataSource`, `JigActionButtonConfig`,
`ValueType<V, Editable, Multiple>` — appear in the API tables as bare, unlinked type names
and nowhere else. Reading the source is the only way to learn them.

A "Types" group in the API table (or a per-page "Types" section fed by the same typedoc
JSON) would close this and roughly half of C1 at the same time.

### C3. The API table is one flat alphabetical list

Select's Inputs table, in order: `checkbox`, `dirty`, `disabled`, `editable`,
`editableAutoFilter`, `filter`, `filterText`, `iconDropdown`, `iconFilter`, `inputId`,
`invalid`, `invalidOn`, `itemHeight`, `label`, `labelledBy`, `multiple`, `options`, …

`options` — the input you cannot use the control without — is seventeenth, between
`multiple` and `placeholder`, interleaved with `dirty`, `inputId` and `invalidOn` from the
base classes. 33 rows, ~10k px of page.

Split into "Select" and "Inherited" (or "Common"), the way the playground's property panel
already does with its `CONTROL · 20` / `COMMON · 1` grouping. The typedoc JSON knows each
member's declaring class, so this is a grouping change in the renderer, not new data.

### C4. `kind` and `color` are missing from every API table

`JigBase` declares both as `input()`. Neither appears in Select's table (I checked all 33
rows). They're the primary theming inputs and they're documented only in the Kinds &
Colors guide. `pt` _is_ there, with a custom blurb, so the renderer clearly has a path for
special-casing base inputs — kind and color should take it too.

### C5. Internals are published as public API

Select's Properties table lists `element`, `injector`, `controlScope`, `isFieldControl`,
`templateTypes`, `empty`, `invalidState`, `requiredState`, `appliedKind`, `appliedColor`.
`appliedKind` and `appliedColor` have **empty descriptions**. `element` and `injector` are
framework plumbing. A reader can't tell which of these they're meant to use.

Mark the plumbing `@internal`, or add an "Advanced" group below the documented ones.
Same treatment for `JigCalendarDays` / `JigCalendarTime`, whose 22 undocumented
`input.required` members are internal but exported.

### C6. `spin-buttons` is a public control with no documentation at all

| Part                                | Status      |
| ----------------------------------- | ----------- |
| source, 4 themes, template, harness | present     |
| docs page                           | **missing** |
| demos                               | **missing** |
| Playwright test                     | **missing** |

It's absent from `COMPONENT_GROUPS`, so it isn't reachable from the sidebar either. Either
document it or fold it into `number-input` / `input-field` as a non-exported internal.

Smaller gaps in the same vein:

- `list-box` and `roving-focus` have no Playwright test (`list-box` is a top-20 control).
- `badge` and `stepper` are components with no `playground.ts`.
- `scroll-shadow` has no `a11y.md`.
- `icon` has no Playwright harness.

### C7. Playground: the property panel starts collapsed

Landing on `/components/table/playground`, the right-hand pane shows "Control Properties",
a "Filter" box, a collapsed "INPUTS" chip and the word "JigTable" — and nothing else. The
panel is genuinely good once expanded (20 live inputs plus a token map that highlights
elements on hover), but it looks broken until you find the chip. Default it open.

### C8. Playground: the preview pane is too narrow for wide controls

The table playground gives the demo roughly half the content width, so a seven-column
grid renders at ~150 px per column with a horizontal scrollbar, next to a property panel
with visible empty space. A draggable split (you ship `jig-splitter`), or a width that
keys off the control, would help. Table, toolbar and splitter are the affected ones.

### C9. Sidebar information architecture scatters related controls

The collection family is spread across three groups:

- `List Box` → Inputs
- `Tree` → Data Display
- `Dropdown List`, `Scroller` → Containers & Overlays
- `Select` → Inputs

And `Inplace` (Data Display) is separated from `Edit Inplace` (Inputs) despite being the
same pattern. A "Collections" group, or just moving `tree` and `dropdown-list` next to
`list-box`, would match how people actually look for these.

### C10. The docs app ships a scratch route

`app.routes.ts:9` registers `{ path: 'test', component: TestComponent }`, and
`TestComponent` is a **static import** at the top of the routes file, so it's in the
initial bundle. `test.ts` is an unstyled dialog smoke test. Delete it, or move it behind
`loadComponent` next to `_gallery`.

### C11. `server.ts` TODOs

```
// TODO: repo is private, so this 404s (stars stay null) until it goes public.
// TODO: repo is private, so this 404s (the changelog stays empty) until it …
```

Both will fix themselves on open-sourcing; worth tracking so the changelog page isn't
silently empty at launch.

---

## D. Architecture

### D1. The theme preset is a monolith — the performance guide says the opposite

`packages/themes/src/nova/index.ts` statically imports all ~60 control style modules and
hands them to `createTheme` as one flat array. No bundler can drop an entry of an array
literal that's passed to a function. So `provideJig({ theme: { preset: novaTheme } })`
puts the theme JS for every control in the bundle, whether or not you import the control.

Source weight: `nova` 286 KB, `base` 225 KB, `shade` 277 KB, `material` 271 KB.

Meanwhile `guides/advanced/performance/index.md` opens with:

> The library is designed so that an app pays for the controls it uses and nothing else.

and later:

> A page with three controls carries the CSS for three controls.

The CSS claim is true — `ThemeService.loadScope()` emits per-scope and only on first
render. The _bundle_ claim isn't, and the guide's own "Measuring" checklist ("that no
control you do not use appears") will fail for anyone who runs it.

Two things to do:

1. Correct the guide, and document the slim-theme recipe explicitly — `createTheme` and
   the per-control subpaths (`@awdlab/jig-themes/nova/button`) already make it possible,
   it's just filed under "Authoring a theme" rather than framed as the bundle lever it is.
2. Better: generate the preset so it's tree-shakeable, or ship a codegen/builder step that
   emits a preset containing only the scopes an app imports.

### D2. All theme CSS is generated at runtime, with no build-time path

`applyTheme` concatenates CSS strings in JS and injects `<style>` elements
(`upsert-theme-style-element.ts`). The consequences are all visible in the codebase
already: `jig-control-initializing` exists to hide FOUC, `nonce` exists for CSP, and there
is per-scope work on first render.

What it costs: no browser CSS caching across navigations, no critical-CSS extraction, no
`<link rel=preload>`, a CSP `style-src` that needs a nonce or `unsafe-inline`, and style
work on the main thread at boot.

An opt-in build step — an Angular builder or a `jig-themes` CLI that runs the same
generator at build time and writes a real `.css` file — would keep the authoring model
(which is the good part) and remove the runtime cost. Big project; worth putting on the
roadmap while the API is still movable.

### D3. `packages/themes` has no tests and no test script

20,930 lines, one spec file in the whole package, and no `test` script in its
`package.json`. The untested code includes `splitScopableCss`, the `d()` dependency-selector
resolver with its three arities and its projected-dependency branch, `deepMerge`,
`combine-variations`, `combine-variable-variations` and `repeat-variables` — all pure
functions with obvious inputs and outputs, and all of them load-bearing for every control's
appearance. The Playwright screenshot suite catches regressions eventually, but at the
wrong granularity and much later.

This is the cheapest high-value test work available in the repo.

### D4. Module-level mutable globals

- `i18n/load-language.ts` keeps `customLanguages` and `languageTags` at module scope and
  mutates them. Under SSR that's shared across concurrent requests; in tests it leaks
  between cases.
- `utils/logger.ts` is a module-level singleton with a mutable `logLevel` that isn't
  reachable from `provideJig` — the one place a consumer would look.

Both want to be DI-provided.

### D5. Only `en` and `de` ship

179 keys each, in parity. `registerCustomLanguage` covers everyone else, which is a
reasonable position for alpha — but `fr` and `es` are cheap and change the first
impression for a library being evaluated against Material and PrimeNG.

---

## E. Feature gaps worth closing

### E1. Calendar has no `min`, `max`, `disabledDates`, or range selection

`JigCalendar`'s inputs are `firstDayOfWeek`, `showTime`, `showSeconds`, `inline`,
`format`, plus the five templates. No bounds, no per-day disabling, no range, no
multi-select. The value is a single `Date`.

For a date picker these are table stakes — "no dates in the past" is the single most
common requirement there is, and there's currently no way to express it short of a custom
`templateDay` that can't actually block selection. `jig-slider` already has `range`, so
the pattern exists in-house.

Suggested order: `min` / `max` → `disabledDates` (predicate or array) → `range`.

### E2. `fields` mapping on collection controls

See B15. Biggest DX win in the list, and the type already exists.

### E3. `light` / `prefers-contrast` theme variants

See A9. Half-built: the `ThemePart` shape, the parser and the per-variant plumbing are
there; only the two `buildVariablesCss` / `buildStyleCss` emit branches and a configurable
selector are missing. A high-contrast theme is also an accessibility differentiator for a
library that leads with "AA WCAG 2.2" on its landing page.

### E4. Controls a peer library has and Jig doesn't

Mostly complete at 65 controls. Genuinely absent: **card** (every peer has one, and it's
the most common "I'll just build it myself" container), **timeline**, **image / lightbox**,
**carousel**, **tree-table**. Card is the one I'd add.

---

## Quick wins, in order

1. `booleanAttribute` on the 15 inputs in A1, plus a lint rule. (A1)
2. Rename `focussable` → `focusable`. (B1)
3. Parens in `PromptDialogHandle`; move the `const` in `createDialog`. (A2, A3)
4. try/catch in `loadState` — or delete it by moving splitter onto `JigStorage`. (A5, B8)
5. TSDoc for `readonly`, `dirty`, `color`; drop the `{@link stepValue}` / `{@link markTouched}`
   links. That alone clears ~120 of the 141 broken links. (B16, C1)
6. Delete the `/test` route. (C10)
7. Default the playground property panel to open. (C7)
8. Document `spin-buttons` or make it internal. (C6)
9. Correct the performance guide's bundle claim and document the slim-theme recipe. (D1)
10. Unit-test `packages/themes`' pure functions. (D3)

## Bigger calls, best made now while it's alpha

- `CollectionControlBase` + a `fields` input. (B4, B15)
- One output-naming convention, applied across the board. (B5)
- One state-persistence API. (B8)
- Types and interfaces in the API reference. (C2)
- Calendar `min` / `max` / `disabledDates` / `range`. (E1)
- Drop rxjs from the public surface and from `peerDependencies`. (B17)
- Build-time CSS extraction. (D2)

---

## What was fixed

Everything below landed on `claude/library-docs-deep-review-9e1626` after the audit.
`pnpm lint`, `pnpm build`, `pnpm unit-test` (900 tests) and `pnpm test:build` all pass.
The Playwright suite was **not** run — port 4222 was occupied by another worktree's dev
server, so a run would have silently tested the wrong build.

### Bugs

| Finding                                          | Fix                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1 — 15 boolean inputs                           | `booleanAttribute` on the 11 plain ones. The four tri-state inputs (`checkbox` on select/list-box/dropdown-list/tree, and `menu.autoAnchorAria`) where unset means "derive from `multiple`" got a new `optionalBooleanAttribute` transform in `@awdlab/jig/utils-ng`, which maps `''` to `true` but leaves `undefined` alone.                                                                             |
| A2 — `createDialog` TDZ                          | Gone: the rxjs `Subject` it referenced was removed entirely (see B17).                                                                                                                                                                                                                                                                                                                                    |
| A3 — `PromptDialogHandle` parens                 | Now `(T extends … ? D : never) \| null`.                                                                                                                                                                                                                                                                                                                                                                  |
| A4 — `transformToJigItems`                       | `JigItem<Items[P], Items[number][K]>`; same fix in `transformToJigItemsSignal`.                                                                                                                                                                                                                                                                                                                           |
| A5 — `loadState` crash                           | Gone: `registerState` / `loadState` / `saveState` deleted with the splitter migration (B8).                                                                                                                                                                                                                                                                                                               |
| A6 — breadcrumb a11y                             | `role="navigation"` plus a localized `aria-label` on the host, new `label` / `labelledBy` inputs, `aria-current="page"` on the last crumb, and crumbs now render by capability: `<a>` with a route, `<button>` with only a callback, `<span>` otherwise. All four themes already reset button chrome on `.item` (the overflow trigger is a button), so no theme change was needed. `a11y.md` rewritten.   |
| A7 — slider/rating Page keys                     | `PageUp` / `PageDown` on both. Slider gained a `bigStep` input (default `step * 10`), matching `number-input`; rating pages by a whole symbol.                                                                                                                                                                                                                                                            |
| A8 — slider float drift                          | New `addWithPrecision` in `@awdlab/jig/utils`, lifted out of `number-input/helper.ts` (which re-exports it), used for keyboard stepping and pointer snapping in slider and rating.                                                                                                                                                                                                                        |
| A10 — `JigError` log                             | The fancy log now includes `errorMsg`.                                                                                                                                                                                                                                                                                                                                                                    |
| A10 — `applyDialogConfig`                        | One `Object.entries` loop; it can no longer drift from `DialogConfig`.                                                                                                                                                                                                                                                                                                                                    |
| A10 — unused peer dep                            | **Not a bug.** Removing `@angular/compiler` from `peerDependencies` breaks `ng test`: the Angular unit-test builder emits an `init-compiler.js` that imports it for JIT, and pnpm had been resolving the peer into `packages/controls/node_modules`. Restored. No source file imports it, but it is load-bearing for the test runner, and for any consumer compiling JIT.                                 |
| A10 — `workspace:`                               | **Not a bug.** `tools/utils/resolve-workspace-dependencies.ts` treats `workspace:` and `workspace:*` identically, deliberately; the published peer range is `^0.0.7` either way. Left alone — the audit was wrong about this one.                                                                                                                                                                         |
| **new** — `deepSet`                              | Found by the new themes tests: `deepSet(obj, 'primary', v)` produced `{primary: {primary: v}}`, because it descended into the last key before assigning. Every theme's colour variable template carried a bogus extra level.                                                                                                                                                                              |
| **new** — `splitScopableCss`                     | Also found by the new tests: for CSS _starting_ with an at-rule, `css.slice(start, i - 1)` at `i === 0` is `slice(0, -1)` — the whole block was copied into the scopable half and the at-rule emitted a second time.                                                                                                                                                                                      |
| **new** — `*Change` outputs absent from the docs | `api-docs-gen` built the `*Change` reflection for every `model()` and put it in a group, but never added it to `control.children`. TypeDoc serializes by walking `children`, so the nodes were never written and the group pointed at nothing. Every `valueChange`, `openChange`, `sortChange` in the library was missing from its API table; `JigTabs` and `JigTable` rendered an empty Outputs section. |

A9 (`light` / `highContrast`) was left alone, as agreed.

### API

| Finding       | Fix                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1            | `focussable` to `focusable` on `jig-list-box` and `jig-tree`, plus templates and three `a11y.md` files.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| B2            | `selectable` defaults to `true` everywhere; `list-box` was the odd one out. Demos that set `[selectable]="true"` had the line removed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| B3            | `filterText` is a `model()` everywhere. On `jig-select` that is a real behaviour change: it kept what the user typed in a private `filterTextInternal`, which is now the public model, so the filter text is readable and writable from outside.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| B4            | New `CollectionControlBase<C, Value, Items, Multiple, Filter>` in `@awdlab/jig/base`, sitting under the three `*Templates` classes. It owns `items`, `selectable`, `multiple`, `checkbox`, `showCheckboxes`, `virtual`, `itemHeight`, `filter` and `filterText` — 11 duplicated declarations collapsed to one. `FilterConfig` is a type parameter rather than an import, because `base -> api -> icon -> base` is an ng-packagr dependency cycle.                                                                                                                                                                                                                                                                                              |
| B5            | Written up as a proposal in **[OUTPUT-NAMING.md](OUTPUT-NAMING.md)**: the six conventions in use, the three-category rule to keep, and the 13 renames it implies. Not applied — it is a breaking rename pass that deserves its own commit.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| B8            | One storage API, one engine, one implementation. New `registerStorage()` in `@awdlab/jig/api/ng` declares state as named slices — `{ value, restore, skipWrite? }` — and owns store creation, restore, the `states` filter, debouncing and the destroy flush. Table, tree and splitter all register with it; `jig-splitter` takes the same `storage: { key, kind?, states? }` input as the other two, and all three config types are aliases of `JigStorageConfig<S>`. `stateStorage` / `stateKey` / `stateData` and `utils-ng/state.ts` are gone, and `defaults.splitter.stateStorage` collapsed into one `defaults.stateStorage`. Net −216 lines in the three controls against ~175 in the helper. Guides, splitter page and demo rewritten. |
| B15 / drift 7 | Investigated — see below. The TSDoc now points at `transformToJigItems`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| B16           | TSDoc added for `readonly`, `dirty`, `disabled`, `kind` and `color`, so the tables stop rendering Angular's `FormValueControl` prose.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| B17           | rxjs is out of `create-dialog.ts`. `DialogHandle.buttonClicked` is the dialog's own `OutputRef`, which has the same `.subscribe(fn)` shape, so call sites are unchanged. rxjs is still a peer dependency for three other shallow uses.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Docs

| Finding      | Fix                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1           | 141 unresolved `{@link}`s down to **25**. The links to protected members (`markTouched`, `liveMode`) became plain prose; `stepValue` / `canStepValue` resolve now that public methods are documented (below); types resolve now that they are (below); and `api-links-gen` indexes group children project-wide and registers inherited members under their declaring class. Resolved links went from 522 to 889. |
| C2           | New **Types** group in the API table. `api-docs-gen` collects the interfaces and aliases of the control's whole entry-point folder — so `JigUploadFile` from `upload/types.ts` lands on the upload page — skipping anything marked `@internal`. Interface members render inline as `name: type` with their descriptions, so a shape is readable without leaving the page.                                        |
| C3           | Each group renders the control's own members first, then one "Inherited" table. On `jig-select`, `options` moved from row 17 of 33 to the first table. TypeDoc's `inheritedFrom` names the proximate base (`SelectTemplates`), not the declaring class, so the heading is just "Inherited". Also new: a **Methods** group, which is how `show` / `hide` / `uploadAll` / `markDone` became documented at all.     |
| C4           | `kind` and `color` are always shown. They were hidden whenever the active docs theme declared no kinds or colors for that control, which silently dropped the two main theming inputs from most pages. The type column reads `undefined` in that case, which is accurate rather than absent.                                                                                                                     |
| C6 (partial) | `/test` is behind `loadComponent`, out of the initial bundle.                                                                                                                                                                                                                                                                                                                                                    |

### Architecture

| Finding | Fix                                                                                                                                                                                                                                                                                                                         |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D3      | `packages/themes` has a `test` script and vitest. 30 tests across `deepSet`, `deepMerge`, `subKey`, `groupArrayUsing`, `getClassName`, `getCssVar`, `splitScopableCss`, `scopeAtRule`, `combineVariations` and `repeatVariables`. They caught the two bugs listed above on their first run. `pnpm unit-test` picks them up. |

### Feature gaps

E1 is tracked as three issues: [#55 min/max](https://github.com/awdlab/jig/issues/55),
[#56 disabledDates](https://github.com/awdlab/jig/issues/56),
[#57 range selection](https://github.com/awdlab/jig/issues/57). #55 lands the shared
selectability predicate the other two build on.

---

## Three things that were investigated rather than changed

### `nova/index.ts` is not type-only — the preset is live at runtime

It is the documented runtime entry. `provideJigControls({ theme: { preset: nova } })` in
the installation and configuration guides stores it as `ThemeService.activeTheme()`, and
`loadScope()` calls `applyTheme(activeTheme, [scope])`, which reads `theme.parts` and
generates CSS from it. The `parts` array is a literal of ~60 statically imported style
modules passed to `createTheme`, so no bundler can drop an entry.

So D1 stands: an app using `nova` bundles the theme JS for every control. `loadScope` only
controls which CSS is _emitted_, not what ships. The performance guide's claim that "a page
with three controls carries the CSS for three controls" is true; "an app pays for the
controls it uses and nothing else" is not, for the theme.

Left unchanged — the fix is either a codegen step or a documented slim-theme recipe, and
that is a design decision rather than a bug fix.

### `fields` was removed on purpose, and the TSDoc was never updated

`git log -S` finds it: commit `72a71191`, _"fields removed for simplicity"_, 2025-12-11.
`[fields]="{ value: 'id', label: 'label' }"` was a real input on select and list box, with
its own demos, and it was replaced by pre-mapped `exampleData.items.*Preformatted` fixtures.

So this was a comment bug, not a missing feature. `JigSelect.options` now points at
`transformToJigItems` instead of a `{@link fields}` that has not existed for ten months.

Whether to bring `fields` back is a separate question. For: `JigItemFields<T, K>` still
exists and is still exported, and every collection call site maps by hand. Against — the
reason it went — one way to pass items is simpler than two. Worth a decision either way,
since the type is sitting there unused.

### `kind` / `color` were hidden by the active theme, not by the generator

They were in the typedoc output all along. `properties.html` had a guard:

```html
@if ((prop.name !== 'kind' || specialTypes().kind) && (prop.name !== 'color' ||
specialTypes().color))
```

`specialTypes()` builds the type string from the _currently selected docs theme_'s kinds
and colors for that control scope, and returns `null` when it declares none — which hid
the row. So the two primary theming inputs were missing from most control pages, and which
pages depended on the theme the reader had picked.

The row always renders now, with `undefined` as the type when the theme declares nothing.

---

## Still open

- **A7's sibling** — `jig-rating` has no large-step input of its own; `PageUp` / `PageDown`
  move a whole symbol, which is a reasonable default but not configurable.
- **C5** — internals are still listed as public API (`element`, `injector`, `controlScope`,
  `templateTypes`, `isFieldControl`). They are at least below the fold now, in the
  "Inherited" table. `appliedKind` / `appliedColor` still have empty descriptions.
- **C6** — `spin-buttons` still has no docs page, no demos and no Playwright test, and is
  still absent from `COMPONENT_GROUPS`. `list-box` and `roving-focus` still have no
  Playwright test; `badge` and `stepper` still have no playground; `scroll-shadow` still
  has no `a11y.md`.
- **C7 / C8** — the playground property panel still starts collapsed, and its preview pane
  is still too narrow for table and toolbar.
- **C9** — sidebar IA unchanged.
- **D1 / D2** — theme preset monolith and runtime-only CSS generation; the performance
  guide still states the stronger version of the bundling story.
- **D4** — `registerCustomLanguage` and `Logger` are still module-level mutable globals.
- **B5** — the output renames are proposed, not applied.
- **B10 / B11 / B12 / B13 / B14 / B19** — untouched.
- **25 `{@link}`s** still unresolved, mostly intra-type self-references
  (`JigUploadFile -> id`) and links to genuinely private members.
- **Playwright** — not run; see the note at the top of this section.
