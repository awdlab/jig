import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import tablerBrandGithub from '@iconify/icons-tabler/brand-github';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigTooltip } from '@awdlab/jig/tooltip';

import { safeRoutePath } from '../routing';

import type { JigDocsPage, JigDocsTab } from './types';

const CONTROLS_SRC = 'https://github.com/awdlab/jig/tree/main/packages/controls/src';

/**
 * Links a component page to the control's sources on GitHub. Renders nothing
 * outside the Components tab.
 */
@Component({
  selector: 'jig-docs-source-link',
  imports: [JigButton, JigIcon, JigTooltip],
  template: `
    @if (href) {
      <a
        jigButton
        kind="icon"
        target="_blank"
        rel="noreferrer"
        jigTooltip="View source on GitHub"
        aria-label="View source on GitHub"
        [href]="href"
      >
        <jig-icon size="24px" [icon]="iconGithub" />
      </a>
    }
  `,
})
export class JigDocsSourceLink {
  private readonly _route = inject(ActivatedRoute);
  private readonly _tab = this._route.snapshot.data['tab'] as JigDocsTab | undefined;
  private readonly _page = this._route.snapshot.data['page'] as JigDocsPage;

  protected readonly iconGithub = tablerBrandGithub;

  protected readonly href =
    this._tab?.title === 'Components'
      ? `${CONTROLS_SRC}/${this._page.source ?? safeRoutePath(this._page.title)}`
      : null;
}
