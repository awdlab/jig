import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  type AsyncValidatorFn,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  type ValidationErrors,
} from '@angular/forms';
import { email, form, FormField, min, minLength, required, validate } from '@angular/forms/signals';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { NgnCheckbox } from '@ngneers/controls/checkbox';
import { withDefaultIcons } from '@ngneers/controls/default-icons';
import { NgnHint } from '@ngneers/controls/hint';
import { I18n } from '@ngneers/controls/i18n';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnNumberInput } from '@ngneers/controls/number-input';
import { NgnOtp } from '@ngneers/controls/otp';
import { nova } from '@ngneers/controls-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import { NgnErrors } from './errors';
import { provideNgnErrorsMessages } from './messages';

// ── template-driven ────────────────────────────────────────────────────────
@Component({
  imports: [FormsModule, NgnInput, NgnErrors],
  template: `
    <input
      ngnInput
      required
      [(ngModel)]="value"
      ngnErrors
      ngnErrorsShowOn="always"
      #errors="ngnErrors"
    />
  `,
})
class TemplateDrivenHost {
  value = '';
  errors = viewChild.required<NgnErrors>('errors');
}

// ── reactive ─────────────────────────────────────────────────────────────────
@Component({
  imports: [ReactiveFormsModule, NgnInput, NgnHint, NgnErrors],
  template: `
    <input
      ngnInput
      [formControl]="control"
      ngnErrors
      [ngnErrorsHint]="hint"
      [ngnErrorsMessages]="{ required: 'Email is required' }"
      #errors="ngnErrors"
    />
    <ngn-hint #hint />
  `,
})
class ReactiveHost {
  control = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  errors = viewChild.required<NgnErrors>('errors');
}

@Component({
  imports: [ReactiveFormsModule, NgnInput, NgnErrors],
  template: `
    <form [formGroup]="form">
      <input ngnInput formControlName="password" />
      <input
        ngnInput
        formControlName="confirm"
        ngnErrors
        ngnErrorsShowOn="always"
        #errors="ngnErrors"
      />
    </form>
  `,
})
class GroupHost {
  form = new FormGroup(
    {
      password: new FormControl('secret', { nonNullable: true }),
      confirm: new FormControl('different', { nonNullable: true }),
    },
    {
      validators: () => ({ mismatch: { controlNames: ['confirm'], message: 'Passwords differ' } }),
    }
  );
  errors = viewChild.required<NgnErrors>('errors');
}

@Component({
  imports: [ReactiveFormsModule, NgnInput, NgnErrors],
  template: `
    <input
      ngnInput
      [formControl]="control"
      ngnErrors
      ngnErrorsShowOn="always"
      #errors="ngnErrors"
    />
  `,
})
class AsyncHost {
  private _resolve?: (errors: ValidationErrors | null) => void;

  readonly validator: AsyncValidatorFn = () =>
    new Promise<ValidationErrors | null>(resolve => {
      this._resolve = resolve;
    });

  control = new FormControl('', { nonNullable: true, asyncValidators: [this.validator] });
  errors = viewChild.required<NgnErrors>('errors');

  resolve(errors: ValidationErrors | null): void {
    this._resolve?.(errors);
  }
}

// carried message vs a globally-provided one for the same key
@Component({
  imports: [ReactiveFormsModule, NgnInput, NgnErrors],
  template: `
    <input
      ngnInput
      [formControl]="control"
      ngnErrors
      ngnErrorsShowOn="always"
      #errors="ngnErrors"
    />
  `,
})
class CarriedVsGlobalHost {
  // `server` is also provided globally (see provideNgnErrorsMessages in beforeEach);
  // the error carries its own message, which must win.
  control = new FormControl('x', {
    nonNullable: true,
    validators: [() => ({ server: { message: 'Carried server message' } })],
  });
  errors = viewChild.required<NgnErrors>('errors');
}

