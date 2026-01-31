import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { AnyNgnBase } from '@ngneers/controls/base';

import { NgnDocsPlaygroundInputs } from './inputs/inputs';
import { NgnDocsPlaygroundTokens } from './tokens/tokens';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-playground',
  templateUrl: 'playground.html',
  styleUrl: 'playground.scss',
  imports: [NgnDocsPlaygroundTokens, NgnDocsPlaygroundInputs],
  host: { class: 'h-full' },
})
export class NgnDocsPlayground {
  public readonly controls = input.required<
    {
      component: AnyNgnBase | readonly AnyNgnBase[];
      componentName: string;
    }[]
  >();
}
