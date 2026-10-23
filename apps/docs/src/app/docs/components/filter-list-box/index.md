The Filter List Box (`jig-filter-list-box`) is a list box that ships its own
search field. Give it `attributes` as well and it grows a filter trigger with a
badge count, a row of removable condition chips, and an embedded attribute
filter. Leave `attributes` out and it is simply search plus list.

Conditions narrow the items first and the search text narrows what is left, so
"e-mail contains @gmail.com" followed by typing a name composes as users expect.
Selection (`selectable`, `multiple`, `[(value)]`) works as in the list box. On
top of it the control adds:

- `[(searchText)]` — the search text, written `searchDebounce` milliseconds
  after typing stops.
- `attributes` — what the filter popover can build conditions on. Keys are
  checked against the items' `data` payload, not against `JigItem` itself, so
  `JigFilterAttribute` takes both: `JigFilterAttribute<Item, Person>`.
- `allowMultiple` — defaults to `true` here, unlike the standalone attribute
  filter, because the chips make a set of conditions easy to read at a glance.
- `filterLocally` and `filterChange` — for server-side filtering.

### Base

Without `attributes` the control is a searchable list. The search text is a
two-way model; here it is echoed below the list.

{{ demo: Demo_FilterListBox_Base }}

### Attributes

With `attributes` a filter button appears next to the search field, badged with
the number of active conditions. Each condition also shows as a chip above the
list; removing a chip removes the condition.

{{ demo: Demo_FilterListBox_Attributes }}

### Server-side filtering

Set `filterLocally` to `false` to leave the list untouched and filter on your
server instead. `filterChange` emits the serializable configuration (`null` once
no condition is left) while the chips and badge keep working.

{{ demo: Demo_FilterListBox_ServerSide }}

### Grouped items

Conditions apply to the entries of grouped items, and a group disappears once
none of its entries match.

{{ demo: Demo_FilterListBox_Grouped }}

### Empty state

When nothing matches, the list shows the built-in empty state with a "Clear all
filters" action that resets the search text and every condition. This demo
starts with a search that matches no one. Project your own `#empty` template to
replace the empty state, action included.

{{ demo: Demo_FilterListBox_EmptyState }}
