import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import tablerAdjustments from '@iconify/icons-tabler/adjustments';
import tablerInfoCircle from '@iconify/icons-tabler/info-circle';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnTooltip } from '@ngneers/controls/tooltip';

import { NgnDocsPlaygroundComponentInputs } from './component-inputs/component-inputs';

import type { AnyNgnBase } from '@ngneers/controls/base';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-playground-inputs',
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
