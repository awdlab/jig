import { Component } from '@angular/core';
import { AwdCheckbox } from '@awdlab/jig/checkbox';

@Component({
  selector: 'jig-demo-checkbox-base',
  imports: [AwdCheckbox],
  template: `<jig-checkbox />`,
})
export class Demo_Checkbox_Base {}
