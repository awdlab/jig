import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  type AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  type ValidationErrors,
} from '@angular/forms';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { NgnCheckbox } from '@ngneers/controls/checkbox';
import { withDefaultIcons } from '@ngneers/controls/default-icons';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnInput } from '@ngneers/controls/input';
import { novaCoral } from '@ngneers/controls-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import { NgnErrors } from './errors';
import { provideNgnErrorsMessages } from './messages';

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
class InputHost {
  control = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  errors = viewChild.required<NgnErrors>('errors');
}

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
class CheckboxHost {
  customErrors = signal<ValidationErrors | null>({ terms: 'Accept the terms' });
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

  control = new FormControl('', {
    nonNullable: true,
    asyncValidators: [this.validator],
  });
  errors = viewChild.required<NgnErrors>('errors');

  resolve(errors: ValidationErrors | null): void {
    this._resolve?.(errors);
  }
}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      provideNgnControls(
        { theme: { preset: novaCoral }, disableAnimations: true },
        withDefaultIcons()
      ),
      provideNgnErrorsMessages({ server: 'Server rejected the value' }),
    ],
  });
});

async function flush(fixture: { detectChanges: () => void; whenStable: () => Promise<unknown> }) {
  fixture.detectChanges();
  await Promise.resolve();
  fixture.detectChanges();
}

describe('ngnErrors', () => {
  it('exports normalized errors and shows them after touched by default', async () => {
    const fixture = TestBed.createComponent(InputHost);
    await flush(fixture);

    const errors = fixture.componentInstance.errors();
    expect(errors.errors()[0]?.key).toBe('required');
    expect(errors.visible()).toBe(false);

    fixture.componentInstance.control.markAsTouched();
    await flush(fixture);

    expect(errors.visible()).toBe(true);
    expect(errors.message()).toBe('Email is required');
    expect(fixture.nativeElement.querySelector('ngn-hint')?.textContent).toContain(
      'Email is required'
    );
  });

  it('can expose multiple Angular errors', async () => {
    const fixture = TestBed.createComponent(InputHost);
    fixture.componentInstance.control.addValidators(Validators.minLength(8));
    fixture.componentInstance.control.setValue('bad');
    fixture.componentInstance.control.markAsTouched();
    await flush(fixture);

    const errors = fixture.componentInstance.errors();
    expect(errors.errors().map(error => error.key)).toEqual(['email', 'minlength']);
  });

  it('merges custom errors and bridges them to a normal hint', async () => {
    const fixture = TestBed.createComponent(CheckboxHost);
    await flush(fixture);

    const errors = fixture.componentInstance.errors();
    expect(errors.visible()).toBe(true);
    expect(errors.firstError()?.source).toBe('custom');
    expect(errors.message()).toBe('Accept the terms');
    expect(fixture.nativeElement.querySelector('ngn-hint')?.textContent).toContain(
      'Accept the terms'
    );
  });

  it('includes relevant parent group errors', async () => {
    const fixture = TestBed.createComponent(GroupHost);
    await flush(fixture);

    const errors = fixture.componentInstance.errors();
    expect(errors.errors().map(error => error.key)).toContain('mismatch');
    expect(errors.message()).toBe('Passwords differ');
  });

  it('emits pending state and then the resolved async error message', async () => {
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
});
