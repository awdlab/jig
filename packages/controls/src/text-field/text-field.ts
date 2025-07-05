import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import {
  injectThemeTemplate,
  ValueControlBase,
  valueControlBaseProvider,
} from '@ngneers/controls/api';
import { Inputfield } from '@ngneers/controls/input-field';
import { textFieldControlTemplate } from '@ngneers/controls-themes/templates/text-field';

@Component({
  selector: 'ngn-text-field',
  templateUrl: './text-field.html',
  imports: [NgClass, Inputfield],
  providers: [valueControlBaseProvider(TextField)],
})
export class TextField extends ValueControlBase<string> {
  protected readonly theme = injectThemeTemplate(textFieldControlTemplate);
  public onInput(value: Event) {
    this.onChange((value.target as HTMLInputElement).value);
  }
}
