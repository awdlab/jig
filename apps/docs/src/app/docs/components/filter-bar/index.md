The Filter Bar (`jig-filter-bar`) is the header strip above a display: a search
field and, given `properties`, a filter trigger whose conditions appear as
removable chips. What sits underneath is yours — a list box, a tree, cards of
your own.

It is the composite of the other two filter controls. `jig-filter-field`
configures conditions for one known field; `jig-filter-builder` lets each
condition pick its own property; the bar wraps the builder in a trigger and adds
free-text search.

With `filterLocally` on (the default) it narrows `data` — conditions first, then
the search text — and emits the result through `filterResultChange`. Turn it off
and it emits only `searchText` and the serializable configuration, so a server
can do the work. Text matches every declared property unless you supply a
`searchSelector`.

{{ demo: Demo_FilterBar_Base }}

### Properties

Pass `properties` and the filter trigger appears, badged with the number of
active conditions. Each condition also shows as a chip; removing a chip removes
the condition. Keys are checked against the item type, so a mistyped key is a
compile error rather than a condition that silently matches nothing.

{{ demo: Demo_FilterBar_Properties }}

### Filtering a list box or tree

`jig-list-box` and `jig-tree` take the same `items`, `filter` and `filterText`
inputs, so one recipe covers both. Leave the text matching to them — they know
about groups and item labels — and apply the conditions yourself with
`executePropertyFilter`:

```ts
narrowed = computed(() => {
  const config = this.config();
  return config ? executePropertyFilter(items, config, this.properties, 'items') : items;
});
```

```html
<jig-filter-bar
  [data]="items"
  [properties]="properties"
  [filterLocally]="false"
  [(searchText)]="search"
  (filterChange)="config.set($event)"
/>
<jig-list-box [items]="narrowed()" [filter]="true" [filterText]="search()" />
```

Two things worth passing on as well: give the display `[selectable]="!disabled()"`
or the equivalent, since the bar only disables itself; and for an empty state,
the bar exposes `filtersActive` and `clear()` so your own "no results" message
can offer to clear everything.

{{ demo: Demo_FilterBar_WithListBox }}

### A filter of your own

`templateFilter` is forwarded straight to the embedded builder, so the popover
behind the trigger can be entirely yours. See the filter builder's page for the
context it hands your template.
