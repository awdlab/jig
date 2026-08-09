Controls ship their own translatable strings — a dialog's close label, the
paginator's "of", validation error defaults, the calendar's month names. They
are served by an `I18n` service built on
[`@ngneers/signal-translate`](https://www.npmjs.com/package/@ngneers/signal-translate),
so every string is a signal and a language switch re-renders without a reload.

**English** and **German** ship with the library and are loaded on demand — the
locale you do not use is never downloaded.

### Which strings are built in

Only the ones a control renders by itself. Anything you pass in — labels,
placeholders, option text, hint content — is yours to translate in your own
i18n layer.

Every control page has an **i18n** tab listing exactly which keys it owns (or
stating that it owns none), generated from the source translations so it can
never drift.

### Switching language

Inject the service and set the tag:

```ts
import { I18n } from '@awdlab/jig/i18n';

export class LanguageSwitcher {
  private readonly _i18n = inject(I18n);

  protected use(language: string): void {
    this._i18n.setLanguage(language);
  }
}
```

| Member                   | Purpose                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `language()`             | The active language tag, as a signal.                                   |
| `availableLanguages`     | Every tag that can be selected — the built-ins plus any you registered. |
| `setLanguage(tag)`       | Switches language. `null` falls back to the browser language.           |
| `isLanguage(tag)`        | Whether that tag is currently active.                                   |
| `translate(key, params)` | One-off lookup with interpolation.                                      |
| `translations`           | The signal tree behind every built-in string.                           |

The initial language is **`en`**, not the browser's. Call `setLanguage(null)`
during startup if you want the browser's preference instead:

```ts
provideAppInitializer(() => inject(I18n).setLanguage(null));
```

Resolution is forgiving: an unknown region falls back to its base language
(`de-AT` → `de`), and an entirely unknown tag falls back to the first available
language. The service also keeps `<html lang>` in sync with the active
language, which screen readers rely on for pronunciation.

### Adding a language

Supply a loader through `customTranslations`. It is called lazily, so the
locale is a separate chunk:

```ts
provideNgnControls({
  theme: { preset: nova },
  customTranslations: {
    fr: () => import('./i18n/fr').then(m => m.fr),
    'pt-BR': () => import('./i18n/pt-br').then(m => m.ptBR),
  },
});
```

Registered tags join `availableLanguages`, so `setLanguage('fr')` works exactly
like a built-in one.

The module must export the **complete** `Translations` shape. Type it against
the source so a new key in a library release becomes a compile error rather
than a missing string at runtime:

```ts
import type { Translations } from '@awdlab/jig/i18n';

export const fr: Translations = {/* … every group … */};
```

The easiest way to start is to copy the English source and translate it. If you
only want to change a handful of strings, copying is still the right move —
there is no partial-override mechanism, and a missing key renders as its own
key path.

Custom loaders are additional languages; the built-in `en` and `de` always
resolve to the shipped translations.

### Interpolation

Strings use `{{ param }}` placeholders, filled from the values a control passes
in — for example the validation defaults interpolate the failing constraint:

```ts
minlength: 'Use at least {{ requiredLength }} characters';
```

### Validation messages

Error text lives in the same translation table under `errors.*`, so the
defaults are localized. Overriding one message app-wide does not require a
translation file — use
[`provideNgnErrorsMessages()`](/components/errors), whose resolvers can read
your own i18n:

```ts
provideNgnErrorsMessages({
  required: () => inject(TranslateService).instant('validation.required'),
});
```

Messages that depend on the built-in translations are held back until the
locale has loaded, so a raw key never flashes on screen first.

### Formatting is not translation

Dates and numbers are formatted through `Intl`, driven by the control's own
`locale` input rather than by the translation language. Set both if the two
must agree:

```html
<input ngnNumberInput [locale]="i18n.language()" />
```

### Server-side rendering

Translations are loaded through a dynamic import, which resolves asynchronously
on the server too. Angular's `PendingTasks` keeps the render pending until it
settles, so the HTML you serve is already translated. See
[SSR & Hydration](/guides/ssr-hydration).
