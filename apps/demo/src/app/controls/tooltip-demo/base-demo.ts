import { Component } from '@angular/core';
import { Button } from '@ngneers/controls/button';
import { Tooltip } from '@ngneers/controls/tooltip';

@Component({
  imports: [Button, Tooltip],
  selector: 'ngn-tooltip-base',
  template: `<ngn-button [ngnTooltip]="'Hello World!'">Hello</ngn-button>`,
})
export class Tooltip_Base_Component {}
