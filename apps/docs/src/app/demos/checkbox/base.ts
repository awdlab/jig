import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-checkbox-base',
  imports: [NgnCheckbox],
  template: `<ngn-checkbox />`,
})
export class Demo_Checkbox_Base {}
