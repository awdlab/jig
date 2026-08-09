Select, list box, tree, menu, command palette and the table's row actions all
take their data as arrays of plain objects. Three related shapes cover them all,
and they live in `@awdlab/jig/api`.

### `NgnItem`

The shape for anything selectable.

```ts
import type { NgnItem } from '@awdlab/jig/api';

const items: NgnItem[] = [
  { label: 'Berlin', value: 'ber' },
  { label: 'Hamburg', value: 'ham', icon: tablerBuilding },
  { label: 'Munich', value: 'muc', disabled: true },
];
```

| Field      | Type                       | Purpose                                                           |
| ---------- | -------------------------- | ----------------------------------------------------------------- |
| `label`    | `string \| (() => string)` | Display text. A function is re-read reactively — use it for i18n. |
| `value`    | `V`                        | What the control emits when the item is chosen.                   |
| `data`     | `T` (optional)             | Your original object, carried through untouched.                  |
| `icon`     | `IconType` (optional)      | Leading icon.                                                     |
| `disabled` | `boolean` (optional)       | Not selectable; skipped by keyboard navigation.                   |
| `items`    | `NgnItem[]` (optional)     | Children — groups in a list box, submenus, tree branches.         |
| `testId`   | `string` (optional)        | Stable hook for tests.                                            |

A **function label** is the idiomatic way to keep an item list translated: it is
evaluated when rendered, so a language switch updates the text without
rebuilding the array.

`data` is what keeps the contract from being lossy — put your domain object
there and read it back off the selection instead of mapping values back to
entities by hand.

### Converting your own data

Rather than mapping by hand, describe which of your fields play which role:

```ts
import { transformToNgnItem, type NgnItemFields } from '@awdlab/jig/api';

type City = { id: number; name: string; region: string; children?: City[] };

const fields: NgnItemFields<City, 'id'> = {
  label: 'name',
  value: 'id',
  children: 'children',
};

const items = transformToNgnItems(cities, fields);
```

`NgnItemFields` names the source property for `label`, `value`, and optionally
`translate`, `testId` and `children`. The result keeps the original object in
`data`, and children are converted recursively with the same field map.

| Helper                               | Purpose                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `transformToNgnItem(item, fields)`   | Convert one object.                                                     |
| `transformToNgnItems(items, fields)` | Convert an array, preserving literal types.                             |
| `transformToNgnItemPrimitive(value)` | Wrap a bare string/number as an item whose label and value are both it. |
| `mapToItems(items)`                  | Replace every group with its children — a flat list of leaves.          |
| `flatItems(items)`                   | Flatten to one level, keeping the group entries themselves.             |

### Type inference

`NgnItemValue` / `NgnItemsValue` extract the value type of an item list,
including nested children, so a control's `value` is typed to exactly what the
data can produce:

```ts
const items = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
] as const;

// value is 'a' | 'b', not string
```

Declare the array `as const`, or with a literal type, to get the narrow union.

### `NgnTreeItem`

The tree extends `NgnItem` with the things only a tree needs:

| Field        | Purpose                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------- |
| `items`      | Child nodes. A node with a non-empty array is a branch, otherwise a leaf.                   |
| `selectable` | `false` renders no checkbox and excludes the node from `value`; children stay selectable.   |
| `lazy`       | Marks a branch whose children load on first expand, via the tree's `loadChildren` callback. |
| `template`   | A per-node `TemplateRef` override, taking precedence over the tree's item template.         |

`NgnTreeItemValue` / `NgnTreeItemsValue` differ from the flat variants: a
branch's own value is part of the union, because a branch can itself be
selected or expanded.

### `NgnActionItem`

For things that **do** something rather than being chosen — menus, command
palettes, row actions.

```ts
import type { NgnActionItem } from '@awdlab/jig/api';

const actions: NgnActionItem[] = [
  { id: 'edit', label: 'Edit', icon: tablerPencil, callback: () => edit(row) },
  { id: 'new', label: 'New', shortcut: 'mod+n', callback: () => create() },
  { id: 'docs', label: 'Documentation', route: '/docs' },
];
```

| Field                        | Purpose                                                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| `id`                         | Required, stable identity.                                                              |
| `label`                      | Text, or a function for reactive/translated text.                                       |
| `callback`                   | Runs on activation.                                                                     |
| `route`                      | Router link, as an alternative to `callback`.                                           |
| `shortcut`                   | `+`-joined lowercase tokens (`mod+n`, `shift+mod+p`), rendered as a keycap where shown. |
| `children`                   | Submenu items.                                                                          |
| `icon`, `disabled`, `testId` | As on `NgnItem`.                                                                        |

`mod` maps to ⌘ on Apple platforms and Ctrl elsewhere. The **scope** of a
shortcut is the host's decision: `awd-command` registers its items page-wide,
so a palette command fires whether or not the palette is open, while other
hosts register against the nearest `[ngnKeyboardShortcut]` container.

### `NgnActionButtonConfig`

What [`<awd-action-button>`](/components/button) renders — an action item plus
the visual knobs a button needs:

| Field                | Purpose                                                      |
| -------------------- | ------------------------------------------------------------ |
| `label`, `value`     | Text, and the value emitted on click.                        |
| `action`             | Runs on click or shortcut, before `clicked` emits.           |
| `icon`/`defaultIcon` | An explicit icon, or a semantic slot from the icon registry. |
| `kind`, `color`      | Typed against the active theme.                              |
| `shortcut`           | Registered with the nearest `[ngnKeyboardShortcut]` scope.   |
| `disabled`, `testId` | As above.                                                    |

This is the shape dialog footers, snackbars and table row actions all build
their buttons from — which is why the same object works in each.

### Choosing between them

| You are describing…                         | Use                     |
| ------------------------------------------- | ----------------------- |
| something the user **picks**                | `NgnItem`               |
| a hierarchy the user picks or expands       | `NgnTreeItem`           |
| something the user **runs**                 | `NgnActionItem`         |
| a single rendered button, described by data | `NgnActionButtonConfig` |