// classic Validators.min → `{ min, actual }`, resolved via the i18n `min` default
@Component({
  imports: [ReactiveFormsModule, NgnInput, NgnErrors],
  template: `
    <input
      ngnInput
      [formControl]="control"
      ngnErrors
      ngnErrorsShowOn="always"
      #errors="ngnErrors"
    />
  `,
})
class ClassicMinHost {
  control = new FormControl(5, { nonNullable: true, validators: [Validators.min(18)] });
  errors = viewChild.required<NgnErrors>('errors');
}

// ── signal forms ─────────────────────────────────────────────────────────────
@Component({
  imports: [FormField, NgnInput, NgnHint, NgnErrors],
  template: `
    <input
      ngnInput
      [formField]="signalForm.email"
      ngnErrors
      [ngnErrorsHint]="hint"
      [ngnErrorsMessages]="{ required: 'Email is required' }"
      #errors="ngnErrors"
    />
    <ngn-hint #hint />
  `,
})
class SignalInputHost {
  model = signal({ email: '' });
  signalForm = form(this.model, path => {
    required(path.email);
    email(path.email);
  });
  errors = viewChild.required<NgnErrors>('errors');
}

@Component({
  imports: [FormField, NgnInput, NgnErrors],
  template: `
    <input
      type="number"
      [formField]="signalForm.age"
      ngnErrors
      ngnErrorsShowOn="always"
      #errors="ngnErrors"
    />
  `,
})
class SignalMinHost {
  model = signal({ age: 0 });
  signalForm = form(this.model, path => {
    min(path.age, 18);
  });
  errors = viewChild.required<NgnErrors>('errors');
}

@Component({
  imports: [FormField, NgnNumberInput, NgnErrors],
  template: ` <input ngnNumberInput [formField]="signalForm.age" ngnErrors #errors="ngnErrors" /> `,
})
class SignalNumberFieldHost {
  model = signal({ age: null as number | null });
  signalForm = form(this.model, path => required(path.age));
  errors = viewChild.required<NgnErrors>('errors');
}

@Component({
  imports: [FormField, NgnInput, NgnErrors],
  template: `
    <input
      ngnInput
      [formField]="signalForm.code"
      ngnErrors
      ngnErrorsShowOn="always"
      #errors="ngnErrors"
    />
  `,
})
class SignalMinLengthHost {
  model = signal({ code: 'ab' });
  signalForm = form(this.model, path => {
    minLength(path.code, 5);
  });
  errors = viewChild.required<NgnErrors>('errors');
}

@Component({
  imports: [FormField, NgnInput, NgnErrors],
  template: `
    <input
      ngnInput
      [formField]="signalForm.code"
      ngnErrors
      ngnErrorsShowOn="always"
      [ngnErrorsMessages]="{ tooShort: resolveTooShort }"
      #errors="ngnErrors"
    />
  `,
})
class SignalCustomHost {
  model = signal({ code: 'ab' });
  signalForm = form(this.model, path => {
    validate(path.code, ctx =>
      ctx.value().length < 3 ? { kind: 'tooShort', hint: 'add more' } : undefined
    );
  });
  resolveTooShort = ({ params }: { params: Record<string, unknown> }) =>
    `too short: ${params['hint']}`;
  errors = viewChild.required<NgnErrors>('errors');
}

// ── manually-supplied custom errors ──────────────────────────────────────────
@Component({
  imports: [NgnCheckbox, NgnHint, NgnErrors],
  template: `
    <ngn-checkbox
      ngnErrors
      ngnErrorsShowOn="always"
      [ngnErrorsHint]="hint"
      [ngnErrorsCustom]="customErrors()"
      #errors="ngnErrors"
    />
    <ngn-hint #hint />
  `,
})
class CustomRecordHost {
  customErrors = signal<ValidationErrors | null>({ terms: 'Accept the terms' });
  errors = viewChild.required<NgnErrors>('errors');
}

