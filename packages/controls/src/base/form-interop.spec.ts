import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideJigControls } from '@awdlab/jig/api/ng';
import { withDefaultIcons } from '@awdlab/jig/default-icons';
import { JigSelect } from '@awdlab/jig/select';
import { JigSwitch } from '@awdlab/jig/switch';
import { nova } from '@awdlab/jig-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

// These controls implement Angular's Signal-Forms `FormValueControl` (via
// `ValueControlBase`) and NO `ControlValueAccessor`. On Angular 22 the classic
// Reactive/Template-Driven forms bind to such controls as-is — this spec is the
// executable proof (and guards against a regression that would force a CVA).

@Component({
  imports: [ReactiveFormsModule, JigSwitch],
  template: `<jig-switch [formControl]="ctrl" />`,
})
class ReactiveSwitchHost {
  ctrl = new FormControl<boolean>(false, { nonNullable: true });
  sw = viewChild.required(JigSwitch);
}

@Component({
  imports: [ReactiveFormsModule, JigSelect],
  template: `<jig-select [options]="opts" [formControl]="ctrl" />`,
})
class ReactiveSelectHost {
  opts = [
    { label: 'A', value: 1 },
    { label: 'B', value: 2 },
  ];
  ctrl = new FormControl<number | null>(null);
  sel = viewChild.required(JigSelect);
}

@Component({
  imports: [ReactiveFormsModule, JigSwitch, JigSelect],
  template: `
    <form [formGroup]="form">
      <jig-switch formControlName="enabled" />
      <jig-select [options]="opts" formControlName="choice" />
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
  sw = viewChild.required(JigSwitch);
  sel = viewChild.required(JigSelect);
}

describe('classic forms interop (FormValueControl, no CVA)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideJigControls(
          { theme: { preset: nova }, disableAnimations: true },
          withDefaultIcons()
        ),
      ],
    });
  });

  it('reactive [formControl] binds both ways on jig-switch', () => {
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

  it('reactive [formControl] binds both ways on jig-select', () => {
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
