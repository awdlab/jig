`ngnRovingGroup` and `ngnRovingItem` implement the **roving tabindex** pattern:
a set of related widgets becomes a single tab stop, and the arrow keys move
between the members.

This is how a toolbar, tab list, radio group or menu is supposed to behave —
Tab takes you past the whole group, not through every button in it. Several
controls in this library are built on these two directives; they are exported
so you can build your own.

### Basic Usage

Put `ngnRovingGroup` on the container and `ngnRovingItem` on each member. Items
register themselves through DI and are ordered by their position in the DOM, so
nothing has to be listed twice.

{{ demo: Demo_RovingFocus_Base }}

Keys handled by the group: ←/→ (horizontal), ↑/↓ (vertical), and Home/End in
both orientations. Everything else passes through, and a key pressed with Ctrl,
Meta or Alt is ignored so browser shortcuts keep working.

### Orientation and Wrapping

`orientation` decides which arrow pair navigates — `'horizontal'` (default) or
`'vertical'`. `rovingWrap` makes navigation cycle past the ends instead of
stopping there.

```html
<div ngnRovingGroup orientation="vertical" rovingWrap>…</div>
```

### Focus Modes

`rovingMode` chooses how the active item is exposed:

| Mode                 | What happens                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `tabindex` (default) | The active item has `tabindex="0"`, the rest `-1`; DOM focus moves with the arrow keys.       |
| `activedescendant`   | Focus stays on the group; it gets `aria-activedescendant` pointing at the active item's `id`. |

Use `activedescendant` when focus must remain in a text field — a combobox
whose list is navigated while the user types — and `tabindex` everywhere else.

{{ demo: Demo_RovingFocus_Activedescendant }}

In `activedescendant` mode the group must be focusable itself (`tabindex="0"`)
and carry the container role; the directive fills in `aria-owns` and
`aria-activedescendant` and strips the items' `tabindex`. Items get a generated
`id` if they don't have one, since `aria-activedescendant` refers to them by
id.

### Programmatic Control

The group exposes its state and movement API:

| Member               | Purpose                                                           |
| -------------------- | ----------------------------------------------------------------- |
| `items()`            | registered items, in DOM order                                    |
| `activeIndex()`      | index of the active item                                          |
| `next()` / `prev()`  | move one step, honouring `rovingWrap` and skipping disabled items |
| `first()` / `last()` | jump to the first/last enabled item                               |
| `setActive(i)`       | activate by index; emits `activeItemChange`                       |
| `syncActiveIndex(i)` | move the tab stop **without** moving focus or emitting            |
| `activeItemChange`   | output emitting the new index on every change                     |

`syncActiveIndex` is the one to reach for when your own state changes the
selection — a radio group whose `value` was set from code. Using `setActive`
there would pull focus into the group, which is wrong when the user is
somewhere else on the page.

The group never steals focus on mount: the first pass only assigns the tab
stop.

### Disabled Items

`JigRovingItem.disabled` is a writable signal, not an input — the host control
sets it, which is how `jig-radio` keeps a disabled radio out of the keyboard
order. A disabled item is skipped by `next`/`prev`/`first`/`last` and ignores
pointer activation.

```ts
const item = viewChild.required(JigRovingItem);
effect(() => item().disabled.set(this.disabled()));
```

Note that a native `disabled` attribute on a `<button ngnRovingItem>` does not
feed this signal — set it explicitly.

### Items Outside the Group

An item that is not a DOM descendant of its group cannot find it by injection.
Pass the group in instead:

```html
<div ngnRovingGroup #group="ngnRovingGroup"></div>
<button [ngnRovingItem]="group">Detached</button>
```

Without either a wrapping group or an explicit reference the item throws.
