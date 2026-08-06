# `ngn-command` — Command Palette Control

Date: 2026-07-31
Branch: `feat/docs-semantic-search` (existing branch, do not switch)

## Goal

A command palette (`⌘K`-style) control: a chromeless modal dialog holding a search input over a
filtered, grouped list of actions. Reference visual is the shade theme screenshot: dark surface,
search row on top, group labels (`Navigation`, `Actions`), icon + label rows, one highlighted row,
no header, no footer, no close button.

Keyboard shortcut rendering (the `⌘H` column in the screenshot) is **out of scope** — it waits on a
dedicated shortcut control.

## Decisions

| Question             | Decision                                                                     |
| -------------------- | ---------------------------------------------------------------------------- |
| Item model           | Reuse `NgnActionItem[]` (menu's contract) — `children` are groups            |
| List rendering       | Reuse `ngn-list-box` as a theme dependency, like `ngn-select` does           |
| Hiding dialog chrome | Dialog auto-hides header/footer when they have no content; new `closeButton` |
| Opening              | `open` model + `show()`/`hide()`/`toggle()`; consumer wires their own hotkey |
| Nesting              | One level: top-level `children` are group headers. No cmdk-style drill-in    |
| On select            | Invoke `callback`, navigate `route`, emit `commandSelected`, close           |
| Search matching      | `label` only via list-box's default filter; `filter` input overrides         |
| Themes               | All four: base, shade, nova, material                                        |

## 1. Control — `packages/controls/src/command/`

Files: `command.ts`, `command.html`, `command-templates.ts`, `index.ts`, `ng-package.json`,
`package.json` (`{}` marker, matching `list-box/`).

`NgnCommand extends CommandTemplates extends NgnBase<'command'>`. The templates base exists because
the control exposes template projection inputs (per the naming conventions in CLAUDE.md).

### Inputs

| Input           | Type                                                      | Notes                                    |
| --------------- | --------------------------------------------------------- | ---------------------------------------- |
| `items`         | `input.required<NgnActionItem[]>()`                       | `children` render as groups              |
| `open`          | `model(false)`                                            | Defaults `false` — see Deviations        |
| `placeholder`   | `input<string>()`                                         | Falls back to `command_placeholder` i18n |
| `filter`        | `input<FilterConfig<NgnItem>\|boolean>(true)`             | Forwarded to list-box                    |
| `iconSearch`    | `input<IconType>()`                                       | `defaultIcon="search"`                   |
| `size`          | `input<DialogSize>({ width: '560px', maxWidth: '90vw' })` | Forwarded to dialog                      |
| `closeBy`       | `input<CloseBy>('any')`                                   | Forwarded to dialog                      |
| `templateItem`  | `input<TemplateRef>()`                                    | Forwarded to list-box                    |
| `templateGroup` | `input<TemplateRef>()`                                    | Forwarded to list-box                    |
| `templateEmpty` | `input<TemplateRef>()`                                    | Forwarded to list-box                    |

Every input gets a 1–2 sentence TSDoc with unquoted `@default` for non-obvious defaults.

### Output / API

- `commandSelected = output<NgnActionItem>()`
- `show()`, `hide()`, `toggle()` delegating to `open`

### Template composition

```
<ngn-dialog [ptInt]="this" [ptDep]="'dialog'" [modal]="true" [closeButton]="false"
            [(open)]="open" [closeBy]="closeBy()" [size]="size()">
  <ngn-input-field [ptInt]="this" [ptDep]="'search'">
    <input ngnInput ngnAutofocus [value]="filterText()" (valueChange)="filterText.set($event)"
           (keydown)="onKeyDown($event)" [attr.aria-label]="placeholderText()" />
    <ngn-icon [ptClass]="'search-icon'" [icon]="iconSearch()" defaultIcon="search" />
  </ngn-input-field>
  <ngn-list-box [ptInt]="this" [ptDep]="'list-box'" [focussable]="false" [selectable]="true"
                [items]="mappedItems()" [filter]="filter()" [filterText]="filterText()"
                (itemClicked)="onItemClicked($event)" ... />
</ngn-dialog>
```

### Internals

- `mappedItems = computed()` maps `NgnActionItem` → `NgnItem`: `{ label, icon, value: id, disabled,
testId, items: children?.map(...), data: actionItem }`. Grandchildren are dropped.
- A flat `id → NgnActionItem` lookup map for resolving the clicked value.
- `onKeyDown` forwards the event to `listBox().onKeyDown(event)` — the same delegation
  `NgnSelect.onKeyDown` uses (`select.ts:282`). ArrowUp/Down move the highlight, Enter selects.
- `onItemClicked(value)`: resolve item → `item.callback?.()` → if `item.route`, navigate via
  `inject(Router, { optional: true })` (menu's behavior, `menu.ts:271`) → `commandSelected.emit(item)`
  → `open.set(false)`.
- Reset `filterText` when `open` flips to `false`.
- Empty state: command defines its own default empty `<ng-template>` rendering `command_noResults`,
  and passes `templateEmpty() ?? defaultEmptyTemplate` into list-box, so list-box's own
  `listBox_noItemsFound` never surfaces here.
- Focus: `ngnAutofocus` on the search input (`directives/autofocus.ts`), the same directive menu
  uses, rather than the native attribute.

## 2. `NgnDialog` changes

`packages/controls/src/dialog/dialog.ts`, `dialog.html`, `dialog-templates.ts`.

- New input: `closeButton = input(true, { transform: booleanAttribute })`.
- `dialog-templates.ts` gains `hasHeaderContent` (`title() || #header || templateHeader()`) and
  `hasFooterContent` (`#footer || templateFooter() || footerButtons()?.length`) computed signals,
  exposed `protected` for the template.
- `dialog.html`: `@if (hasHeaderContent() || closeButton())` around `<header>`; `@if (closeButton())`
  around the X button; `@if (hasFooterContent())` around `<footer>`.

**Snag:** `<dialog [ngnMovableDragHandle]="header">` reads the `#header` template variable, which is
not in scope once `<header>` sits inside an `@if`. Replace with
`private readonly _headerEl = viewChild<ElementRef<HTMLElement>>('header')` and bind
`[ngnMovableDragHandle]="_headerEl()?.nativeElement ?? null"` (`NgnMovable.ngnMovableDragHandle` is
`input<HTMLElement | null>`, `movable.ts:39`).

**Behavior changes for existing consumers:**

- Titleless dialogs keep their X button (the X counts as header content), so `demos/dialog/lazy.ts`
  is unaffected.
- Dialogs with no footer buttons and no footer template no longer render an empty `<footer>` box.
  Verify the shade/nova/material dialog theme parts don't rely on that element for spacing.

## 3. Themes

- `packages/themes/src/templates/command/index.ts`:
  ```ts
  createControlTemplate({
    scope: 'command',
    classNames: ['root', 'search', 'search-icon', 'list', 'empty'],
    dependencies: [
      { class: 'dialog', template: dialogControlTemplate },
      { class: 'list-box', template: listBoxControlTemplate },
      { class: 'search', template: inputFieldControlTemplate },
    ],
  });
  ```
- `base/command/`, `shade/command/`, `nova/command/`, `material/command/`, each with an
  `index.ts` (`createThemePart()`) and an empty `package.json` marker.
- Register `commandStyles` in all four theme `index.ts` files.
- `pnpm --filter @ngneers/controls-themes build` before e2e — Node resolves theme parts from `dist`.
- Watch for TS2589 on a cold build; `command` pulls in dialog + list-box + input-field templates.

Shade styling target (from the screenshot): near-black surface, ~12px radius, hairline border,
search row separated by a bottom border, muted small group labels, icon + label rows, highlighted
row one step lighter, top-anchored (~15vh) with a blurred backdrop, zero chrome padding.

## 4. i18n

`packages/controls/src/i18n/translations/{en,de}/index.ts`:

```ts
command: {
  placeholder: 'Type a command or search…',
  noResults: 'No results found',
},
```

Flattened access is `command_placeholder` / `command_noResults`. `Translations` type derives from
`en`, so no separate type edit.

## 5. Tests — `tests/components/command.test.ts`

- Renders no `<header>`, no `<footer>`, no close button when open.
- Typing filters the list; groups with no matching child disappear.
- ArrowDown + Enter invokes the highlighted item's `callback` and closes the palette.
- `commandSelected` emits the original `NgnActionItem`.
- `route` items navigate via the injected `Router`.
- Filter text resets after close/reopen.

Dialog test additions: footer omitted with no footer content; `[closeButton]="false"` removes header
and X; movable still drags with a header present.

## 6. Docs

- `apps/docs/src/app/docs/components/command/{page.ts, index.md, api.md, playground.ts}`, registered
  in `apps/docs/src/app/docs/components/index.ts`.
- Demos in `apps/docs/src/app/demos/command/`: `base` (flat items + callbacks), `grouped` (mirrors
  the screenshot), `routes` (router navigation).
- Verify with `pnpm docs:build`; the dev server on :4200 serves a stale bundle for TS/template edits.

## Deviations worth noting

1. `open` defaults to `false` while `NgnDialog.open` defaults to `true`. A palette that starts open
   would flash on init. Documented in the TSDoc.
2. No `keywords` field — search matches `label` only. Consumers needing synonyms pass a custom
   `filter` config.
3. No `virtual` / `itemHeight` passthrough. list-box supports it; add when a consumer has a
   command list long enough to need it.
4. Grandchildren of top-level items are ignored rather than flattened, so a drill-in implementation
   later is not a breaking change.

## Out of scope

- Keyboard shortcut display and hotkey registration (separate control).
- cmdk-style drill-in pages.
- Async / remote command sources.
