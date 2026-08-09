`ngnErrors` resolves a control's validation errors into a human-readable
message and hands it to an [`jig-hint`](/components/hint). It is the bridge
between Angular's form validation and what the user actually sees.

It works the same way on **all three** form paradigms — template-driven
(`ngModel`), reactive (`formControl` / `formControlName`) and signal forms
(`[formField]`) — and also with no form at all. See
[Forms & Validation](/guides/forms-validation) for the full picture.

### Basic Usage

Put `ngnErrors` on the same element as the form binding and point it at a hint:

{{ demo: Demo_Errors_Reactive }}

The hint stays empty until there is something to show. By default messages
appear once the control is **touched**, so a pristine form is not a wall of red.

### Signal Forms

Nothing changes — the same directive reads the field's errors through the
`NgControl` that `[formField]` provides:

{{ demo: Demo_Errors_SignalForms }}

Signal-forms validators report their own error kinds, and both spellings are
covered by the built-in table: classic `minlength`/`maxlength` and the signal
forms `minLength`/`maxLength`.

### It Renders Messages, Not Styling

`ngnErrors` never touches the control's appearance. The red border and
`aria-invalid` are the **control's** job, driven by its own `invalid` and
`invalidOn` inputs, so the two can be timed independently:

```html
<!-- border as soon as it is invalid, message only after blur -->
<input ngnInput invalidOn="immediate" ngnErrors ngnErrorsShowOn="touched" />
```

A signal-forms binding writes `invalid` in for you; with reactive forms you set
it yourself. See [State](/guides/state).

### When Messages Appear

`ngnErrorsShowOn` decides the trigger:

| Value       | Messages appear                                  |
| ----------- | ------------------------------------------------ |
| `touched`   | after the control has been blurred (default)     |
| `dirty`     | as soon as the value has changed                 |
| `submitted` | after the surrounding form has been submitted    |
| `always`    | immediately                                      |
| `never`     | never — useful to suppress a field conditionally |

With no form present, "touched" falls back to the control's own `touched`
signal and its `touch` (blur) output, so it still behaves correctly.

### Custom Messages

`ngnErrorsMessages` overrides messages for one control. A value can be a string
or a resolver that receives the error's `params`:

{{ demo: Demo_Errors_Messages }}

`ngnErrorsMode="all"` shows every failing rule, joined by newlines, instead of
just the first.

To change messages application-wide, provide them once instead:

```ts
import { provideAwdErrorsMessages } from '@awdlab/jig/errors';

providers: [
  provideAwdErrorsMessages({
    required: 'This field is required.',
    email: 'That does not look like an email address.',
  }),
];
```

The token is a `multi` provider, so several maps merge — a feature module can
add its own keys without replacing yours.

### Message Resolution Order

For each error key, the first source that yields a non-empty message wins:

1. `ngnErrorsMessages` on this control
2. a message carried on the error value itself — a `message` field
   (`{ tooShort: { message: '…' } }`) or a plain-string error value
3. messages from `provideAwdErrorsMessages`
4. the built-in translation for `errors.<key>` (see [i18n](/guides/i18n))
5. the raw error key, as a last resort

An empty string counts as "no message" and falls through to the next source, so
you can blank out a single key without losing the rest.

> Errors whose message can only come from the built-in translations are held
> back until the locale has loaded, so a raw key like `required` never flashes
> on screen first. Errors with your own message show immediately.

### Errors From Outside the Form

`ngnErrorsCustom` layers errors on top of validation — server responses,
cross-field rules, anything Angular does not know about:

{{ demo: Demo_Errors_Custom }}

It accepts three shapes:

```ts
// 1. a ValidationErrors object
{
  taken: true;
}

// 2. plain keys, resolved through the message table
['taken', 'reserved'][
  // 3. entries with their own message and params
  { key: 'taken', message: 'That name is already in use.' }
];
```

### Group Errors

Validators on a `FormGroup` produce errors on the group, not on any one field.
`ngnErrors` surfaces a parent error on a child control when the error value
names that control — under `control`, `controlName`, `field`, `controls`,
`controlNames` or `fields`, as a string or an array of them:

```ts
// shown on the control named 'confirmPassword'
{
  passwordMismatch: {
    controls: ['password', 'confirmPassword'];
  }
}
```

A group error that names nothing stays on the group and is not repeated under
every field.

### Async Validators

While a validator is pending the state is `pending`, and the hint shows the
translated "validating" message. Pending always displays, regardless of
`ngnErrorsShowOn`, so a slow check never looks like nothing is happening.

### Reading the State Directly

Export the directive to build your own UI instead of using a hint:

```html
<input ngnInput [formControl]="email" ngnErrors #errors="ngnErrors" />

@if (errors.visible()) {
<ul>
  @for (error of errors.errors(); track error.key) {
  <li>{{ error.message }}</li>
  }
</ul>
}
```

`errors()` gives the normalized list (`key`, `value`, `source`, `message`,
`params`), plus `firstError()`, `message()`, `visible()`, `pending()` and a
combined `state()`.
