import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgnButton } from '@ngneers/controls/button';
import { NgnKbd } from '@ngneers/controls/kbd';

import { Seo } from '../utils/seo';

/**
 * Shown for any path the router cannot resolve. It renders inside the docs
 * shell, so the sidebar, search and theme picker stay available — the fastest
 * recovery is usually the navigation the reader already knows.
 */
@Component({
  selector: 'ngn-docs-not-found',
  templateUrl: 'not-found.html',
  styleUrl: 'not-found.scss',
  imports: [NgnButton, NgnKbd, RouterLink],
  host: {
    class: 'min-w-0 w-full h-full flex flex-col pt-[5.5rem]',
  },
})
export class NgnDocsNotFound {
  private readonly _router = inject(Router);

  /**
   * The requested path, split so the segment that failed to resolve can be
   * marked. Everything before the last segment usually exists — showing that
   * tells the reader whether they mistyped a page or a whole area.
   */
  protected readonly segments = computed(() => {
    const path = this._router.url.split(/[?#]/)[0] ?? '/';
    return path.split('/').filter(Boolean);
  });

  protected readonly searchShortcut = 'mod+k';

  constructor() {
    inject(Seo).set({
      title: 'Page not found',
      description: 'That page does not exist. Browse the components and guides instead.',
      noindex: true,
    });
  }
}
