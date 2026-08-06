# kbd component + keyboard-shortcut directive

Date: 2026-07-31

## Goal

Two pieces plus one integration:

1. `ngn-kbd` — displays a keyboard shortcut from a config string.
2. `[ngnKeyboardShortcut]` — binds shortcut strings to callbacks, scoped to focus within the host element.
3. `NgnActionButtonConfig.shortcut` — an action button registers its shortcut with the nearest ancestor scope. The dialog root becomes such a scope, so footer buttons of a prompt dialog get shortcuts.

## Shortcut string format

Lowercase tokens joined by `+`, order-insensitive: `mod+shift+a`, `escape`, `alt+arrowup`, `mod+/`.

Modifier tokens:

| Token   | Matches                                            |
| ------- | -------------------------------------------------- |
| `mod`   | Cmd (`metaKey`) on mac, Ctrl (`ctrlKey`) elsewhere |
| `ctrl`  | `ctrlKey`, literal on every platform               |
| `meta`  | `metaKey`, literal (Cmd / Windows key)             |
| `alt`   | `altKey`                                           |
| `shift` | `shiftKey`                                         |

Key token: a single character (`a`, `/`, `?`) or a name (`enter`, `escape`, `space`, `tab`, `delete`, `backspace`, `arrowup`, `pageup`, `home`, `f2`). Matched case-insensitively against `event.key`; `space` maps to `' '`.

Matching rules:

- Modifier set must match **exactly**. `a` does not fire on `mod+a`.
- Exception for punctuation: when the key token is a single non-alphanumeric character (`/`, `?`, `.`) and the combo does not name `shift`, the `shiftKey` state is not compared — many layouts need Shift to produce the character at all.
- `event.repeat` events are ignored (a held key fires once).
- `event.key` matching only — no `event.code`. Layout-correct; a QWERTZ `z` is `z`.

Platform detection: `navigator.userAgentData?.platform ?? navigator.platform` contains `mac` (case-insensitive). No `navigator` (SSR) → treated as non-mac. Detection affects **matching only**, never display, so server and browser render identical text; node structure is identical either way, so hydration is unaffected.

## Display

Glyphs always, on every platform — the formatter takes no platform argument.

`mod`/`meta` → ⌘ · `ctrl` → ⌃ · `alt` → ⌥ · `shift` → ⇧, emitted in the order ⌃⌥⇧⌘ followed by the key, with no separator.

Key glyphs: `enter` ↵ · `escape` ⎋ · `tab` ⇥ · `space` ␣ · `backspace` ⌫ · `delete` ⌦ · `arrowup` ↑ · `arrowdown` ↓ · `arrowleft` ← · `arrowright` → · `pageup` ⇞ · `pagedown` ⇟ · `home` ↖ · `end` ↘. A single character is upper-cased; an unrecognised name is Title-cased (`f2` → `F2`).

So `mod+shift+a` renders `⇧⌘A` everywhere — ⌘ sits nearest the key, as macOS writes it. Accepted cost: on Windows `mod` displays ⌘ while a literal `ctrl` displays ⌃, although both fire on the Ctrl key.

## `src/kbd/shortcut.ts` — pure helpers

No Angular imports, unit-testable in isolation.

```ts
export type ParsedShortcut = {
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
  key: string;
};

export function parseShortcut(shortcut: string): ParsedShortcut;
export function matchesShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean;
export function formatShortcut(shortcut: string): string;
export function isMacPlatform(): boolean;
```

`parseShortcut` resolves `mod` to `meta` on mac and to `ctrl` elsewhere, so the returned object is directly comparable to a `KeyboardEvent`. An unparseable string (empty, modifier-only) yields no key and never matches.

`formatShortcut` works off the raw tokens rather than `ParsedShortcut`, because display must keep `mod` (⌘) and `ctrl` (⌃) distinct after resolution has collapsed them.

## `ngn-kbd`

```html
<ngn-kbd [shortcut]="'mod+shift+a'" />
```

Renders a single semantic element:

```html
<kbd [ptInt]="this" [ptClass]="'key'">{{ display() }}</kbd>
```

Theme scope `kbd`, class names `root` (bound to the `ngn-kbd` host) and `key` (the inner `<kbd>` keycap).

