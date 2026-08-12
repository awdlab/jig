The Input Mask (`<jig-mask-input>`) is a self-contained value control for
formatted entry — dates, times, and custom patterns. Pass a `mask` (a
`DATE_TIME_MASKS` preset or a custom config) and bind `[(value)]`; the value
stays `null` until every section is filled, then becomes the fully composed
string. Pair it with `jig-input-field` for field chrome.

### Basic Usage

Rather than a free-text field, the value is split into highlighted **sections**,
behaving like the native browser date field for any configured pattern. Click a
section to select it, type to fill it (focus auto-advances once a section can
hold no more), use **←/→** to move between sections, **↑/↓** to step a section's
value, and **Backspace** to clear the active section. This demo uses the
`HH:mm:ss` time preset.

{{ demo: Demo_MaskInput_Base }}

### States

`readonly`, `disabled`, and `invalid` behave like on any other form control, and
a surrounding `jig-input-field` mirrors them for its chrome. A readonly mask is
a single tab stop with no selectable sections — it takes focus, but no section
highlights and typing, stepping, and clearing are rejected; a disabled one takes
no focus at all. Set `invalid` explicitly when
your validity comes from outside Angular forms — `invalidOn` controls when the
styling shows. States compose.

{{ demo: Demo_MaskInput_States }}

### Validation

The mask input validates like any value control. Here a `required` error
persists until a complete `HH:mm:ss` time has been entered.

{{ demo: Demo_MaskInput_Validation }}

### Time (12h with AM/PM)

The `time12` preset (`hh:mm:ss a`) adds a trailing AM/PM section, stepped with
**↑/↓** like any other.

{{ demo: Demo_MaskInput_Time12 }}

### Date

The `date` preset formats as `MM/dd/yyyy`, with month, day, and year each as
their own section.

{{ demo: Demo_MaskInput_Date }}
