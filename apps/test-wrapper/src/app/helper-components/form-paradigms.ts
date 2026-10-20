import { Component, computed, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormField, form, minLength, required, type FieldTree } from '@angular/forms/signals';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigInput } from '@awdlab/jig/input';
import { JigSelect } from '@awdlab/jig/select';
import { JigSwitch } from '@awdlab/jig/switch';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Four wrappers over the same three controls — a text input, a switch and a
 * select — one per form paradigm, so a single end-to-end scenario can be run
 * against all of them. Each exposes the same DOM: the controls, a hint fed by
 * `jigErrors`, a `set-from-code` button writing the model from TypeScript, and
 * a `snapshot` readout of the current model.
 */

const FLAVORS = [
  { label: 'Vanilla', value: 'Vanilla' },
  { label: 'Chocolate', value: 'Chocolate' },
  { label: 'Mint', value: 'Mint' },
];

type Model = { name: string; subscribed: boolean; flavor: string };

const DEFAULTS: Model = { name: 'Ada', subscribed: true, flavor: 'Vanilla' };
const FROM_CODE: Model = { name: 'Codex', subscribed: true, flavor: 'Mint' };

function snapshotOf(model: Partial<Model>): string {
  return `${model.name}|${model.subscribed}|${model.flavor}`;
}

/** No form at all: `[value]` in, `(valueChange)` out. */
@Component({
  selector: 'form-manual',
  imports: [JigErrors, JigHint, JigInput, JigSelect, JigSwitch],
  template: `
    <div
      class="page-center"
      style="display: flex; flex-direction: column; gap: 0.5rem; width: 18rem"
    >
      <input
        jigInput
        [value]="name()"
        (valueChange)="name.set($event ?? '')"
        jigErrors
        [jigErrorsCustom]="nameErrors()"
        [jigErrorsHint]="nameHint"
      />
      <jig-hint #nameHint />
      <jig-switch [value]="subscribed()" (valueChange)="subscribed.set($event)" />
      <jig-select [options]="flavors" [value]="flavor()" (valueChange)="flavor.set($event!)" />
      <button type="button" data-testid="set-from-code" (click)="setFromCode()">
        Set from code
      </button>
      <output data-testid="snapshot">{{ snapshot() }}</output>
    </div>
  `,
})
export class FormManual {
  protected readonly flavors = FLAVORS;

  protected readonly name = signal(DEFAULTS.name);
  protected readonly subscribed = signal(DEFAULTS.subscribed);
  protected readonly flavor = signal(DEFAULTS.flavor);

  /** Hand-rolled stand-in for the validators the other paradigms declare. */
  protected readonly nameErrors = computed(() => {
    const value = this.name();
    if (!value) {
      return { required: true };
    }
    if (value.length < 3) {
      return { minlength: { requiredLength: 3, actualLength: value.length } };
    }
    return null;
  });

  protected readonly snapshot = computed(() =>
    snapshotOf({ name: this.name(), subscribed: this.subscribed(), flavor: this.flavor() })
  );

  protected setFromCode(): void {
    this.name.set(FROM_CODE.name);
    this.subscribed.set(FROM_CODE.subscribed);
    this.flavor.set(FROM_CODE.flavor);
  }
}

/** Template-driven forms: `[(ngModel)]` onto signals, validators as attributes. */
@Component({
  selector: 'form-template-driven',
  imports: [FormsModule, JigErrors, JigHint, JigInput, JigSelect, JigSwitch],
  template: `
    <div
      class="page-center"
      style="display: flex; flex-direction: column; gap: 0.5rem; width: 18rem"
    >
      <input
        jigInput
        name="name"
        [(ngModel)]="name"
        required
        minlength="3"
        jigErrors
        [jigErrorsHint]="nameHint"
      />
      <jig-hint #nameHint />
      <jig-switch name="subscribed" [(ngModel)]="subscribed" />
      <jig-select name="flavor" [options]="flavors" [(ngModel)]="flavor" />
      <button type="button" data-testid="set-from-code" (click)="setFromCode()">
        Set from code
      </button>
      <output data-testid="snapshot">{{ snapshot() }}</output>
    </div>
  `,
})
export class FormTemplateDriven {
  protected readonly flavors = FLAVORS;

  protected readonly name = signal(DEFAULTS.name);
  protected readonly subscribed = signal(DEFAULTS.subscribed);
  protected readonly flavor = signal(DEFAULTS.flavor);

  protected readonly snapshot = computed(() =>
    snapshotOf({ name: this.name(), subscribed: this.subscribed(), flavor: this.flavor() })
  );

  protected setFromCode(): void {
    this.name.set(FROM_CODE.name);
    this.subscribed.set(FROM_CODE.subscribed);
    this.flavor.set(FROM_CODE.flavor);
  }
}

/** Reactive forms: a `FormGroup` with `formControlName` bindings. */
@Component({
  selector: 'form-reactive',
  imports: [ReactiveFormsModule, JigErrors, JigHint, JigInput, JigSelect, JigSwitch],
  template: `
    <form
      [formGroup]="group"
      class="page-center"
      style="display: flex; flex-direction: column; gap: 0.5rem; width: 18rem"
    >
      <input jigInput formControlName="name" jigErrors [jigErrorsHint]="nameHint" />
      <jig-hint #nameHint />
      <jig-switch formControlName="subscribed" />
      <jig-select [options]="flavors" formControlName="flavor" />
      <button type="button" data-testid="set-from-code" (click)="setFromCode()">
        Set from code
      </button>
      <output data-testid="snapshot">{{ snapshot() }}</output>
    </form>
  `,
})
export class FormReactive {
  protected readonly flavors = FLAVORS;

  protected readonly group = new FormGroup({
    name: new FormControl(DEFAULTS.name, {
      nonNullable: true,
      validators: [control => Validators.required(control), Validators.minLength(3)],
    }),
    subscribed: new FormControl(DEFAULTS.subscribed, { nonNullable: true }),
    flavor: new FormControl(DEFAULTS.flavor, { nonNullable: true }),
  });

  private readonly value = toSignal(this.group.valueChanges, {
    initialValue: this.group.getRawValue(),
  });

  protected readonly snapshot = computed(() => snapshotOf(this.value()));

  protected setFromCode(): void {
    this.group.setValue(FROM_CODE);
  }
}

/** Signal forms: a `form()` over a model signal, bound with `[formField]`. */
@Component({
  selector: 'form-signal',
  imports: [FormField, JigErrors, JigHint, JigInput, JigSelect, JigSwitch],
  template: `
    <div
      class="page-center"
      style="display: flex; flex-direction: column; gap: 0.5rem; width: 18rem"
    >
      <input jigInput [formField]="signalForm.name" jigErrors [jigErrorsHint]="nameHint" />
      <jig-hint #nameHint />
      <jig-switch [formField]="signalForm.subscribed" />
      <jig-select [options]="flavors" [formField]="signalForm.flavor" />
      <button type="button" data-testid="set-from-code" (click)="setFromCode()">
        Set from code
      </button>
      <output data-testid="snapshot">{{ snapshot() }}</output>
    </div>
  `,
})
export class FormSignal {
  protected readonly flavors = FLAVORS;

  protected readonly model = signal<Model>({ ...DEFAULTS });

  protected readonly signalForm: FieldTree<Model> = form(this.model, path => {
    required(path.name);
    minLength(path.name, 3);
  });

  protected readonly snapshot = computed(() => snapshotOf(this.model()));

  protected setFromCode(): void {
    this.model.set({ ...FROM_CODE });
  }
}
