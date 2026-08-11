import { Component, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { type JigConfigInit, provideJigControls } from '@awdlab/jig/api/ng';
import { withDefaultIcons } from '@awdlab/jig/default-icons';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigMaskInput } from '@awdlab/jig/mask-input';
import { JigSelect } from '@awdlab/jig/select';
import { nova } from '@awdlab/jig-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

// The control resolves `requiredState` for every form paradigm — Angular writes
// the `required` input where it drives the control directly, and the required
// validator covers the classic forms that bind through a value accessor. The
// field only reads it.

@Component({
  imports: [ReactiveFormsModule, JigInput, JigInputField],
  template: `
    <jig-input-field label="Email" [showRequiredMarker]="marker()">
      <input jigInput [formControl]="control" />
    </jig-input-field>
  `,
})
class ReactiveHost {
  public readonly marker = signal<boolean | null>(true);
  public readonly control = new FormControl('', { validators: [Validators.required] });
}

@Component({
  imports: [ReactiveFormsModule, JigInput, JigInputField],
  template: `
    <jig-input-field label="Email" [showRequiredMarker]="true">
      <input jigInput [formControl]="control" />
    </jig-input-field>
  `,
})
class OptionalHost {
  public readonly control = new FormControl('');
}

@Component({
  imports: [FormsModule, JigInput, JigInputField],
  template: `
    <jig-input-field label="Email" [showRequiredMarker]="true">
      <input jigInput required [(ngModel)]="value" />
    </jig-input-field>
  `,
})
class TemplateDrivenHost {
  public value = '';
}

@Component({
  imports: [FormField, JigInput, JigInputField],
  template: `
    <jig-input-field label="Email" [showRequiredMarker]="true">
      <input jigInput [formField]="signalForm.email" />
    </jig-input-field>
  `,
})
class SignalFormHost {
  public readonly model = signal({ email: '' });
  public readonly signalForm = form(this.model, path => required(path.email));
}

@Component({
  imports: [ReactiveFormsModule, JigSelect, JigInputField],
  template: `
    <jig-input-field label="Choice">
      <jig-select [options]="options" [formControl]="control" />
    </jig-input-field>
  `,
})
class ConfigHost {
  public readonly options = [{ label: 'A', value: 1 }];
  public readonly control = new FormControl<number | null>(null, {
    validators: [Validators.required],
  });
}

@Component({
  imports: [ReactiveFormsModule, JigMaskInput, JigInputField],
  template: `
    <jig-input-field label="Birthday" [showRequiredMarker]="true">
      <jig-mask-input mask="date" [formControl]="control" />
    </jig-input-field>
  `,
})
class MaskInputHost {
  public readonly control = new FormControl<string | null>(null, {
    validators: [Validators.required],
  });
}

function setup(config?: JigConfigInit) {
  TestBed.configureTestingModule({
    providers: [
      provideJigControls(
        { theme: { preset: nova }, disableAnimations: true, ...config },
        withDefaultIcons()
      ),
    ],
  });
}

async function markerOf<T>(type: Type<T>) {
  const fixture = TestBed.createComponent(type);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return {
    fixture,
    marker: () =>
      (fixture.nativeElement as HTMLElement).querySelector(
        '[class*="input-field-required-marker"]'
      ),
  };
}

describe('input-field required marker', () => {
  beforeEach(() => setup());

  it('marks the label for a reactive control with a required validator', async () => {
    const { marker } = await markerOf(ReactiveHost);
    expect(marker()).not.toBeNull();
  });

  it('leaves the label unmarked when the control is optional', async () => {
    const { marker } = await markerOf(OptionalHost);
    expect(marker()).toBeNull();
  });

  it('marks the label for a template-driven control with the required attribute', async () => {
    const { marker } = await markerOf(TemplateDrivenHost);
    expect(marker()).not.toBeNull();
  });

  it('marks the label for a signal-forms field with a required rule', async () => {
    const { marker } = await markerOf(SignalFormHost);
    expect(marker()).not.toBeNull();
  });

  it('follows a validator added after creation', async () => {
    const { fixture, marker } = await markerOf(OptionalHost);
    fixture.componentInstance.control.addValidators(Validators.required);
    fixture.componentInstance.control.updateValueAndValidity();
    fixture.detectChanges();
    expect(marker()).not.toBeNull();
  });

  it('conveys required to assistive tech even without a native attribute', async () => {
    const { fixture } = await markerOf(ReactiveHost);
    const input = (fixture.nativeElement as HTMLElement).querySelector('input');
    expect(input?.getAttribute('aria-required')).toBe('true');
    expect(input?.required).toBe(false);
  });

  it('marks the label for a projected mask-input and flags its proxy', async () => {
    const { fixture, marker } = await markerOf(MaskInputHost);
    expect(marker()).not.toBeNull();
    const proxy = (fixture.nativeElement as HTMLElement).querySelector('jig-mask-input input');
    expect(proxy?.getAttribute('aria-required')).toBe('true');
  });

  it('is off per instance even when required', async () => {
    const { fixture, marker } = await markerOf(ReactiveHost);
    fixture.componentInstance.marker.set(false);
    fixture.detectChanges();
    expect(marker()).toBeNull();
  });
});

describe('input-field required marker (enabled globally)', () => {
  beforeEach(() => setup({ defaults: { inputField: { showRequiredMarker: true } } }));

  it('marks the label without a per-instance opt-in', async () => {
    const { marker } = await markerOf(ConfigHost);
    expect(marker()).not.toBeNull();
  });
});

describe('input-field required marker (disabled globally, the default)', () => {
  beforeEach(() => setup());

  it('leaves the label unmarked without a per-instance opt-in', async () => {
    const { marker } = await markerOf(ConfigHost);
    expect(marker()).toBeNull();
  });
});
