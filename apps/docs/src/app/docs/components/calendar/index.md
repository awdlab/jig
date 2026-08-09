The Calendar is a single-date picker with an optional time input. Its value is a
`Date | null` two-way `[(value)]` model — it selects one date (plus time when
enabled), not a range. Wrap `jig-calendar` in a `jig-input-field` for popup
usage, where the field shows a masked text input and the calendar opens on
focus/click, or set `inline` to render it unwrapped as an always-visible static
calendar.

### Basic Usage

Two-way bind `[(value)]`. `firstDayOfWeek` (default `monday`) sets which weekday
the grid starts on. Month and year are chosen from dropdowns in the header, or
by paging month-by-month.

{{ demo: Demo_Calendar_Base }}

### Typing & formatting

The field is a masked input driven by `format` (default `MM/dd/yyyy`). You can
type a date directly: the value is committed only once the mask is complete and
parses to a real date, so half-typed entries never move the calendar. Parsing is
month-length aware — an out-of-range day is clamped to the month rather than
rolling into the next one (e.g. Feb 31 becomes Feb 28/29), and the field is
rewritten to the canonical form. Month names shown in the header dropdown come
from the active `I18n` translations, so the calendar localises with the rest of
the app.

### Validation

The calendar is a form value control, so it participates in signal forms and
reflects `invalid` (setting `aria-invalid`) alongside `disabled` and `readonly`.

{{ demo: Demo_Calendar_Validation }}

### States

Each field pairs `jig-calendar` with `jig-input-field` to show the `readonly`,
`disabled`, and `invalid` flags — on their own and in combination.

{{ demo: Demo_Calendar_States }}

### Inline Usage

Set `inline` to render the calendar directly in the page with no field or popup.
The imperative `show()` / `hide()` methods only apply to popup mode and throw if
called while `inline`.

{{ demo: Demo_Calendar_Inline }}

### Time

Set `showTime` to add a time input to the calendar, and `showSeconds` to include
seconds. The time merges into the same `Date` value.

{{ demo: Demo_Calendar_Time }}

### Inline Time

Combining `inline` and `showTime` renders the static calendar together with its
time input, with no field or popup involved.

{{ demo: Demo_Calendar_InlineTime }}
