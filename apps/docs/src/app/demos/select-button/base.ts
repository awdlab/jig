import { Component } from '@angular/core';
import { NgnSelectButton } from '@awdlab/jig/select-button';

@Component({
  selector: 'awd-demo-select-button-base',
  imports: [NgnSelectButton],
  template: `<awd-select-button [options]="options" />`,
})
export class Demo_SelectButton_Base {
  protected readonly options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ] as const;
}