`display = computed(() => formatShortcut(this.shortcut()))`. One input (`shortcut`, required), no outputs. Extends `NgnBase` with `provideSelf`, theme injected via `injectThemeTemplate` inline — no template inputs, so no `KbdTemplates` base class.

## `[ngnKeyboardShortcut]`

```ts
export type NgnShortcutBinding = {
  shortcut: string;
  callback: (event: KeyboardEvent) => void;
  disabled?: boolean;
};

@Directive({ selector: '[ngnKeyboardShortcut]', host: { '(keydown)': 'onKeydown($event)' } })
export class NgnKeyboardShortcut {
  public readonly bindings = input<NgnShortcutBinding[]>([], { alias: 'ngnKeyboardShortcut' });
  /** Returns an unregister function; the caller owns cleanup. */
  public register(binding: () => NgnShortcutBinding): () => void;
}
```

The bare-attribute form (`ngnKeyboardShortcut` with no value) hands the input a `''` string, so `bindings()` is treated as empty unless it is an array.

Scoping comes from DOM bubbling, not from a registry service or a document listener:

- The host listens for `keydown`. Events bubble from the focused descendant, so the shortcut fires only while focus is inside the host.
- A nested directive receives the event before an outer one. On a match it calls `preventDefault()` and `stopPropagation()`, so the outer scope never sees it — the inner listener wins.
- Nothing fires when focus is outside the host, including focus on `<body>`. This is a documented limitation; app-global shortcuts are the consumer's own document listener.

Resolution within one scope: descendant registrations are checked before the host's own `bindings` (deeper is more specific). The first match wins and the rest are skipped.

Skipped events:

- `event.repeat` is true.
- The combo has no `ctrl`/`meta`/`alt` modifier, the event target is an `input`, `textarea`, `select`, or `contenteditable` element, and the key is one that field would consume. `mod+s` still fires while typing; a bare `a` does not.

  The guard protects typing, so it must not swallow keys that type nothing: `escape` and the function keys (`f1`–`f12`) still fire inside a text field. Everything else modifier-less is suppressed there — printable characters because they are typing, and `enter`, `tab`, `space`, `backspace`, `delete`, the arrows, `home`/`end`, `pageup`/`pagedown` because a field consumes them for editing or caret movement.

- The matched binding has `disabled: true`.

`register` takes a getter so a caller whose binding changes over time does not need to re-register, and returns an unregister function the caller wires into its own `effect` cleanup or `DestroyRef`.

### Finding a scope: DOM ancestry, not DI

A descendant locates its scope by walking up the DOM, not through the element injector:

```ts
export function closestShortcutScope(element: Element | null): NgnKeyboardShortcut | null;
```

The directive records itself in a module-level `WeakMap<Element, NgnKeyboardShortcut>` keyed by its host element and removes the entry on destroy; `closestShortcutScope` walks `parentElement` from the given element and returns the first hit.

Because a DOM walk is not reactive, the registry also carries a module-level version signal, bumped whenever any scope enrols or is destroyed and read by `closestShortcutScope`. Without it a registrant resolves its scope exactly once: a scope that appears above an existing element, or is destroyed and recreated around it (a wrapper that conditionally wraps projected content), would leave that registrant permanently unbound.

DI is the wrong mechanism here. Angular resolves a `TemplateRef`'s element injector from the template's **declaration** site, not the DOM position it is projected into. `NgnDialog` declares its default footer template as a sibling of `<dialog>`, and a consumer-supplied `footerTemplate` is declared in the consumer's own component — so under DI neither one's action buttons can ever see a directive placed on `<dialog>`, no matter how `dialog.html` is arranged. DOM ancestry matches where the button actually renders, which is what "focus is inside this container" already means, so the same walk covers the default footer, custom footer templates, and arbitrary projected content alike.

## Action button integration

`NgnActionButtonConfig` gains `shortcut?: string`, and `action` widens to `(event?: PointerEvent) => void` so the keyboard path can invoke it without fabricating an event. `NgnActionButton.click` takes an optional event and passes it through unchanged; the `clicked` output still fires after `action`.

`NgnActionButton` resolves its scope with `closestShortcutScope(hostElement)` and, when a `shortcut` is configured, registers `{ shortcut, callback: () => this.click(), disabled: config().disabled }`. With no ancestor scope it warns via `Logger` and does nothing.

Template additions:

