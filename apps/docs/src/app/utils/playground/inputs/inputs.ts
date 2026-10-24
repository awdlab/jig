import { Component, input, signal } from '@angular/core';
import tablerAdjustments from '@iconify/icons-tabler/adjustments.js';
import tablerInfoCircle from '@iconify/icons-tabler/info-circle.js';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTooltip } from '@awdlab/jig/tooltip';

import { JigDocsPlaygroundComponentInputs } from './component-inputs/component-inputs';

import type { PlaygroundControl } from '../playground';

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
  public readonly controls = input.required<readonly PlaygroundControl[]>();

  protected readonly isArray = Array.isArray;
}