@Component({
  imports: [NgnCheckbox, NgnErrors],
  template: `
    <ngn-checkbox
      ngnErrors
      ngnErrorsShowOn="always"
      ngnErrorsMode="all"
      [ngnErrorsCustom]="['tooWeak', { key: 'expired', message: 'Session expired' }]"
      [ngnErrorsMessages]="{ tooWeak: 'Password too weak' }"
      #errors="ngnErrors"
    />
  `,
})
class CustomArrayHost {
  errors = viewChild.required<NgnErrors>('errors');
}

// ── no form at all: custom errors gated on the control's own blur ────────────
@Component({
  imports: [NgnInput, NgnErrors],
  template: `
    <input
      ngnInput
      ngnErrors
      ngnErrorsShowOn="touched"
      [ngnErrorsCustom]="['bad']"
      #errors="ngnErrors"
    />
  `,
})
class NoFormTouchedHost {
  errors = viewChild.required<NgnErrors>('errors');
}

// ── i18n default messages / language switch ──────────────────────────────────
@Component({
  imports: [ReactiveFormsModule, NgnInput, NgnErrors],
  template: `
    <input
      ngnInput
      [formControl]="control"
      ngnErrors
      ngnErrorsShowOn="always"
      #errors="ngnErrors"
    />
  `,
})
class I18nHost {
  control = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  errors = viewChild.required<NgnErrors>('errors');
}

// ── input-field auto-invalid wiring ──────────────────────────────────────────
@Component({
  imports: [FormField, NgnInput, NgnInputField, NgnErrors],
  template: `
    <ngn-input-field>
      <input ngnInput [formField]="signalForm.name" ngnErrors #errors="ngnErrors" />
    </ngn-input-field>
  `,
})
class SignalFieldHost {
  model = signal({ name: '' });
  signalForm = form(this.model, path => required(path.name));
  errors = viewChild.required<NgnErrors>('errors');
}

// A bare control (no ngn-input-field wrapper) drives its own invalid styling
// from the companion ngnErrors' touched-gated visibility.
@Component({
  imports: [FormField, NgnOtp, NgnErrors],
  template: `
    <ngn-otp
      [length]="6"
      [formField]="signalForm.code"
      ngnErrorsShowOn="touched"
      ngnErrors
      #errors="ngnErrors"
    />
  `,
})
class BareControlInvalidHost {
  model = signal({ code: '' });
  signalForm = form(this.model, path => required(path.code));
  errors = viewChild.required<NgnErrors>('errors');
}

@Component({
  imports: [ReactiveFormsModule, NgnInput, NgnInputField, NgnErrors],
  template: `
    <ngn-input-field>
      <input ngnInput [formControl]="control" ngnErrors ngnErrorsShowOn="always" />
    </ngn-input-field>
  `,
})
class FieldAutoInvalidHost {
  control = new FormControl('', { nonNullable: true, validators: [Validators.required] });
}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      provideNgnControls({ theme: { preset: nova }, disableAnimations: true }, withDefaultIcons()),
      provideNgnErrorsMessages({ server: 'Server rejected the value' }),
    ],
  });
});

type Fixture = { detectChanges: () => void; whenStable: () => Promise<unknown> };

/** Runs change detection and macrotasks until `predicate` holds (or `tries` run out). */
async function waitFor(fixture: Fixture, predicate: () => boolean, tries = 25): Promise<void> {
  for (let i = 0; i < tries; i++) {
    fixture.detectChanges();
    if (predicate()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve));
  }
  fixture.detectChanges();
}

/** Detects changes and waits for the async default-language import to land. */
async function flush(fixture: Fixture) {
  const i18n = TestBed.inject(I18n);
  // signal-translate echoes the flat key back until translations are loaded.
  await waitFor(
    fixture,
    () => i18n.translations._unsafe['errors_required']() !== 'errors_required'
  );
  await Promise.resolve();
  fixture.detectChanges();
}

