import { InputSignal } from '@angular/core';

export interface InputfieldBase {
  label: InputSignal<string | null>;
  inputId: InputSignal<string | null> | InputSignal<string>;
}
