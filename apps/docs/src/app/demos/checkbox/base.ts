import { Component } from '@angular/core';
import { NgnCheckbox } from '@awdlab/jig/checkbox';

@Component({
  selector: 'awd-demo-checkbox-base',
  imports: [NgnCheckbox],
  template: `<awd-checkbox />`,
})
export class Demo_Checkbox_Base {}
