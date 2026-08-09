The Radio group lets the user pick a single option from a set. Compose `jig-radio`
options inside an `jig-radio-group`; the group (`role="radiogroup"`) owns the
selected value via a two-way `value`, while each `jig-radio` contributes its
payload and renders the themed dot.

Reach for it when all options should stay visible; for many options or to save
space, use a **select** dropdown instead.

### Basic Usage

Wrap `jig-radio` options in an `jig-radio-group` and bind `value` with
`[(value)]`. Selection follows focus — arrow keys move between options and select
as they go — and the group is a single tab stop that lands on the checked option.

{{ demo: Demo_Radio_Base }}

### Validation

The group is a signal-forms value control, so it binds to a form field and works
with `ngnErrors`. Here leaving it unselected raises a required error.

{{ demo: Demo_Radio_Validation }}

### Orientation

The group is horizontal by default; set `orientation` to `vertical` to stack the
options in a column. Arrow-key navigation follows the orientation.

{{ demo: Demo_Radio_Orientation }}

### Disabled Options

A disabled `jig-radio` is skipped during keyboard navigation and can't be
selected, while the rest of the group stays interactive.

{{ demo: Demo_Radio_States }}
