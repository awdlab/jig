import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { withDefaultIcons } from '@ngneers/controls/default-icons';
import { NgnSelect } from '@ngneers/controls/select';
import { NgnSwitch } from '@ngneers/controls/switch';
import { novaCoral } from '@ngneers/controls-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

// These controls implement Angular's Signal-Forms `FormValueControl` (via
// `ValueControlBase`) and NO `ControlValueAccessor`. On Angular 22 the classic
// Reactive/Template-Driven forms bind to such controls as-is — this spec is the
// executable proof (and guards against a regression that would force a CVA).

@Component({
  imports: [ReactiveFormsModule, NgnSwitch],
  template: `<ngn-switch [formControl]="ctrl" />`,
})
class ReactiveSwitchHost {
  ctrl = new FormControl<boolean>(false, { nonNullable: true });
  sw = viewChild.required(NgnSwitch);
}

@Component({
  imports: [ReactiveFormsModule, NgnSelect],
  template: `<ngn-select [options]="opts" [formControl]="ctrl" />`,
})
class ReactiveSelectHost {
  opts = [
    { label: 'A', value: 1 },
    { label: 'B', value: 2 },
  ];
  ctrl = new FormControl<number | null>(null);
  sel = viewChild.required(NgnSelect);
}

@Component({
  imports: [ReactiveFormsModule, NgnSwitch, NgnSelect],
  template: `
    <form [formGroup]="form">
      <ngn-switch formControlName="enabled" />
      <ngn-select [options]="opts" formControlName="choice" />
    </form>
  `,
})
class FormGroupHost {
  opts = [
    { label: 'A', value: 1 },
    { label: 'B', value: 2 },
  ];
  form = new FormGroup({
    enabled: new FormControl<boolean>(false, { nonNullable: true }),
    choice: new FormControl<number | null>(null),
  });
  sw = viewChild.required(NgnSwitch);
  sel = viewChild.required(NgnSelect);
}

describe('classic forms interop (FormValueControl, no CVA)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNgnControls(
          { theme: { preset: novaCoral }, disableAnimations: true },
          withDefaultIcons()
        ),
      ],
    });
  });

  it('reactive [formControl] binds both ways on ngn-switch', () => {
    const f = TestBed.createComponent(ReactiveSwitchHost);
    f.detectChanges();

    // control -> component
    f.componentInstance.ctrl.setValue(true);
    f.detectChanges();
    expect(f.componentInstance.sw().value()).toBe(true);

    // component -> control
    f.componentInstance.sw().value.set(false);
    f.detectChanges();
    expect(f.componentInstance.ctrl.value).toBe(false);
  });

  it('reactive [formControl] binds both ways on ngn-select', () => {
    const f = TestBed.createComponent(ReactiveSelectHost);
    f.detectChanges();

    // control -> component
    f.componentInstance.ctrl.setValue(2);
    f.detectChanges();
    expect(f.componentInstance.sel().value()).toBe(2);

    // component -> control
    f.componentInstance.sel().value.set(1);
    f.detectChanges();
    expect(f.componentInstance.ctrl.value).toBe(1);
  });

  it('formControlName inside a FormGroup binds custom controls', () => {
    const f = TestBed.createComponent(FormGroupHost);
    f.detectChanges();

    f.componentInstance.form.setValue({ enabled: true, choice: 2 });
    f.detectChanges();
    expect(f.componentInstance.sw().value()).toBe(true);
    expect(f.componentInstance.sel().value()).toBe(2);

    f.componentInstance.sw().value.set(false);
    f.componentInstance.sel().value.set(1);
    f.detectChanges();
    expect(f.componentInstance.form.value).toEqual({ enabled: false, choice: 1 });
  });
});
