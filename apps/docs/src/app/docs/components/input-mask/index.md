The Input Mask component provides formatted input fields with predefined patterns
for data entry like phone numbers, dates, and custom formats.
Use it together with `ngn-input-field` for field chrome.

It behaves like the native browser date field, but for any configured pattern: the
value is split into highlighted **sections** rather than a free-text field with a
cursor. Click a section to select it, type to fill it (focus auto-advances to the
next section when a section can hold no more), use **←/→** to move between sections,
**↑/↓** to step a section's value, and **Backspace** to clear the active section.

It is a self-contained value control — bind `[value]`/`(valueChange)` (or
`[(value)]`) directly on `<ngn-input-mask>`; no nested `<input>` is required. The
emitted value is `null` until every section is complete, then the fully composed
string.

### Basic Usage

{{ demo: Demo_InputMask_Base }}

### Time (12h with AM/PM)

{{ demo: Demo_InputMask_Time12 }}

### Date

{{ demo: Demo_InputMask_Date }}
