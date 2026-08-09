The Filter (`jig-filter`) pairs an operator select with a value editor so users
can build filter conditions over a dataset. The `dataType` input (`string`,
`number`, `date`, `dateTime`, `boolean`, `list`, or `custom`) drives which
operators and editor UI appear. With `filterLocally` on (the default) it filters
`data` and emits the result via `filterResultChange`; otherwise it emits only
the `AwdFilterConfig` via `filterChange` for server-side filtering.

### Base

In the default `input` mode the control renders an input-like trigger that opens
the filter editor in a popover; the trigger summary reflects the active
condition.

{{ demo: Demo_Filter_Base }}

### Validation

The filter plugs into the shared `ngnErrors` + `jig-hint` validation flow like
any other control — here a custom error requires at least one filter rule.

{{ demo: Demo_Filter_Validation }}

### Inline

`mode="inline"` renders the condition rows directly on the page instead of
behind a popover trigger.

{{ demo: Demo_Filter_Inline }}

### Headless

`mode="headless"` renders only the popover, opened programmatically via `show()`
and positioned against the element passed to `anchor` — here the "Open filter"
button.

{{ demo: Demo_Filter_Headless }}

### DataTypes

Each `dataType` exposes its own operators and editor UI: `list` (multi-select),
`string`, `number`, `date`, `dateTime`, and `boolean`.

{{ demo: Demo_Filter_DataTypes }}

### Custom

`dataType="custom"` offers a single free-form condition. Combined with
`filterLocally="false"`, the component emits only the config and you run
`executeFilter` yourself against a chosen field.

{{ demo: Demo_Filter_Custom }}

### Multiple conditions

`allowMultiple` lets the user add several conditions and pick a match mode —
whether a row must satisfy all conditions or any of them.

{{ demo: Demo_Filter_Multiple }}

### Manual Apply / Cancel

When `autoApply` is `false`, changes are not applied until the user clicks "Apply". The "Cancel" button restores the previous filter state.

{{ demo: Demo_Filter_ApplyMode }}
