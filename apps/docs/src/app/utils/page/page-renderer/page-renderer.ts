import { Component, effect, inject, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JigBreadcrumb } from '@awdlab/jig/breadcrumb';
import { notNullish } from '@awdlab/jig/utils';

import { JigDocsPageSection } from './section/section';
import { JigDocsToc } from './toc/toc';
import { BreadcrumbService } from '../../../frame/breadcrumb.service';
import { safeRoutePath } from '../../routing';
import { Seo } from '../../seo';

import type { TocEntry } from '../../md/types';
import type { JigDocsSinglePage, JigDocsTab } from '../types';
import type { BreadcrumbItem } from '@awdlab/jig/breadcrumb';

@Component({
  selector: 'jig-docs-page-renderer',
  templateUrl: 'page-renderer.html',
  imports: [JigDocsPageSection, JigDocsToc, JigBreadcrumb],
  host: {
    class: 'min-w-0 w-full h-full flex flex-col pt-[5.5rem]',
  },
})
export class JigDocsPageRenderer {
  private readonly _seo = inject(Seo);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _breadcrumb = inject(BreadcrumbService);

  protected readonly tab = this._activatedRoute.snapshot.data['tab'] as JigDocsTab | undefined;
  protected readonly page = this._activatedRoute.snapshot.data['page'] as JigDocsSinglePage;

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
