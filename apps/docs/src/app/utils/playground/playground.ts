import { Component, input } from '@angular/core';

import { NgnDocsPlaygroundInputs } from './inputs/inputs';
import { NgnDocsPlaygroundTokens } from './tokens/tokens';

import type { AnyNgnBase } from '@ngneers/controls/base';

@Component({
  selector: 'ngn-docs-playground',
  templateUrl: 'playground.html',
  styleUrl: 'playground.scss',
  imports: [NgnDocsPlaygroundTokens, NgnDocsPlaygroundInputs],
  // The docs shell is body-scrolled and the tab content is wrapped in inline
  // elements, so an `h-full` chain collapses (invisible) — the playground needs an
  // explicit height. It fills the viewport minus the chrome above it (topbar +
  // title + tabs header; more on mobile where the breadcrumb shows) so the page
  // itself never scrolls — overflow lives in the panels' internal scrollers.
  host: {
    class: 'h-[calc(100dvh_-_16rem)] py-2 pr-2 md:h-[calc(100dvh_-_13.5rem)] md:py-8 md:pr-8 flex',
  },
})
export class NgnDocsPlayground {
  public readonly controls = input.required<
    {
      component: AnyNgnBase | readonly AnyNgnBase[];
      componentName: string;
    }[]
  >();
}
