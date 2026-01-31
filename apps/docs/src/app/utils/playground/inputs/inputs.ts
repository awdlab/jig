import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { AnyNgnBase } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnTooltip } from '@ngneers/controls/tooltip';

import { NgnDocsPlaygroundComponentInputs } from './component-inputs/component-inputs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-playground-inputs',
  templateUrl: 'inputs.html',
  imports: [NgnDocsPlaygroundComponentInputs, NgnIcon, NgnTooltip],
  host: { class: 'flex flex-col' },
})
export class NgnDocsPlaygroundInputs {
  public readonly controls = input.required<
    {
      component: AnyNgnBase | readonly AnyNgnBase[];
      componentName: string;
    }[]
  >();

  protected readonly isArray = Array.isArray;
}
