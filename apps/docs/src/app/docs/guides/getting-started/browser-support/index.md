### Supported browsers

The library supports the **current and previous major version** of every
evergreen browser, matching
[Angular's own browser support](https://angular.dev/reference/versions#browser-support).

| Browser               | Minimum |
| --------------------- | ------- |
| Chrome / Edge         | 120     |
| Firefox               | 129     |
| Safari (macOS)        | 17.5    |
| Safari (iOS) / iPadOS | 17.5    |
| Samsung Internet      | 25      |

Older versions are not tested and not supported. Internet Explorer is not
supported in any version.

### Why those floors

They are not arbitrary — each is the version that shipped a platform feature
the controls rely on rather than polyfill:

| Feature                               | Used for                                                     | Available since                      |
| ------------------------------------- | ------------------------------------------------------------ | ------------------------------------ |
| Popover API                           | tooltips, menus, selects, toasts — the top layer             | Chrome 114, Safari 17, Firefox 125   |
| `<dialog>` + `showModal()`            | modal dialogs and drawers                                    | Chrome 37, Safari 15.4, Firefox 98   |
| CSS cascade layers (`@layer`)         | keeping theme CSS overridable without `!important`           | Chrome 99, Safari 15.4, Firefox 97   |
| CSS nesting                           | the generated theme CSS                                      | Chrome 120, Safari 17.2, Firefox 117 |
| `:has()`                              | parent-aware theming (e.g. input-field reflecting its input) | Chrome 105, Safari 15.4, Firefox 121 |
| `transition-behavior: allow-discrete` | transitioning `display`/`overlay` on close                   | Chrome 117, Safari 17.4, Firefox 129 |
| `@starting-style`                     | enter transitions for top-layer elements                     | Chrome 117, Safari 17.5, Firefox 129 |
| `ResizeObserver`                      | virtual scrolling, splitters, overlay sizing                 | broadly available                    |
| `Intl.*`                              | number, date and list formatting                             | broadly available                    |

CSS nesting and `@starting-style` set the practical floor; the rest sits
comfortably below it. Feature availability figures are from
[MDN](https://developer.mozilla.org/) — check there if you need to support an
older baseline and want to know exactly what degrades.

Nothing here is polyfillable in a meaningful way — `@starting-style` and the
top layer have no JavaScript equivalent — so the floors are hard rather than a
matter of adding a shim.

### Progressive degradation

Where a feature is missing, the failure mode is cosmetic rather than
functional: an overlay without `@starting-style` appears instantly instead of
fading. Controls do not feature-detect and change behaviour.

### Angular and TypeScript

| Requirement  | Version |
| ------------ | ------- |
| Angular      | 22.0+   |
| TypeScript   | 6.0+    |
| Node (build) | 22+     |

Angular 22 is the floor because the controls use signal-based
`input()`/`model()`/`output()` and the signal-forms `FormValueControl`
contract. There is no `NgModule` build and no Ivy-compat layer for older
versions.

### Zoneless

The controls are built for zoneless change detection, which is Angular's
default. They also work in a zone-based app — nothing depends on `zone.js`
being absent — but no control relies on zone patching to update, so you gain
nothing by keeping it.

### Server-side rendering

SSR is supported and tested with `@angular/ssr`. See
[SSR & Hydration](/guides/ssr-hydration) for what renders on the server and
what settles after hydration.

### Mobile

Touch is supported throughout: pointer events rather than mouse events,
`touch-action` handling on gesture directives, and target sizes that meet
WCAG 2.2 AA in the shipped themes. The controls are not a mobile framework —
there are no native transitions or platform-specific chrome.
