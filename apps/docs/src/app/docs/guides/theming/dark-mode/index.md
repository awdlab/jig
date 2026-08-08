Dark mode is two cooperating pieces: a **runtime preference** that toggles a single class,
and a **theme** that reacts to it.

### The `dark` class

`@ngneers/controls` manages the light/dark preference and, in the browser, toggles a
`dark` class on the `<html>` element. The emitted theme CSS keys its dark values off that
class — a theme's dark tokens land under `:root.dark { … }`. So the class is the switch,
and the theme's dark block (nova reverses its palette — see [Colors](/guides/colors)) is
what the switch activates. This is a **class**, not a `prefers-color-scheme` media query:
the media query is only used to _detect_ the system preference, which is then translated
into the class.

### Enabling it

Add the `withAutoColorScheme()` feature to the provider. This is required — it's what
registers the service and eagerly instantiates it so the class actually toggles:

```ts
import { provideNgnControls, withAutoColorScheme } from '@ngneers/controls/api/ng';
import { nova } from '@ngneers/controls-themes/nova';

provideNgnControls(
  { theme: { preset: nova } },
  withAutoColorScheme() // persists to localStorage by default
);
```

With no stored preference the initial value is `'system'`, so the UI follows the OS and
live-updates when the OS scheme changes. Pass `withAutoColorScheme({ storage: 'session' })`
or a custom storage object to change persistence.

### Reading and setting the scheme

Inject `ColorSchemeService`:

{{ demo: Demo_DarkMode_Toggle }}

```ts
import { ColorSchemeService } from '@ngneers/controls/api/ng';

export class ThemeToggle {
  private readonly scheme = inject(ColorSchemeService);

  toggle() {
    this.scheme.set('dark'); // 'light' | 'dark' | 'system'
    this.scheme.cycle(); // light → dark → system → light
  }

  readonly pref = this.scheme.preference; // raw choice: 'light' | 'dark' | 'system'
  readonly resolved = this.scheme.resolved; // 'system' collapsed to 'light' | 'dark'
  readonly isDark = this.scheme.isDark; // boolean
}
```

> **Avoiding a flash.** Because the class is applied after Angular boots, add a tiny inline
> script to `index.html` that reads the stored preference (and `prefers-color-scheme`) and
> sets the `dark` class _before_ first paint. The `colorSchemeInitScript()` helper
> generates one; keep its storage key (`ngn-color-scheme`) in sync.

### Dark mode needs a dark-aware theme

The `dark` class does nothing on its own — it only activates rules the theme emits from
its `dark` block. `nova`, `shade`, and `material` all define one. A theme with no dark
block looks identical in both schemes.
