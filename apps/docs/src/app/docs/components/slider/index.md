The Slider (`awd-slider`) is a form control for picking a numeric value within a
range by dragging the thumb, clicking the track, or using the keyboard. Bind the
two-way `value` and set `min`, `max`, and `step` to define the range and its
granularity. It participates in signal forms and exposes the `slider` role with
`aria-valuenow`/`-valuemin`/`-valuemax` for assistive tech.

### Basic Usage

Bind `value` with `[(value)]`. Drag the thumb or click anywhere on the track to
set it; arrow keys nudge by `step`, and Home/End jump to `min`/`max`.

{{ demo: Demo_Slider_Base }}

### Validation

The slider implements the signal-forms value-control contract, so it binds
straight to a form field and works with `ngnErrors`. Here any value below 50 is
flagged invalid.

{{ demo: Demo_Slider_Validation }}

### Min and Max Values

Set the range bounds with the `min` and `max` inputs; values are clamped to stay
inside them.

{{ demo: Demo_Slider_MinMax }}

### Vertical

Set `vertical` to `true` to orient the track bottom-to-top. Give the slider a
height, since the vertical track fills its container.

{{ demo: Demo_Slider_Vertical }}

### States

`disabled` and `readonly` both freeze the value (readonly still takes focus), and
`invalid` applies error styling. The demo pairs them to show each combination.

{{ demo: Demo_Slider_States }}
