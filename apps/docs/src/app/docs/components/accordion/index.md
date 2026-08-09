A stack of `<awd-accordion-panel>` children inside an `<awd-accordion>`, each
with a clickable header that expands or collapses its own content region. Use it
to group long or optional content into collapsible sections that keep a page
scannable, and bind the two-way `expandedPanels` model when you need to control
or observe which panels are open.

### Basic Usage

By default the accordion is single-expand: opening one panel collapses the
others. Each header is a button carrying `aria-expanded`/`aria-controls`, and its
content region is a `role="region"` labelled by that header, so screen readers
announce state and can jump to the revealed content. A panel's id comes from its
`panelId` input (auto-generated if omitted).

{{ demo: Demo_Accordion_Base }}

### Multiple

Set `multiple` to allow any number of panels to be open at once; expanding a
panel then leaves the others untouched.

{{ demo: Demo_Accordion_Multiple }}

### Lazy

Set `lazy` on the accordion to defer each panel's content until it is first
expanded, and `cache` to keep that content in the DOM after the panel closes.
Both act as defaults that an individual `<awd-accordion-panel>` can override with
its own `lazy` / `cache` inputs.

{{ demo: Demo_Accordion_Lazy }}

### Disabled

A `disabled` panel cannot be toggled by the user, but disabling it does not close
it — a panel that is already expanded (or is expanded programmatically via
`expandedPanels`) stays open.

{{ demo: Demo_Accordion_Disabled }}
