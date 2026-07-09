Passthrough (`pt`) lets you reach into a control's internal structure and apply
styles, attributes, classes or event listeners to any of its named scopes — without
`::ng-deep`, global CSS, specificity wars, or forking the theme. Every scope is fully
typed, so your editor autocompletes the available targets.

Each control renders its markup as a set of **theme scope classes** — `root`, `header`,
`day`, `day-selected`, and so on. The `pt` input is an object keyed by those scope names.
For each scope you provide a value with any of four keys:

```ts
type PassthroughValue = {
  $styles?: Partial<CSSStyleDeclaration>; // inline styles
  $attributes?: Record<string, string>; // static attributes
  $classes?: string | string[]; // added to classList
  $listeners?: Partial<EventListenerMap>; // addEventListener handlers
};
```

Passthrough is applied **reactively**. When the `pt` object changes, the previous values
are removed (styles reset, attributes/classes/listeners detached) before the new ones are
applied — so bindings stay in sync with your component state. Because tracking is by object
identity, assign a **new** `pt` object when it changes rather than mutating in place.

### Typed targets

Type the object with `NgnPassthrough<'control'>` and every valid scope autocompletes — a
typo is a compile error:

```ts
protected readonly pt: NgnPassthrough<'calendar'> = {
  root: { $classes: 'rounded-xl ring-1' },
  'day-selected': { $styles: { background: 'var(--ngn-color-primary-600)' } },
};
```

```html
<ngn-calendar [inline]="true" [pt]="pt" />
```

### When to use passthrough

- Reach for **`pt`** for targeted, per-instance tweaks: brand a few scopes, add test hooks,
  attach a listener.
- Use a **template** (`ngnTemplate`) when you need to replace the _content_ of a slot with
  your own markup.
- Extend a **custom theme** when the change should apply to every instance across your app.
- Go **`unstyled`** when you want to strip all theme styling and start from scratch.

The examples below all use an inline `ngn-calendar` — a control that composes several nested
`ngn` controls internally — so a single control can show every mechanic.

### Styles

Push inline styles into any scope. Here a booking UI brands the selected day as a primary
pill and enlarges the day cells for touch.

{{ demo: Demo_Pt_Styles }}

### Attributes

Add static attributes to internal elements — `data-testid` for end-to-end selectors,
`data-*` / `aria-*` markers for analytics and assistive tech.

{{ demo: Demo_Pt_Attributes }}

### Classes

Apply your own classes (Tailwind utilities or otherwise) to internal scopes. The theme keeps
its own classes; yours are added alongside.

{{ demo: Demo_Pt_Classes }}

### Listeners

Attach event listeners to internal elements without wrapping the component — useful for
analytics or telemetry. Handlers are registered with `addEventListener` and removed when the
`pt` object changes, so keep handler references **stable** (a class field, not an inline
arrow) to guarantee clean removal.

{{ demo: Demo_Pt_Listeners }}

### Reaching nested controls

Controls often compose other `ngn` controls internally. The calendar renders its prev/next
navigation as `ngn-button`s and its month/year pickers as `ngn-select`s wrapped in
`ngn-input-field`. Rather than exposing a separate nesting API, the calendar **flattens** the
key elements of those nested controls onto its own scope classes — so you reach them by name:
`previous` / `next` for the nav buttons, `current-month` / `current-year` for the select
triggers.

{{ demo: Demo_Pt_Nested }}
