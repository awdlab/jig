import { Component, input } from '@angular/core';
import tablerAdjustments from '@iconify/icons-tabler/adjustments';
import tablerInfoCircle from '@iconify/icons-tabler/info-circle';
import { NgnIcon } from '@awdlab/jig/icon';
import { NgnTooltip } from '@awdlab/jig/tooltip';

import { NgnDocsPlaygroundComponentInputs } from './component-inputs/component-inputs';

import type { AnyNgnBase } from '@awdlab/jig/base';

@Component({
  selector: 'awd-docs-playground-inputs',
  templateUrl: 'inputs.html',
  imports: [NgnDocsPlaygroundComponentInputs, NgnIcon, NgnTooltip],
  host: { class: 'flex flex-col' },
})
export class NgnDocsPlaygroundInputs {
  protected readonly iconSliders = tablerAdjustments;
  protected readonly iconInfo = tablerInfoCircle;
  public readonly controls = input.required<
    {
      component: AnyNgnBase | readonly AnyNgnBase[];
      componentName: string;
    }[]
  >();

  protected readonly isArray = Array.isArray;
}