describe('ngnErrors', () => {
  describe('template-driven forms', () => {
    it('reads ngModel errors and resolves the i18n default message', async () => {
      const fixture = TestBed.createComponent(TemplateDrivenHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.errors().map(error => error.key)).toEqual(['required']);
      expect(errors.visible()).toBe(true);
      expect(errors.message()).toBe('Required');
    });
  });

  describe('reactive forms', () => {
    it('per-instance message overrides the i18n default, shown after touched', async () => {
      const fixture = TestBed.createComponent(ReactiveHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.errors()[0]?.key).toBe('required');
      expect(errors.visible()).toBe(false);

      // the hint slot collapses while there is nothing to show
      const hint = fixture.nativeElement.querySelector('ngn-hint') as HTMLElement;
      expect(hint.style.display).toBe('none');

      fixture.componentInstance.control.markAsTouched();
      await flush(fixture);

      expect(errors.visible()).toBe(true);
      expect(errors.message()).toBe('Email is required');
      expect(hint.style.display).not.toBe('none');
      expect(hint.textContent).toContain('Email is required');
    });

    it('exposes multiple errors', async () => {
      const fixture = TestBed.createComponent(ReactiveHost);
      fixture.componentInstance.control.addValidators(Validators.minLength(8));
      fixture.componentInstance.control.setValue('bad');
      fixture.componentInstance.control.markAsTouched();
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.errors().map(error => error.key)).toEqual(['email', 'minlength']);
      // classic `minlength` resolves via the i18n default using `requiredLength`
      expect(errors.errors().find(error => error.key === 'minlength')?.message).toBe(
        'Use at least 8 characters'
      );
    });

    it('includes relevant parent group errors (message carried on the error)', async () => {
      const fixture = TestBed.createComponent(GroupHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.errors().map(error => error.key)).toContain('mismatch');
      expect(errors.message()).toBe('Passwords differ');
    });

    it('emits pending, then the globally-provided message', async () => {
      const fixture = TestBed.createComponent(AsyncHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.pending()).toBe(true);
      expect(errors.message()).toBe('Validating...');

      fixture.componentInstance.resolve({ server: true });
      await fixture.whenStable();
      await flush(fixture);

      expect(errors.pending()).toBe(false);
      expect(errors.message()).toBe('Server rejected the value');
    });

    it('a message carried on the error wins over a globally-provided one', async () => {
      const fixture = TestBed.createComponent(CarriedVsGlobalHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.errors()[0]?.key).toBe('server');
      // carried `{ message }` takes precedence over the global `server` message
      expect(errors.message()).toBe('Carried server message');
    });

    it('resolves classic Validators.min via the i18n default with its param', async () => {
      const fixture = TestBed.createComponent(ClassicMinHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.errors()[0]?.key).toBe('min');
      expect(errors.message()).toBe('Must be at least 18');
    });
  });

  describe('signal forms', () => {
    it('per-instance message overrides the default, shown after touched', async () => {
      const fixture = TestBed.createComponent(SignalInputHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.errors()[0]?.key).toBe('required');
      expect(errors.visible()).toBe(false);

      fixture.componentInstance.signalForm.email().markAsTouched();
      await flush(fixture);

      expect(errors.visible()).toBe(true);
      expect(errors.message()).toBe('Email is required');
    });

    it('marks the field touched on blur so showOn="touched" reveals errors', async () => {
      const fixture = TestBed.createComponent(SignalInputHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.visible()).toBe(false);

      // blur on the ngn control emits the `touch` output signal forms listens for
      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('blur'));
      await flush(fixture);

      expect(fixture.componentInstance.signalForm.email().touched()).toBe(true);
      expect(errors.visible()).toBe(true);
    });

    it('marks touched on blur for ngnNumberInput too (markTouched from its own blur)', async () => {
      const fixture = TestBed.createComponent(SignalNumberFieldHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.visible()).toBe(false);

      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('blur'));
      await flush(fixture);

      expect(fixture.componentInstance.signalForm.age().touched()).toBe(true);
      expect(errors.visible()).toBe(true);
    });

    it('resolves the i18n default for a min validator with its param', async () => {
      const fixture = TestBed.createComponent(SignalMinHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.errors()[0]?.key).toBe('min');
      expect(errors.message()).toBe('Must be at least 18');
    });

    it('resolves minLength via its own i18n entry', async () => {
      const fixture = TestBed.createComponent(SignalMinLengthHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.errors()[0]?.key).toBe('minLength');
      expect(errors.message()).toBe('Use at least 5 characters');
    });

    it('exposes custom validator error fields as params to a custom resolver', async () => {
      const fixture = TestBed.createComponent(SignalCustomHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.firstError()?.key).toBe('tooShort');
      expect(errors.firstError()?.params['hint']).toBe('add more');
      expect(errors.message()).toBe('too short: add more');
    });
  });

  describe('manual custom errors', () => {
    it('bridges a custom error record to the hint', async () => {
      const fixture = TestBed.createComponent(CustomRecordHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.visible()).toBe(true);
      expect(errors.firstError()?.source).toBe('custom');
      expect(errors.message()).toBe('Accept the terms');
      expect(fixture.nativeElement.querySelector('ngn-hint')?.textContent).toContain(
        'Accept the terms'
      );
    });

    it('resolves string entries via instance messages and entry objects via their own message', async () => {
      const fixture = TestBed.createComponent(CustomArrayHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.errors().map(error => error.message)).toEqual([
        'Password too weak',
        'Session expired',
      ]);
    });

    it('gates showOn="touched" on the control\'s touch output when there is no form', async () => {
      const fixture = TestBed.createComponent(NoFormTouchedHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.errors()).toHaveLength(1);
      expect(errors.visible()).toBe(false);

      fixture.nativeElement.querySelector('input').dispatchEvent(new Event('blur'));
      await flush(fixture);

      expect(errors.visible()).toBe(true);
    });
  });

  describe('i18n messages', () => {
    it('resolves the built-in default and re-resolves on a language change', async () => {
      const fixture = TestBed.createComponent(I18nHost);
      await flush(fixture);

      const errors = fixture.componentInstance.errors();
      expect(errors.message()).toBe('Required');

      TestBed.inject(I18n).setLanguage('de');
      await waitFor(fixture, () => errors.message() === 'Erforderlich');

      expect(errors.message()).toBe('Erforderlich');
    });
  });

  describe('invalid styling ownership (control-owned, decoupled from ngnErrors)', () => {
    it('gates the projected input aria-invalid on touched, though signal forms sets invalid eagerly', async () => {
      const fixture = TestBed.createComponent(SignalFieldHost);
      await flush(fixture);

      const input = fixture.nativeElement.querySelector('input');
      // signal forms binds the raw invalid value immediately, but invalidOn='touched'
      // (default) gates when the control actually surfaces aria-invalid.
      expect(input?.getAttribute('aria-invalid')).toBeNull();

      // marking the field touched reflects into the control's touched model.
      fixture.componentInstance.signalForm.name().markAsTouched();
      await flush(fixture);
      expect(input?.getAttribute('aria-invalid')).toBe('true');
    });

    it('gates a bare control aria-invalid on its own invalidOn trigger (not eager)', async () => {
      const fixture = TestBed.createComponent(BareControlInvalidHost);
      await flush(fixture);

      const otp = fixture.nativeElement.querySelector('ngn-otp');
      // invalid value is set immediately, but the control gates its own display.
      expect(otp?.getAttribute('aria-invalid')).toBeNull();

      fixture.componentInstance.signalForm.code().markAsTouched();
      await flush(fixture);
      expect(otp?.getAttribute('aria-invalid')).toBe('true');
    });

    it('does not couple the field invalid class to ngnErrors visibility', async () => {
      const fixture = TestBed.createComponent(FieldAutoInvalidHost);
      await flush(fixture);

      const input = fixture.nativeElement.querySelector('input');
      // ngnErrors renders the message (showOn="always") but no longer drives the
      // field's invalid class — the reactive control's invalid rides the native
      // ng-invalid class, which the field theme reflects via :has().
      expect(fixture.nativeElement.querySelector('.ngn-input-field-invalid')).toBeNull();
      expect(input?.classList.contains('ng-invalid')).toBe(true);
    });
  });
});
