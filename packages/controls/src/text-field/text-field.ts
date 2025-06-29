import { Component, input } from '@angular/core';
import { generateElementId } from '@ngneers/controls/utils';

@Component({
  selector: 'ngn-text-field',
  templateUrl: './text-field.html',
})
export class TextField {
  public readonly label = input<string | null>(null);
  public readonly inputId = input<string>(generateElementId());
}
