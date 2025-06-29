import { Component } from '@angular/core';
import { ValueControlBase, valueControlBaseProvider } from '@ngneers/controls/api';
import { FormField } from '@ngneers/controls/form-field';

@Component({
  selector: 'ngn-text-field',
  templateUrl: './text-field.html',
  imports: [FormField],
  providers: [valueControlBaseProvider(TextField)],
})
export class TextField extends ValueControlBase<string> {
  public onInput(value: Event) {
    this.onChange((value.target as HTMLInputElement).value);
  }
}