- `[attr.aria-keyshortcuts]` on the button, set only while the shortcut is actually live (a configured shortcut with no ancestor scope must not be advertised). Its value is **not** the config string: WAI-ARIA requires each token to be a valid `KeyboardEvent.key` value, so `mod`/`ctrl` are invalid there. `shortcut.ts` exports `ariaKeyShortcuts(shortcut)` mapping `mod` → `Meta` on mac and `Control` elsewhere, `ctrl` → `Control`, `meta` → `Meta`, `alt` → `Alt`, `shift` → `Shift`, and upper-casing a single-character key.
- `<ngn-kbd [shortcut]="config().shortcut">` after the label or icon, marked `aria-hidden="true"`, for **every** kind including icon-only. The glyphs are decorative: left exposed they join the button's accessible name, so a Save button announces as "Save up arrowhead S". `aria-keyshortcuts` is what carries the binding to assistive tech.
- The tooltip is left exactly as it was before this feature — icon-only buttons keep `ngnTooltipAutoAriaMode="label"` with the plain label as content. `NgnTooltip` clears `aria-label` unconditionally on every render pass and only rewrites it when its mode is not `none`, so a button cannot own that attribute while a tooltip directive shares its host. Glyphs therefore render inline rather than in the tooltip; an icon-only button shows icon + keycap.

## Dialog integration

`<dialog>` in `dialog.html` gets `[ngnKeyboardShortcut]="[]"` — a pure scope host with no bindings of its own. Footer action buttons resolve it by DOM ancestry, so `footerButtons: [{ label: 'Save', value: 'save', shortcut: 'mod+s' }]` works with no further wiring, and so does an action button inside a consumer-supplied `footerTemplate` or projected dialog content.

No implicit defaults: no Enter-triggers-primary, no Escape binding (`<dialog>` already closes on Escape natively). A dialog whose button configs declare no shortcut behaves exactly as before.

Snackbar also renders `ngn-action-button` but has no scope host, so `shortcut` is inert there. Marked with a `ponytail:` comment; a scope host can be added later if wanted.

## Files

| Part           | Path                                                                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Control source | `packages/controls/src/kbd/` — `kbd.ts`, `kbd.html`, `keyboard-shortcut.ts`, `shortcut.ts`, `shortcut.spec.ts`, `index.ts`, `ng-package.json`, `package.json`        |
| Theme template | `packages/themes/src/templates/kbd/index.ts`                                                                                                                         |
| Themes         | `packages/themes/src/{base,nova,shade,material}/kbd/index.ts` — every theme variant covers every control, so all four ship                                           |
| Harness        | `packages/playwright/src/components/kbd.ts` + a `components/index.ts` export                                                                                         |
| Tests          | `tests/components/kbd.test.ts` (Playwright) plus colocated Vitest `*.spec.ts` in `src/kbd/`                                                                          |
| Docs page      | `apps/docs/src/app/docs/components/kbd/` — `page.ts`, `index.md`, `api.md`, `playground.ts`                                                                          |
| Demos          | `apps/docs/src/app/demos/kbd/`                                                                                                                                       |
| Modified       | `api/ngn-button.ts`, `button/action-button.ts`, `button/action-button.html`, `dialog/dialog.html`, `dialog/dialog.ts` (imports), demo for a shortcut'd dialog button |

Theme parts need the empty `package.json` markers and a `pnpm --filter @ngneers/controls-themes build` before e2e, since Node resolves themes from `dist`.

## Testing

`src/kbd/shortcut.spec.ts` — table tests over `parseShortcut` / `matchesShortcut` / `formatShortcut`: mod resolution per platform, exact-modifier rejection, case-insensitive key match, `space`, glyph order, unparseable input.

`src/kbd/keyboard-shortcut.spec.ts` — Vitest + TestBed:

- Directive fires the callback for a keydown from a focused descendant.
- Nested directives: inner handles, outer does not.
- Modifier-less combo suppressed when typing in an input; `mod`-combo not suppressed.
- `event.repeat` suppressed.
- Action button with `shortcut` registers into an ancestor scope and its `action` + `clicked` both fire on the key press; `disabled` config does not.

`tests/components/kbd.test.ts` — Playwright via `loadComponent`, using an `NgnKbdHarness`: rendered glyphs, and a dialog whose `footerButtons` carry a `shortcut` emitting `buttonClicked` when the combo is pressed. Display is platform-independent, so glyph assertions are stable on CI.
