Controls render icons through the `awd-icon` control and a registry of semantic icon
**slots**, so you can swap the whole icon set in one place — or override a single glyph on
one control.

### Icon values

An icon value is an [Iconify](https://iconify.design) icon object (or `{ icon, scale }`):

```ts
import tablerUser from '@iconify/icons-tabler/user';
```

```html
<awd-icon [icon]="icon" />
```

{{ demo: Demo_Icon_Base }}

### Icon inputs on controls

Controls that render a glyph expose **`icon`-prefixed inputs** to override the default for
that slot — `iconClose`, `iconDropdown`, `iconFilter`, `iconChecked`, and so on. Pass an
icon value to replace just that one:

```html
<awd-select [iconDropdown]="myChevron" />
```

### Registering a default set

Controls with `defaultIcon` slots need a registry. The quickest path is
`withDefaultIcons()`, which registers the built-in **Tabler** set covering all 45 semantic
slots (`dialog-close`, `dropdown-toggle`, `checkbox-checked`, `sort-ascending`, …):

```ts
import { withDefaultIcons } from '@awdlab/jig/default-icons';

provideNgnControls({ theme: { preset: nova } }, withDefaultIcons());
```

This is why `@iconify/icons-tabler` is an _optional_ peer — it's only pulled in by this
feature.

### Supplying your own set

To use a different icon set, provide a full registry with `withCustomIcons()`. It expects a
value for **every** semantic slot:

```ts
import { withCustomIcons, type NgnCustomIconRegistry } from '@awdlab/jig/icon';

const icons: NgnCustomIconRegistry = {
  'dialog-close': myClose,
  'dropdown-toggle': myChevron,
  /* …all slots… */
};

provideNgnControls({ theme: { preset: nova } }, withCustomIcons(icons));
```

Include either `withDefaultIcons()` or `withCustomIcons()` — a `defaultIcon` slot with no
registry throws at render.

See the [Icon](/components/icon) component page for the full `awd-icon` API.
