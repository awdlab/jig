There is **no `ControlValueAccessor`** in this library. Every value control
exposes its value as a signal `model()` and implements Angular's signal-forms
`FormValueControl` contract, and Angular's own interop makes that same contract
work with the two classic paradigms.

The result: the identical markup binds to signal forms, reactive forms,
template-driven forms, or nothing at all.

### The three paradigms

```html
<!-- signal forms -->
<input ngnInput [formField]="userForm.email" />

<!-- reactive forms -->
<input ngnInput [formControl]="email" />
<input ngnInput [formGroup]="form" formControlName="email" />

<!-- template-driven -->
<input ngnInput name="email" [(ngModel)]="email" />

<!-- no form at all -->
<input ngnInput [value]="email()" (valueChange)="email.set($event ?? '')" />
```

> **Never add a `ControlValueAccessor` bridge of your own.** Angular's
> `FormValueControl` interop is what makes `formControlName` and `ngModel` work
> here; registering a CVA on the same element shadows it and breaks the
> binding. If a control seems not to bind, the fix is never a CVA.

### Signal forms

Define the shape with `form()` and bind each field:

```ts
import { form, required, email, minLength, FormField } from '@angular/forms/signals';

@Component({
  imports: [FormField, JigInput, JigInputField, JigErrors, JigHint],
  template: `
    <jig-input-field [label]="'Email'">
      <input ngnInput [formField]="userForm.email" ngnErrors [ngnErrorsHint]="hint" />
    </jig-input-field>
    <jig-hint #hint />
  `,
})
export class SignUp {
  protected readonly model = signal({ email: '', password: '' });
  protected readonly userForm = form(this.model, path => {
    required(path.email);
    email(path.email);
    minLength(path.password, 8);
  });
}
```

`[formField]` drives the control in both directions: it writes the value,
mirrors `disabled`, writes `invalid` in from the field's validity, and listens
to the control's `touch` output to mark the field touched on blur.

### Reactive and template-driven forms

Nothing special is required — the control behaves like a native input:

```ts
@Component({
  imports: [ReactiveFormsModule, JigInput, JigErrors, JigHint],
  template: `
    <form [formGroup]="form">
      <input ngnInput formControlName="email" ngnErrors [ngnErrorsHint]="hint" />
      <jig-hint #hint />
    </form>
  `,
})
export class Profile {
  protected readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
}
```

One difference: with reactive/template-driven forms the control's `invalid`
input is **not** written for you — see "Who owns invalid" below.

### Validation messages

Messages come from the [`ngnErrors`](/components/errors) directive, which reads
the host's validation state whatever paradigm produced it and pushes a message
into an [`jig-hint`](/components/hint):

```html
<input ngnInput [formControl]="email" ngnErrors [ngnErrorsHint]="hint" /> <jig-hint #hint />
```

It resolves messages from — in order — the control's own `ngnErrorsMessages`,
a message carried on the error, app-wide messages from
`provideJigErrorsMessages()`, and finally the built-in translations. Full
detail on the [Errors](/components/errors) page.

### Who owns `invalid`

Two separate decisions, deliberately kept apart:

| Concern                           | Input             | Owned by          |
| --------------------------------- | ----------------- | ----------------- |
| Is the value invalid?             | `invalid`         | the form (or you) |
| When does the invalid style show? | `invalidOn`       | the control       |
| When does the message show?       | `ngnErrorsShowOn` | `ngnErrors`       |

`invalid` is the raw flag. A signal-forms binding sets it; with reactive forms
you bind it yourself:

```html
<input ngnInput [formControl]="email" [invalid]="email.invalid" />
```

`invalidOn` gates when that flag is actually rendered — the control never
paints itself red before the user has had a chance:

| `invalidOn` | Invalid styling appears        |
| ----------- | ------------------------------ |
| `touched`   | after blur (default)           |
| `dirty`     | once the value has changed     |
| `immediate` | as soon as `invalid` is `true` |
| `never`     | never                          |

Because the two triggers are independent you can show the border immediately
but hold the message until blur, or vice versa.

`jig-input-field` reflects its projected control's gated state, so the wrapper
and the input never disagree.

### Touched and blur

`touched` is a two-way `model()`, and controls call an internal `markTouched()`
on blur which both flips `touched` and emits the `touch` output. Signal forms
observes **only** the `touch` output, so writing `touched` from your own code
does not mark a bound field touched — emit through the control's own blur
handling instead.

Composite controls with an overlay (select, calendar) mark touched from a
popover-aware blur, so opening the dropdown is not mistaken for leaving the
field.

### Native validation and `novalidate`

`[formField]` mirrors the field's constraints onto the element as **native**
attributes — `required`, `min`, `max`, `minlength`. That means the browser's
own validation kicks in on submit and silently blocks it with a native bubble,
before Angular ever sees the event.

Put `novalidate` on the form so the browser stays out of the way, and mark the
form touched on submit so your own messages appear for fields the user never
visited:

```html
<form novalidate (submit)="save($event)">…</form>
```

```ts
protected save(event: Event): void {
  event.preventDefault();
  this.userForm().markAsTouched(); // reveals messages on untouched fields
  if (this.userForm().invalid()) {
    return;
  }
  // …
}
```

This is the single most common surprise when moving a form to signal forms:
without `novalidate` the submit is blocked by a native bubble and your handler
never runs.

### Errors that are not validation

Server-side rejections, cross-field rules, anything Angular does not know
about — pass them in through `ngnErrorsCustom`:

```html
<input ngnInput [formField]="userForm.name" ngnErrors [ngnErrorsCustom]="serverErrors()" />
```

### Which controls are form controls

Every control that extends `ValueControlBase` — input, number input, mask
input, textarea, select, list box, tree, checkbox, radio, switch,
toggle button, select button, slider, rating, calendar, color picker, OTP,
upload, filter, edit-in-place. They all share `value`, `disabled`, `readonly`,
`invalid`, `invalidOn`, `touched`, `dirty`, `label`, `labelledBy` and
`inputId`; see [State](/guides/state).

### Related

- [Errors](/components/errors) — messages, custom messages, error sources.
- [State](/guides/state) — the shared state model and how it reaches the theme.
- [Accessibility](/guides/accessibility) — labelling and announcing errors.
