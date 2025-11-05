import { Component, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgnTab, NgnTabs } from '@ngneers/controls/tabs';

import { safeRoutePath } from '../../../routing';
import { NgnDocsCategory, NgnDocsTabPage } from '../../types';
import { NgnDocsPageSection } from '../section/section';

@Component({
  selector: 'ngn-docs-page-tab-renderer',
  templateUrl: 'page-tab-renderer.html',
  imports: [NgnDocsPageSection, NgnTabs, NgnTab],
  host: {
    class: 'min-w-0 w-full',
  },
})
export class NgnDocsPageTabRenderer {
  private readonly _title = inject(Title);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  protected readonly category = this._activatedRoute.snapshot.data['category'] as
    | NgnDocsCategory
    | undefined;
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

      const categoryTitle = this.category
        ? ` ${this.category.tabTitle || this.category.title}`
        : '';
      this._title.setTitle(`${this.page.title}${categoryTitle} - ngn-controls`);

      if (this._first) {
        this._first = false;
        return;
      }
      const tab = this.page.tabs.find(x => x.title === activeTab);
      this._router.navigate([
        this.category ? safeRoutePath(this.category.title) : '',
        safeRoutePath(this.page.title),
        ...(tab?.default ? [] : [safeRoutePath(activeTab)]),
      ]);
    });
  }
}
