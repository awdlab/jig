import { Component, input } from '@angular/core';

import { JigDocsPlaygroundInputs } from './inputs/inputs';
import { JigDocsPlaygroundTokens } from './tokens/tokens';

import type { AnyJigBase } from '@awdlab/jig/base';

@Component({
  selector: 'jig-docs-playground',
  templateUrl: 'playground.html',
  styleUrl: 'playground.scss',
  imports: [JigDocsPlaygroundTokens, JigDocsPlaygroundInputs],
  // The docs shell is body-scrolled and the tab content is wrapped in inline
  // elements, so an `h-full` chain collapses (invisible) — the playground needs an
  // explicit height. It fills the viewport minus the chrome above it (topbar +
  // title + tabs header; more on mobile where the breadcrumb shows) so the page
  // itself never scrolls — overflow lives in the panels' internal scrollers.
  host: {
    class: 'h-[calc(100dvh_-_16rem)] py-2 pe-2 md:h-[calc(100dvh_-_13.5rem)] md:py-8 md:pe-8 flex',
  },
})
export class JigDocsPlayground {
  public readonly controls = input.required<
    {
      component: AnyJigBase | readonly AnyJigBase[];
      componentName: string;
    }[]
  >();
}
