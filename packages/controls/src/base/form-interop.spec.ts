import { Component, Directive, ElementRef, signal, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import {
  type AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NgModel,
  ReactiveFormsModule,
  type ValidationErrors,
  type Validator,
  Validators,
} from '@angular/forms';
import { FormField, form, required } from '@angular/forms/signals';
import { provideJigControls } from '@awdlab/jig/api/ng';
import { withDefaultIcons } from '@awdlab/jig/default-icons';
import { JigInput } from '@awdlab/jig/input';
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

// `jigInput` sits on a native element, so classic forms drive it through
// Angular's `DefaultValueAccessor`. The directive mirrors that control's value
// into its own model instead of writing its (empty) model back over it.
@Component({
  imports: [ReactiveFormsModule, JigInput],
  template: `<input jigInput [formControl]="ctrl" />`,
})
class ReactiveInputHost {
  ctrl = new FormControl('Ada', { nonNullable: true });
  input = viewChild.required(JigInput);
  element = viewChild.required(JigInput, { read: ElementRef<HTMLInputElement> });
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

  it('reactive [formControl] keeps a pre-filled value on jig-input', () => {
    const f = TestBed.createComponent(ReactiveInputHost);
    f.detectChanges();

    expect(f.componentInstance.element().nativeElement.value).toBe('Ada');
    expect(f.componentInstance.input().value()).toBe('Ada');

    f.componentInstance.ctrl.setValue('Grace');
    f.detectChanges();
    expect(f.componentInstance.element().nativeElement.value).toBe('Grace');
    expect(f.componentInstance.input().value()).toBe('Grace');
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

// Validator directives on a `FormValueControl` host are dropped by Angular's
// custom-control path (angular/angular#69756); `ValueControlBase` merges them back.

@Component({
  imports: [FormsModule, JigSelect],
  template: `
    <form>
      <jig-select name="choice" [options]="opts" [(ngModel)]="choice" [required]="req()" />
    </form>
  `,
})
class TemplateSelectHost {
  opts = [
    { label: 'A', value: 1 },
    { label: 'B', value: 2 },
  ];
  choice = signal<number | null>(null);
  req = signal(true);
  model = viewChild.required(NgModel);
}

// Reactive hosts use a custom validator directive: on `[formControl]` /
// `formControlName` Angular also writes its own `required` binding back into
// `RequiredValidator`, which switches a static `required` attribute off.
@Directive({
  selector: '[forbidEmpty]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ForbidEmpty, multi: true }],
})
class ForbidEmpty implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return control.value == null ? { empty: true } : null;
  }
}

@Component({
  imports: [ReactiveFormsModule, JigSelect, ForbidEmpty],
  template: `
    <form [formGroup]="form">
      <jig-select [options]="opts" formControlName="choice" forbidEmpty />
    </form>
  `,
})
class ReactiveAttrValidatorHost {
  opts = [{ label: 'A', value: 1 }];
  form = new FormGroup({ choice: new FormControl<number | null>(null) });
}

@Component({
  imports: [ReactiveFormsModule, JigSelect, ForbidEmpty],
  template: `
    @if (show()) {
      <jig-select [options]="opts" [formControl]="ctrl" forbidEmpty />
    }
  `,
})
class ReactiveToggleHost {
  opts = [{ label: 'A', value: 1 }];
  ctrl = new FormControl<number | null>(null);
  show = signal(true);
}

@Component({
  imports: [ReactiveFormsModule, JigSelect],
  template: `<jig-select [options]="opts" [formControl]="ctrl" />`,
})
class ReactiveOwnValidatorHost {
  opts = [{ label: 'A', value: 1 }];
  ctrl = new FormControl<number | null>(null, Validators.required);
}

@Component({
  imports: [FormField, JigSelect],
  template: `<jig-select [options]="opts" [formField]="f.choice" />`,
})
class SignalSelectHost {
  opts = [{ label: 'A', value: 1 }];
  model = signal<{ choice: number | null }>({ choice: null });
  f = form(this.model, path => required(path.choice));
  sel = viewChild.required(JigSelect);
}

@Component({
  imports: [FormsModule, JigInput],
  template: `<form><input jigInput name="name" [(ngModel)]="name" required /></form>`,
})
class TemplateInputHost {
  name = signal('');
  element = viewChild.required(JigInput, { read: ElementRef<HTMLInputElement> });
}

async function settle(f: ComponentFixture<unknown>): Promise<void> {
  f.detectChanges();
  await f.whenStable();
  f.detectChanges();
}

describe('classic forms validator directives on FormValueControl (angular#69756)', () => {
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

  it('applies `required` on an ngModel-bound jig-select and follows `[required]` changes', async () => {
    const f = TestBed.createComponent(TemplateSelectHost);
    await settle(f);
    const control = f.componentInstance.model().control;
    expect(control.errors).toEqual({ required: true });

    f.componentInstance.choice.set(2);
    await settle(f);
    expect(control.errors).toBeNull();

    f.componentInstance.choice.set(null);
    await settle(f);
    expect(control.errors).toEqual({ required: true });

    f.componentInstance.req.set(false);
    await settle(f);
    expect(control.errors).toBeNull();
  });

  it('applies a validator directive next to formControlName', async () => {
    const f = TestBed.createComponent(ReactiveAttrValidatorHost);
    await settle(f);
    expect(f.componentInstance.form.controls.choice.errors).toEqual({ empty: true });
    expect(f.componentInstance.form.valid).toBe(false);
  });

  it('removes the directive validator when the control is destroyed', async () => {
    const f = TestBed.createComponent(ReactiveToggleHost);
    await settle(f);
    expect(f.componentInstance.ctrl.errors).toEqual({ empty: true });

    f.componentInstance.show.set(false);
    await settle(f);
    expect(f.componentInstance.ctrl.errors).toBeNull();
  });

  it('leaves a reactive control without validator directives untouched', async () => {
    const f = TestBed.createComponent(ReactiveOwnValidatorHost);
    const before = f.componentInstance.ctrl.validator;
    await settle(f);
    expect(f.componentInstance.ctrl.validator).toBe(before);
    expect(f.componentInstance.ctrl.errors).toEqual({ required: true });
  });

  it('leaves signal forms validation to the schema', async () => {
    const f = TestBed.createComponent(SignalSelectHost);
    await settle(f);
    expect(f.componentInstance.f.choice().invalid()).toBe(true);
    expect(f.componentInstance.sel().invalid()).toBe(true);

    f.componentInstance.model.set({ choice: 1 });
    await settle(f);
    expect(f.componentInstance.f.choice().invalid()).toBe(false);
    expect(f.componentInstance.sel().invalid()).toBe(false);
  });
});

describe('jigInput invalid state under classic forms', () => {
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

  it('sets aria-invalid from the bound ngModel once touched', async () => {
    const f = TestBed.createComponent(TemplateInputHost);
    await settle(f);
    const el = f.componentInstance.element().nativeElement;
    expect(el.getAttribute('aria-invalid')).toBeNull();

    el.dispatchEvent(new Event('blur'));
    await settle(f);
    expect(el.getAttribute('aria-invalid')).toBe('true');

    el.value = 'Ada';
    el.dispatchEvent(new Event('input'));
    await settle(f);
    expect(el.getAttribute('aria-invalid')).toBeNull();
  });
});
