The Tooltip is an attribute directive (`ngnTooltip`) you place on any element to
attach a small, transient overlay that appears on hover or focus. The content is
passed through the directive (`[ngnTooltip]="..."`) as a plain string or a
`TemplateRef`; a falsy value shows nothing. The overlay is created lazily on
first show and positioned with floating-ui, so it flips and shifts to stay on
screen.

For short, supplementary hints only. When you need focusable content, actions,
or a persistent panel, use a **popover** instead.

### Basic Usage

Bind the hint text to `[ngnTooltip]` on the anchor element; the overlay opens on
hover or focus and needs no further wiring.

{{ demo: Demo_Tooltip_Base }}

### Placement Options

`ngnTooltipPlacement` controls the side the tooltip prefers (default `bottom`);
auto-positioning still overrides it when there isn't room. `ngnTooltipOffset`
sets the gap from the anchor (default `4`px), and `ngnTooltipSize` constrains the
tooltip's width/height when the content would otherwise grow too large.

Show/hide timing is tunable via `ngnTooltipShowDelay` (default `0.5s`) and
`ngnTooltipHideDelay` (default `0.1s`), which accept a `TimeSpan` or a number of
milliseconds. Whether it opens on hover and/or focus is controlled by
`ngnTooltipShowOnHover` and `ngnTooltipShowOnFocus` (both on by default).

{{ demo: Demo_Tooltip_Placement }}

### Show Only If Truncated

Set `ngnTooltipShowOnlyIfTruncated` to only reveal the tooltip when the anchor's
text is actually clipped (ellipsis or line-clamp). This is the idiomatic way to
surface the full text of a truncated cell or label without cluttering rows that
already fit.

{{ demo: Demo_Tooltip_ShowOnlyIfTruncated }}

### Arrow Options

`ngnTooltipShowArrow` (on by default) toggles the little pointer connecting the
tooltip to its anchor.

{{ demo: Demo_Tooltip_Arrow }}

### Accessibility

Tooltips are not focusable, close on `Escape`, and hide on click by default, and
must never hold interactive content or information the user can't get elsewhere.
By default the directive wires ARIA automatically (`autoAriaMode: 'description'`),
describing the anchor via `aria-description` / `aria-describedby`; switch to
`'label'` to name the element instead, or `'none'` to manage ARIA yourself.
