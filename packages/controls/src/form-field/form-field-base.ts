import { InputSignal } from '@angular/core';

export interface FormFieldBase {
  label: InputSignal<string | null>;
  inputId: InputSignal<string | null> | InputSignal<string>;
}
