The Attribute Filter (`jig-attribute-filter`) is a small query builder for data
that is not a table. Each condition row picks its own attribute, then an
operator, then a value — "e-mail contains @gmail.com", "role is Admin" — and
the conditions are joined by one match mode, `all` or `any`, flipped by the
clickable pill between rows.

It is the sibling of `jig-filter`, which filters a single fixed attribute (a
table column). Reach for the attribute filter when one control has to filter on
several attributes of the same item, for example a list of users showing a name,
an e-mail and an id.

Describe what can be filtered with `attributes`, an array of
`{ key, label, dataType, listOptions?, selector? }`. The `key` names the property
to read from each item (or from `item.data` for a `JigItem`) and is checked
against that type, so a mistyped key is a compile error rather than a condition
that silently matches nothing. An attribute that is computed rather than read
from a property supplies a `selector` instead, and may then use any `key` as its
identifier. `dataType` (`string`, `number`, `date`, `dateTime`,
`boolean`, `list` or `custom`) drives the operators and the value editor of that
attribute's row. With `filterLocally` on (the default) it filters `data` and
emits the result via `filterResultChange`; otherwise it emits only the
serializable config via `filterChange`, ready to send to a server.

### Base

In the default `input` mode the control renders an input-like trigger that
opens the editor in a popover; the trigger summarises the active conditions.
Without `allowMultiple` there is a single condition.

{{ demo: Demo_AttributeFilter_Base }}

### Inline

`mode="inline"` renders the condition rows directly on the page instead of
behind a popover trigger.

{{ demo: Demo_AttributeFilter_Inline }}

### Headless

`mode="headless"` renders only the popover, opened programmatically via `show()`
and positioned against the element passed to `anchor` — here the "Filter users"
button.

{{ demo: Demo_AttributeFilter_Headless }}

### DataTypes

Each attribute's `dataType` gives its row the matching operators and editor:
`string`, `number`, `list` (multi-select, options derived from the data unless
`listOptions` is set), `date`, `dateTime` and `boolean`. A `custom` attribute is
a single free-form condition; here its `selector` searches several fields at
once.

{{ demo: Demo_AttributeFilter_DataTypes }}

### Multiple conditions

`allowMultiple` lets the user add several conditions, each on any attribute, and
flip the match mode between all and any. Try "role is Admin" combined with
"e-mail contains gmail" in both modes.

{{ demo: Demo_AttributeFilter_Multiple }}

### Manual Apply / Cancel

When `autoApply` is `false`, changes are not applied until the user clicks
"Apply". The "Cancel" button restores the previous filter state.

{{ demo: Demo_AttributeFilter_ApplyMode }}
