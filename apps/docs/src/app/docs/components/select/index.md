The Select is a dropdown/listbox control for choosing from a list of options. It
supports single and multiple selection, an editable free-text mode, optional
filtering, grouped options, custom option templates, and virtual scrolling for
long lists. Wrap `jig-select` in a `jig-input-field` for field chrome (label,
border, states).

### Basic Usage

Options come from the `options` input, either as `JigItem` objects
(`{ label, value }`) or as plain objects mapped to items. The value type follows
the mode: single selection stores the chosen item's `value`, `multiple` stores an
array of values, and `editable` stores a string. Bind it with `[(value)]`.

{{ demo: Demo_Select_Base }}

### Placeholder

Set `placeholder` to show hint text in the trigger while no value is selected.
It is replaced by the selected item's label once a value is chosen.

{{ demo: Demo_Select_Placeholder }}

### Forms integration

`jig-select` is a form value control: it exposes a two-way `[(value)]` model,
participates in signal forms, and reflects `disabled`, `readonly`, `invalid`,
and `touched`. The next demo shows it inside a validated form.

{{ demo: Demo_Select_Validation }}

### Filtering

Set `filter` to `true` to add a search box to the dropdown, or pass
`SelectFilterOptions` to customise matching (and `clearFilterOnClose`). Use the
`filterText` input if you want to drive the query yourself. Provide `iconFilter`
to customise the search icon.

{{ demo: Demo_Select_Filter }}

### Grouped Options

When the options contain groups, headers are rendered for each group. Customise
their appearance with a `#group` template.

{{ demo: Demo_Select_Grouped }}

### Multiple Selection

Set `multiple` to let the user pick several options; the value becomes an array.
A checkbox indicator is shown per option by default in this mode (`checkbox`
defaults to `multiple`), and the selected set can be rendered with a
`#selectedItems` template.

{{ demo: Demo_Select_Multiple }}

### Custom Templates

Every visual part is overridable via projected templates (or the matching
`template*` inputs): `#item` for options in the list, `#selectedItem` /
`#selectedItems` for the collapsed field display, `#group` for group headers,
and `#noItems` for the empty state.

{{ demo: Demo_Select_Templates }}

### Editable Select

Set `editable` to let users type a value that isn't in the list — the control's
value becomes the typed string (or a selected option's label). Editable mode
cannot be combined with `multiple` or with `filter`; the control throws if you
do. By default (`editableAutoFilter`) typing narrows the visible options; set it
to `false` to disable that.

{{ demo: Demo_Select_Editable }}

### Custom Editable

Project your own `jigInput` as the editable field to fully control its markup;
the select wires up its value and the listbox ARIA attributes (`aria-autocomplete`,
`aria-expanded`, `aria-controls`, `aria-haspopup`) automatically.

{{ demo: Demo_Select_EditableCustom }}

### Disabled Items

Individual options can be disabled via the `disabled` property on `JigItem`.
Disabled items are skipped during keyboard navigation and cannot be selected.

{{ demo: Demo_Select_DisabledItems }}

### States

`disabled`, `readonly`, and `invalid` propagate to the field and its dropdown;
the demo shows each on its own and combined.

{{ demo: Demo_Select_States }}

### Keyboard & long lists

The field takes a single tab stop. Enter opens and closes the dropdown, and
while it's open the arrow keys move the highlight through the options (delegated
to the underlying listbox); the current selection is scrolled into view on open.
For large option sets, set `virtual` with an `itemHeight` so only the visible
options are rendered.
