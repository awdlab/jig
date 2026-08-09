The Breadcrumb component (`jig-breadcrumb`) is a navigation aid that shows where
the current page sits within a hierarchy and lets users jump back to any
ancestor. Use it for deep, hierarchical structures (nested folders, catalog
categories, multi-level settings) — not as a substitute for primary navigation
or a linear wizard's step indicator.

### Base

A ten-level trail passed through `items`. Because it overflows its container the
middle entries collapse into an overflow menu, leaving the first item and the
tail visible; the last item has no `callback`, so it renders as the
non-clickable current page.

{{ demo: Demo_Breadcrumb_Base }}

### Items

The single required input is **`items`**: a `BreadcrumbItem[]` ordered from the
root down to the current page (the last entry). Each item has a `label` and an
`id`, and is made interactive by giving it either a `callback` (invoked on
click) or a `route` (bound to `routerLink`). An item with neither renders as
plain, non-clickable text — which is how you represent the current page, since
it should not link to itself.

```ts
items = signal<BreadcrumbItem[]>([
  { label: 'Home', id: 'home', route: '/' },
  { label: 'Reports', id: 'reports', route: '/reports' },
  { label: 'Q3', id: 'q3' }, // current page — no route/callback
]);
```

### Separators and overflow

Adjacent items are joined by a separator icon; override it with
**`iconItemSeparator`**, otherwise the theme's default separator is used. When
the trail is too wide for its container, the middle items collapse into an
overflow menu (the first item and the tail stay visible) whose trigger icon you
can override with **`iconOverflow`**. Clicking the trigger opens a menu listing
the collapsed items.

### Customizing rendering

For full control over the markup, project `#item`, `#separator`, or `#overflow`
templates (or bind the matching `templateItem` / `templateSeparator` /
`templateOverflow` inputs) to replace the defaults while keeping the ordering,
overflow, and menu behavior intact.
