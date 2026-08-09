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

Type the object with `JigPassthrough<'control'>` and every valid scope autocompletes — a
typo is a compile error:

```ts
protected readonly pt: JigPassthrough<'calendar'> = {
  root: { $classes: 'rounded-xl ring-1' },
  'day-selected': { $styles: { background: 'var(--jig-color-primary-600)' } },
};
```

```html
<jig-calendar [inline]="true" [pt]="pt" />
```

### When to use passthrough

- Reach for **`pt`** for targeted, per-instance tweaks: brand a few scopes, add test hooks,
  attach a listener.
- Use a **template** (`jigTemplate`) when you need to replace the _content_ of a slot with
  your own markup.
- Extend a **custom theme** when the change should apply to every instance across your app.
- Go **`unstyled`** when you want to strip all theme styling and start from scratch.

The examples below all use an inline `jig-calendar` — a control that composes several nested
`jig` controls internally — so a single control can show every mechanic.

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

### Deep passthrough

**Deep passthrough** reaches the `jig` controls a control renders internally.
Each internal instance is exposed as a named **slot**, right at the root of `pt`
— alongside the control's own scope classes. A slot's value is typed as that
child control's own `JigPassthrough`, resolved against _its own_ scope classes,
not the parent's:

```ts
protected readonly pt: JigPassthrough<'calendar'> = {
  // Only the month picker — the year select stays plain.
  'current-month': {
    root: {
      $classes:
        'text-(--jig-color-primary-700) font-(--jig-font-weight-semibold)',
    },
  },
  // The prev / next nav buttons, each addressed by its own slot.
  previous: { root: { $styles: { color: 'var(--jig-color-primary-600)' } } },
  next: { root: { $styles: { color: 'var(--jig-color-primary-600)' } } },
};
```

Each slot targets exactly **one** instance — `current-month` and `current-year`
are separate slots, so you can brand the month select without touching the
year select. Deep passthrough is also recursive: a slot's value is a full
`JigPassthrough`, so it can carry the child's _own_ slots to reach a
grandchild. Assigning a slot also auto-applies the parent's marker class for
that slot (`{parentScope}-{slot}`, e.g. `calendar-current-month`) to the child
control's host element, so you get a stable hook even without a `pt` value.

The calendar's slots are `input`, `current-month`, `current-year`,
`current-month-field`, `current-year-field`, `previous`, `next`,
`trigger-icon`, and `popover`. Slots are only exposed for controls the parent
**renders** itself — a child control the parent receives via content
projection (`<ng-content>`) has no host element for the parent to mark, so
it's excluded from `pt` entirely.

{{ demo: Demo_Pt_Deps }}
