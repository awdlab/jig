The Slider (`jig-slider`) is a form control for picking a numeric value within a
range by dragging the thumb, clicking the track, or using the keyboard. Bind the
two-way `value` and set `min`, `max`, and `step` to define the range and its
granularity. It participates in signal forms and exposes the `slider` role with
`aria-valuenow`/`-valuemin`/`-valuemax` for assistive tech — in `range` mode that
role moves to each of the two handles.

### Basic Usage

Bind `value` with `[(value)]`. Drag the thumb or click anywhere on the track to
set it; arrow keys nudge by `step`, and Home/End jump to `min`/`max`.

{{ demo: Demo_Slider_Base }}

### Validation

The slider implements the signal-forms value-control contract, so it binds
straight to a form field and works with `jigErrors`. Here any value below 50 is
flagged invalid.

{{ demo: Demo_Slider_Validation }}

### Min and Max Values

Set the range bounds with the `min` and `max` inputs; values are clamped to stay
inside them.

{{ demo: Demo_Slider_MinMax }}

### Range

Set `range` to `true` for a two-handle slider. This changes the model type: the
`value` becomes a `[start, end]` tuple instead of a single number, and the fill
spans between the handles rather than from the track origin.

`minRangeDistance` sets the smallest gap the handles may have, in value units.
Dragging or stepping a handle stops that far from the other one — the other
handle never moves. Setting it larger than `max - min` throws, since no pair of
values could satisfy it.

A `[start, end]` you bind in is sorted and clamped to `min`/`max` for display,
but `minRangeDistance` is not applied retroactively to it — the constraint
governs user interaction, so the control never silently rewrites your model.

{{ demo: Demo_Slider_Range }}

### Committing a value

`valueChange` fires continuously as the value moves — on every drag frame and
every key press. `valueCommit` fires once an interaction settles: a drag
release, a track click, or a handled key press, including when a drag clamps
against `minRangeDistance` and ends back where it started. Use it to react to
a finished pick (e.g. save or fetch) without reacting to every intermediate
frame.

### Vertical

Set `vertical` to `true` to orient the track bottom-to-top. Give the slider a
height, since the vertical track fills its container.

{{ demo: Demo_Slider_Vertical }}

### States

`disabled` and `readonly` both freeze the value (readonly still takes focus), and
`invalid` applies error styling. The demo pairs them to show each combination.

{{ demo: Demo_Slider_States }}
