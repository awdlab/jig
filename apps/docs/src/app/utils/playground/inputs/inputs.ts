import { Component, input } from '@angular/core';
import tablerAdjustments from '@iconify/icons-tabler/adjustments';
import tablerInfoCircle from '@iconify/icons-tabler/info-circle';
import { AwdIcon } from '@awdlab/jig/icon';
import { AwdTooltip } from '@awdlab/jig/tooltip';

import { AwdDocsPlaygroundComponentInputs } from './component-inputs/component-inputs';

import type { AnyAwdBase } from '@awdlab/jig/base';

@Component({
  selector: 'jig-docs-playground-inputs',
  templateUrl: 'inputs.html',
  imports: [AwdDocsPlaygroundComponentInputs, AwdIcon, AwdTooltip],
  host: { class: 'flex flex-col' },
})
export class AwdDocsPlaygroundInputs {
  protected readonly iconSliders = tablerAdjustments;
  protected readonly iconInfo = tablerInfoCircle;
  public readonly controls = input.required<
    {
      component: AnyAwdBase | readonly AnyAwdBase[];
      componentName: string;
    }[]
  >();

  protected readonly isArray = Array.isArray;
}
