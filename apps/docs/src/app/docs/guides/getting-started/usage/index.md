With the [provider registered](/guides/installation), you're ready to render controls.

### Import from subpaths

The root `@awdlab/jig` entry point is intentionally empty — every control has its
own subpath, so you only bundle what you import:

```ts
import { NgnButton } from '@awdlab/jig/button';
import { NgnSelect } from '@awdlab/jig/select';
import { provideNgnControls } from '@awdlab/jig/api/ng';
```

### Render a control

Controls are standalone — add them to a component's `imports` and use them in the
template. Some are elements (`awd-select`), some are attribute directives on native
elements (`button[ngnButton]`, `input[ngnInput]`):

```ts
import { Component } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';

@Component({
  selector: 'app-example',
  imports: [NgnButton],
  template: `<button ngnButton kind="primary">Save</button>`,
})
export class ExampleComponent {}
```

Every control's look is decided by its `kind` and `color` — see
[Kinds & Colors](/guides/kinds-colors).

### Binding values

Value controls expose their value as a **signal `model()`**, so two-way binding works
without `ControlValueAccessor`:

```ts
@Component({
  imports: [NgnInput, NgnInputField],
  template: `
    <awd-input-field>
      <input ngnInput [value]="name()" (valueChange)="name.set($event ?? '')" />
    </awd-input-field>
  `,
})
export class NameField {
  protected readonly name = signal('');
}
```

Controls implement Angular's signal-forms `FormValueControl` contract, so the same markup
binds to signal forms, reactive forms and `ngModel` alike — no `ControlValueAccessor`
anywhere. Validation messages are surfaced through the dedicated error/hint controls; see
[Forms & Validation](/guides/forms-validation).

### Next steps

- [Components](/components/button) — browse the full catalog.
- [Configuration](/guides/configuration) — every provider option in one place.
- [Forms & Validation](/guides/forms-validation) — binding values and showing errors.
- [Passthrough](/guides/passthrough) — customize a control's internals.
- [Icons](/guides/icons) — the icon system.
