{{ api: calendar/calendar JigCalendar }}

### Deep passthrough

The calendar renders several `jig` controls internally, each exposed via
**deep passthrough** as a named, per-instance slot at the root of `pt`:
`input`, `current-month`, `current-year`, `current-month-field`,
`current-year-field`, `previous`, `next`, `trigger-icon`, and `popover`. Each
slot is typed as that child control's own passthrough, resolved against its own
scope classes — see the [Passthrough](/guides/passthrough) guide's "Deep
passthrough" section.
