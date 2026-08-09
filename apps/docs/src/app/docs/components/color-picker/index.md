The Color Picker (`jig-color-picker`) is a form control for choosing a color
via a saturation/value area, a hue track, and an optional alpha track. Bind
`value` to a CSS color string (hex, `rgb()`/`rgba()`, or `hsl()`/`hsla()`) and
toggle the displayed format by clicking the format label next to the text
field. By default the panel opens from a swatch-preview trigger button; set
`inline` to render it directly in the page instead.

### Basic Usage

{{ demo: Demo_ColorPicker_Base }}

### Inline

Set `inline` to render the panel without a popover trigger.

{{ demo: Demo_ColorPicker_Inline }}

### Swatches

Provide `swatches` for a row of one-click preset colors.

{{ demo: Demo_ColorPicker_Swatches }}
