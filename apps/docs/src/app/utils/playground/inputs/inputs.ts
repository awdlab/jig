import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { AnyNgnBase } from '@ngneers/controls/base';

import { NgnDocsPlaygroundComponentInputs } from './component-inputs/component-inputs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-playground-inputs',
  templateUrl: 'inputs.html',
  imports: [NgnDocsPlaygroundComponentInputs],
  host: { class: 'flex flex-col' },
})
export class NgnDocsPlaygroundInputs {
  public readonly controls = input.required<
    {
      component: AnyNgnBase | readonly AnyNgnBase[];
      componentName: string;
    }[]
  >();
}
