import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { NgnDocsPlaygroundInputs } from './inputs/inputs';
import { NgnDocsPlaygroundTokens } from './tokens/tokens';

import type { AnyNgnBase } from '@ngneers/controls/base';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-playground',
  templateUrl: 'playground.html',
  styleUrl: 'playground.scss',
  imports: [NgnDocsPlaygroundTokens, NgnDocsPlaygroundInputs],
  host: { class: 'h-full py-2 pr-2 md:py-8 md:pr-8 flex' },
})
export class NgnDocsPlayground {
  public readonly controls = input.required<
    {
      component: AnyNgnBase | readonly AnyNgnBase[];
      componentName: string;
    }[]
  >();
}
