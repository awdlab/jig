import { Component, effect, inject, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgnBreadcrumb } from '@ngneers/controls/breadcrumb';
import { notNullish } from '@ngneers/controls/utils';

import { NgnDocsPageSection } from './section/section';
import { NgnDocsToc } from './toc/toc';
import { BreadcrumbService } from '../../../frame/breadcrumb.service';
import { safeRoutePath } from '../../routing';
import { Seo } from '../../seo';

import type { TocEntry } from '../../md/types';
import type { NgnDocsSinglePage, NgnDocsTab } from '../types';
import type { BreadcrumbItem } from '@ngneers/controls/breadcrumb';

@Component({
  selector: 'ngn-docs-page-renderer',
  templateUrl: 'page-renderer.html',
  imports: [NgnDocsPageSection, NgnDocsToc, NgnBreadcrumb],
  host: {
    class: 'min-w-0 w-full h-full flex flex-col pt-[5.5rem]',
  },
})
export class NgnDocsPageRenderer {
  private readonly _seo = inject(Seo);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _breadcrumb = inject(BreadcrumbService);

  protected readonly tab = this._activatedRoute.snapshot.data['tab'] as NgnDocsTab | undefined;
  protected readonly page = this._activatedRoute.snapshot.data['page'] as NgnDocsSinglePage;

  /** Content headings for the "on this page" rail, emitted by the section. */
  protected readonly headings = signal<TocEntry[]>([]);

  protected readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    return [
      this.tab?.title
        ? {
            id: this.tab ? safeRoutePath(this.tab.title) : 'all',
            label: this.tab.title,
          }
        : null,
      {
        id: safeRoutePath(this.page.title),
        label: this.page.title,
      },
    ].filter(notNullish);
  });

  constructor() {
    effect(() => {
      this._breadcrumb.set(this.breadcrumbItems());
    });

    effect(() => {
      const tabTitle = this.tab ? ` ${this.tab.tabTitle || this.tab.title}` : '';
      this._seo.set({ title: `${this.page.title}${tabTitle}` });
    });
  }
}
