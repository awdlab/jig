The library is designed so that an app pays for the controls it uses and
nothing else. Most of that is automatic; a few things are yours to get right.

### Import from subpaths

The root `@awdlab/jig` entry point is intentionally empty. Every control
has its own subpath, and the package is marked `sideEffects: false`, so a
bundler drops everything you do not import:

```ts
import { AwdButton } from '@awdlab/jig/button';
import { AwdSelect } from '@awdlab/jig/select';
```

There is no barrel to accidentally pull the whole library through — but do not
re-export one yourself either. A local `ui/index.ts` that re-exports thirty
controls turns a two-control page into a thirty-control bundle for any bundler
that cannot see through it.

### CSS is generated, and lazy

There is no stylesheet to import, and no unused CSS to ship. The theme engine
emits CSS for a control scope the first time that control renders, together
with the scopes it depends on. A page with three controls carries the CSS for
three controls.

The cost is a small amount of work at first render per scope, not per instance
— a table with a thousand rows injects its CSS once.

### Zoneless by default

Controls are signal-based and work under zoneless change detection. Nothing in
the library depends on `zone.js` being present, and no control triggers global
change detection to update itself.

### Deferring work

- **Overlay content** — dialogs, popovers and menus can render their body
  lazily; see [Defer](/components/defer). The `lazyContent` input is what
  actually defers, projected content is not deferred.
- **floating-ui** loads on demand the first time an anchored overlay opens, so
  a page without overlays never downloads it.
- **Translations** load per language, on demand.
- **Icons** are plain objects you import — importing only the glyphs you use
  keeps the icon cost proportional. `withDefaultIcons()` registers a fixed set
  of 45; supply your own registry if you want fewer.

### Long lists

Two independent tools, often confused:

| Concern                        | Tool                                                    |
| ------------------------------ | ------------------------------------------------------- |
| Too many DOM nodes             | **virtualization** (`virtual` on list box, tree, table) |
| Too much data to fetch at once | **lazy loading** (`dataSource`, paginator)              |

Virtualization renders only the visible window, so a 50k-row table stays
responsive; it says nothing about where the rows came from. Lazy loading
fetches windows of data from a server; it says nothing about how many rows are
in the DOM. They combine for infinite scroll.

Reach for pagination rather than an unbounded virtual list where completeness
matters — a virtualized region is also harder for assistive technology to read
end to end. See [Accessibility](/guides/accessibility).

### Table specifics

- Bind `dataSource` to a **stable** function reference (a class field or
  method, never an inline arrow). A new identity each change-detection cycle
  invalidates the page cache and refetches continuously.
- `fieldId` is used for row tracking, so give it a genuinely unique property —
  a duplicated id causes rows to be re-created rather than reused.
- Body cells deliberately avoid the full control machinery, which is why
  `ngnTableTd` is a thin directive. Keep cell templates cheap: a component per
  cell in a virtualized table is the usual cause of scroll jank.

### Passthrough objects

Passthrough tracks by object identity. Assign a **new** `pt` object when it
changes rather than mutating in place — but equally, do not build a fresh one
in a template expression or getter, or it changes on every cycle and reapplies
constantly. A `computed()` is the right home for a dynamic `pt`.

### Measuring

Bundle impact is easiest to see with `source-map-explorer` or
`webpack-bundle-analyzer` over a production build. Two things worth checking:

- that no control you do not use appears;
- that `@floating-ui/dom` is in a lazy chunk, not the initial one.

For runtime, Angular DevTools' profiler shows which components re-render. In a
signal-based app the usual culprit is a function called from a template
expression rather than a `computed()`.
