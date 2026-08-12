import { Component, input, signal } from '@angular/core';
import tablerAdjustments from '@iconify/icons-tabler/adjustments';
import tablerInfoCircle from '@iconify/icons-tabler/info-circle';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTooltip } from '@awdlab/jig/tooltip';

import { JigDocsPlaygroundComponentInputs } from './component-inputs/component-inputs';

import type { AnyJigBase } from '@awdlab/jig/base';

@Component({
  selector: 'jig-docs-playground-inputs',
  templateUrl: 'inputs.html',
  imports: [JigDocsPlaygroundComponentInputs, JigIcon, JigTooltip, JigInputField, JigInput],
  host: { class: 'flex flex-col' },
})
export class JigDocsPlaygroundInputs {
  protected readonly iconSliders = tablerAdjustments;
  protected readonly iconInfo = tablerInfoCircle;
  protected readonly filter = signal('');
  public readonly controls = input.required<
    {
      component: AnyJigBase | readonly AnyJigBase[];
      componentName: string;
    }[]
  >();

  protected readonly isArray = Array.isArray;
}
