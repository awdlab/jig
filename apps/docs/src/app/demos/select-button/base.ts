import { Component } from '@angular/core';
import { AwdSelectButton } from '@awdlab/jig/select-button';

@Component({
  selector: 'jig-demo-select-button-base',
  imports: [AwdSelectButton],
  template: `<jig-select-button [options]="options" />`,
})
export class Demo_SelectButton_Base {
  protected readonly options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ] as const;
}
