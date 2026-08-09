Display content in a tabbed interface. A `<awd-tabs>` wraps a set of
`<awd-tab>` children, each identified by a required `tabId` and carrying two
projected templates: `#header` for its label and `#content` for its panel. The
active panel is driven by the two-way `activeTab` model (holding the active
`tabId`); the first tab is selected automatically when none is set.

### Basic Usage

Each `<awd-tab>` supplies its label through a `#header` template and its panel
through a `#content` template; `<awd-tabs>` renders the header strip and the
active panel below it.

{{ demo: Demo_Tabs_Base }}

### Dynamic Tabs

Tabs are projected content, so adding or removing `<awd-tab>` elements at runtime
updates the tab set automatically. If the active tab is removed, selection falls
back to the first tab.

{{ demo: Demo_Tabs_Dynamic }}

### Overflow and scrolling

When the headers are wider than the tab list they become horizontally
scrollable, with scroll buttons appearing at whichever edge is overflowing (their
icons are configurable via `iconScrollLeft` / `iconScrollRight`) and drag-to-
scroll support. Selecting or keyboard-navigating to an off-screen header scrolls
it into view.

### Lazy loading

Set `lazy` to defer rendering each panel's content until its tab is first
activated, and `cache` to keep already-rendered panels in the DOM afterward
rather than recreating them on every switch.

### Navigation (router) tabs

A tab may omit its `#content` template — `<awd-tabs>` then renders the header
strip alone with no panel below it, so the component works as a navigation bar.
Drive the active tab from your route via `[activeTab]` and handle clicks with
`(activeTabChange)` (e.g. `router.navigate(...)`), placing a `<router-outlet />`
below the tabs. Selection stays in sync with the URL.

{{ demo: Demo_Tabs_Navigation }}

### Custom Tab Headers

Beyond per-tab `#header` templates, the tab strip itself has leading and trailing
slots — project `#headerLeft` / `#headerRight` templates (or bind
`templateHeaderLeft` / `templateHeaderRight`) to place actions like add/remove
buttons alongside the tabs.

{{ demo: Demo_Tabs_CustomHeader }}
