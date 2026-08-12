import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigMaskInput } from '@awdlab/jig/mask-input';

@Component({
  selector: 'jig-demo-input-field-required',
  imports: [FormsModule, ReactiveFormsModule, FormField, JigInput, JigInputField, JigMaskInput],
  host: {
    style: 'display: flex; flex-direction: column; gap: 1rem; max-width: 18rem;',
  },
  template: `
    <jig-input-field [label]="'Reactive'" [showRequiredMarker]="true">
      <input jigInput [formControl]="reactive" />
    </jig-input-field>

    <jig-input-field [label]="'Template-driven'" [showRequiredMarker]="true">
      <input jigInput name="city" required [(ngModel)]="city" />
    </jig-input-field>

    <jig-input-field [label]="'Signal forms'" [showRequiredMarker]="true">
      <input jigInput [formField]="signalForm.email" />
    </jig-input-field>

    <jig-input-field [label]="'Projected mask-input'" [showRequiredMarker]="true">
      <jig-mask-input mask="date" [formControl]="birthday" />
    </jig-input-field>

    <jig-input-field [label]="'Optional'" [showRequiredMarker]="true">
      <input jigInput />
    </jig-input-field>
  `,
})
export class Demo_InputField_Required {
  protected readonly reactive = new FormControl('', { validators: [Validators.required] });
  protected readonly birthday = new FormControl<string | null>(null, {
    validators: [Validators.required],
  });
  protected city = '';
  protected readonly model = signal({ email: '' });
  protected readonly signalForm = form(this.model, path => required(path.email));
}
