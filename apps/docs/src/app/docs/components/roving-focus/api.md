## AwdRovingGroup

Selector: `[ngnRovingGroup]` · `exportAs: ngnRovingGroup`

{{ api: roving-focus/roving-focus AwdRovingGroup }}

| Method                    | Description                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `next()` / `prev()`       | Move one step, honouring `rovingWrap` and skipping disabled items.                  |
| `first()` / `last()`      | Jump to the first / last enabled item.                                              |
| `setActive(index)`        | Activate by index (ignored when out of range); emits `activeItemChange`.            |
| `syncActiveIndex(index)`  | Move the tab stop without moving DOM focus and without emitting `activeItemChange`. |
| `activate(item)`          | Activate a registered item reference; ignored when the item is disabled.            |
| `register` / `unregister` | Called by `ngnRovingItem` itself — only needed for a custom item implementation.    |

## AwdRovingItem

Selector: `[ngnRovingItem]` · `exportAs: ngnRovingItem`

{{ api: roving-focus/roving-focus AwdRovingItem }}

The `disabled` property is a writable `signal<boolean>` (not an input) — call
`.set(true)` on it from the host control. `isActive()` is a computed signal you
can bind to for styling.

## RovingItemRef

The shape the group stores for each item. Implement it to register something
that is not an `ngnRovingItem`.

| Field      | Type                         | Description                                                  |
| ---------- | ---------------------------- | ------------------------------------------------------------ |
| `id`       | `string`                     | Element id, used by `aria-activedescendant`.                 |
| `element`  | `HTMLElement`                | The item's DOM element; also defines its order in the group. |
| `disabled` | `Signal<boolean>` (optional) | Reactive disabled flag; absent counts as enabled.            |

## ROVING_GROUP

`InjectionToken<AwdRovingGroup>` that `ngnRovingGroup` provides. Inject it to
reach the enclosing group from a custom item.
