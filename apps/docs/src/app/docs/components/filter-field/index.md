The Filter (`jig-filter-field`) pairs an operator select with a value editor so users
can build filter conditions over a dataset. The `dataType` input (`string`,
`number`, `date`, `dateTime`, `boolean`, `list`, or `custom`) drives which
operators and editor UI appear. With `filterLocally` on (the default) it filters
`data` and emits the result via `filterResultChange`; otherwise it emits only
the `JigFilterConfig` via `filterChange` for server-side filtering.

`date` compares whole calendar days in the user's local time zone, so a time of
day on the data is ignored; `dateTime` compares the exact instant.

### Base

In the default `input` mode the control renders an input-like trigger that opens
the filter editor in a popover; the trigger summary reflects the active
condition.

{{ demo: Demo_FilterField_Base }}

### Validation

The filter plugs into the shared `jigErrors` + `jig-hint` validation flow like
any other control — here a custom error requires at least one filter rule.

{{ demo: Demo_FilterField_Validation }}

### Inline

`mode="inline"` renders the condition rows directly on the page instead of
behind a popover trigger.

{{ demo: Demo_FilterField_Inline }}

### Headless

`mode="headless"` renders only the popover, opened programmatically via `show()`
and positioned against the element passed to `anchor` — here the "Open filter"
button.

{{ demo: Demo_FilterField_Headless }}

### DataTypes

Each `dataType` exposes its own operators and editor UI: `list` (multi-select),
`string`, `number`, `date`, `dateTime`, and `boolean`.

{{ demo: Demo_FilterField_DataTypes }}

### Operators

`operators` restricts and orders the operators offered for the current
`dataType`; ids the datatype does not support are ignored. `defaultOperator`
picks the one a new condition starts with — here `startsWith` instead of the
usual `isEqual`.

{{ demo: Demo_FilterField_Operators }}

### Custom

`dataType="custom"` offers a single free-form condition. Combined with
`filterLocally="false"`, the component emits only the config and you run
`executeFilter` yourself against a chosen field.

{{ demo: Demo_FilterField_Custom }}

### Multiple conditions

`allowMultiple` lets the user add several conditions and pick a match mode —
whether a row must satisfy all conditions or any of them.

{{ demo: Demo_FilterField_Multiple }}

### Manual Apply / Cancel

When `autoApply` is `false`, changes are not applied until the user clicks "Apply". The "Cancel" button restores the previous filter state.

{{ demo: Demo_FilterField_ApplyMode }}

### A filter of your own

Pass `templateFilter` — or project an `<ng-template #filter>` — and your editor
replaces the condition rows. The trigger, the summary and the footer stay, so
`autoApply` keeps its Apply and Cancel without you reimplementing them.

Your template writes an ordinary configuration back through `setValue`, which is
what keeps everything downstream working: the same matcher filters, the same
config serializes for a server. A slider that means "at least 30" writes one
`greaterThanOrEqual` condition; nothing else needs to know a slider was involved.

The context carries the configuration as `$implicit`, plus `data`, `dataType`,
`disabled`, `readonly`, and `setValue` / `apply` / `cancel` / `clear` / `close`
so you can drive the popover yourself if you render your own footer.

{{ demo: Demo_FilterField_CustomTemplate }}
