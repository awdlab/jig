Two different things are called filtering, and they do not overlap.

| Kind                   | Question it answers                             | Where it appears                        |
| ---------------------- | ----------------------------------------------- | --------------------------------------- |
| **Text search**        | "which items match what I typed?"               | select, list box, tree, command palette |
| **Structured filters** | "which rows satisfy these operator conditions?" | the filter control, table columns       |

Both live in `@ngneers/controls/api`, and both are exported so you can run them
over your own data.

## Text search

Controls with a search box take a `FilterConfig` (or just `true` to accept the
defaults):

```ts
type FilterConfig<T> = {
  splitWords?: boolean; // treat the query as several words, all of which must match
  caseSensitive?: boolean; // default: case-insensitive
  filterFn?: FilterFn<T>; // matcher, see below
};
```

```html
<ngn-select [items]="items" [filter]="{ filterFn: 'fuzzy', splitWords: true }" />
```

`filterFn` is either the name of a built-in matcher or your own predicate:

| Value          | Matches when the item text…                         |
| -------------- | --------------------------------------------------- |
| `'contains'`   | contains the query (default)                        |
| `'startsWith'` | starts with it                                      |
| `'endsWith'`   | ends with it                                        |
| `'equals'`     | equals it                                           |
| `'fuzzy'`      | contains the query's characters in order, with gaps |

```ts
filterFn: (query, item) => item.tags.some(t => t.startsWith(query));
```

A custom predicate may return a `Promise<boolean>`, so an asynchronous lookup
works without a different API.

**Nested items are searched too.** A group or branch whose own text does not
match is kept when any of its children match, and the returned copy contains
only those children — so a filtered tree stays a valid tree.

**`splitWords`** splits the query on whitespace and requires **every** word to
match, in any order, within the **same** field — not spread across several
fields.

Run it yourself with `filterOptions`:

```ts
import { filterOptions } from '@ngneers/controls/api';

const visible = await filterOptions(items, query, {
  filterFieldsCallback: item => [item.label, item.data.city],
  fieldItems: 'items',
  filterFn: 'fuzzy',
});
```

`filterFieldsCallback` decides which text is searched (a string, an array of
strings, or a function returning either) and `fieldItems` names the child
array.

## Structured filters

The [Filter](/components/filter) control and each filterable table column
produce an `NgnFilterConfig` — a **serializable** description of the conditions,
with no data in it. That is deliberate: the same object can be evaluated
locally or sent to a server.

```ts
type NgnFilterConfig = {
  dataType: 'string' | 'number' | 'date' | 'dateTime' | 'boolean' | 'custom' | 'list';
  matchMode: 'all' | 'any';
  conditions: readonly { operator: NgnFilterOperatorId; rawValue: string | null }[];
};
```

Which operators the UI offers depends on the `dataType`:

| Data type          | Default operators                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `string`           | `isEqual`, `isNotEqual`, `contains`, `startsWith`, `endsWith`, `isEmpty`, `isNotEmpty`      |
| `number`           | `isEqual`, `isNotEqual`, `greaterThan`, `greaterThanOrEqual`, `lessThan`, `lessThanOrEqual` |
| `date`, `dateTime` | the same comparisons, labelled as before / on-or-before / after / on-or-after               |
| `boolean`          | `isTrue`, `isFalse`                                                                         |
| `list`             | `in`                                                                                        |
| `custom`           | `custom` — you evaluate it                                                                  |

`isEmpty`, `isNotEmpty`, `isTrue` and `isFalse` need no value; the rest do.

`rawValue` is the raw user input as a string; `parseFilterRawValue(raw, dataType)`
turns it into a typed value.

### Evaluating locally

```ts
import { executeFilter, executeMultiFilter } from '@ngneers/controls/api';

// one filter over one field — the selector picks the value to test
const rows = executeFilter(allRows, config, row => row.city);

// several column filters, keyed by property name
const rows = executeMultiFilter(allRows, {
  city: cityConfig,
  createdAt: createdAtConfig,
});
```

`executeFilter` combines a config's own conditions with its `matchMode`.
`executeMultiFilter` reads each key straight off the item, forces `matchMode:
'all'` within a column, and ANDs the columns together — the same semantics the
table applies.

`getActiveFilterConditions(config)` returns only the conditions that are
actually usable — a condition with an empty value is skipped, except for the
operators where emptiness is the point (`isEmpty`, `isTrue`, …).

### Sending it to a server

Because the config is plain, serializable data, a lazy table hands it straight
to your loader:

```ts
protected readonly load = async (req: TableLoadRequest) => {
  const res = await fetch(`/api/rows?${new URLSearchParams({
    filters: JSON.stringify(req.filters),
    sort: JSON.stringify(req.sort),
  })}`);
  return res.json();
};
```

Translate the operator ids into your query language on the server; do not try
to reconstruct them from display text.

### Related

- [Filter](/components/filter) — the control that builds a config
- [Table](/components/table) — per-column filters and lazy loading
- [Items & Data](/guides/items-data) — the item shapes text search runs over
