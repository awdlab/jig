import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgnTab, NgnTabs } from '@ngneers/controls/tabs';

import { safeRoutePath } from '../../../routing';
import { NgnDocsTabPage } from '../../types';
import { NgnDocsPageSection } from '../section/section';

@Component({
  selector: 'ngn-docs-page-tab-renderer',
  templateUrl: 'page-tab-renderer.html',
  imports: [NgnDocsPageSection, NgnTabs, NgnTab],
})
export class NgnDocsPageTabRenderer {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  protected readonly page = this._activatedRoute.snapshot.data['page'] as NgnDocsTabPage;

  private _first = true;

  protected readonly activeTab = signal(
    this.page.tabs.find(t => t.default)?.title || this.page.tabs[0].title
  );

  constructor() {
    this._activatedRoute.url.subscribe(() => {
      const tab = this._activatedRoute.snapshot.firstChild?.url[0]?.path || '';
      const activeTab = this.page.tabs.find(
        t => (t.default ? '' : safeRoutePath(t.title)) === tab
      )?.title;
      if (activeTab) {
        this.activeTab.set(activeTab);
      }
    });

    effect(() => {
      const activeTab = this.activeTab();
      if (this._first) {
        this._first = false;
        return;
      }
      const tab = this.page.tabs.find(x => x.title === activeTab);
      this._router.navigate([
        'docs',
        safeRoutePath(this.page.title),
        ...(tab?.default ? [] : [safeRoutePath(activeTab)]),
      ]);
    });
  }
}
