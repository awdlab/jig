import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbItem, NgnBreadcrumb } from '@ngneers/controls/breadcrumb';
import { notNullish } from '@ngneers/controls/utils';

import { NgnDocsCategory, NgnDocsSinglePage } from '../types';
import { NgnDocsPageSection } from './section/section';
import { safeRoutePath } from '../../routing';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-page-renderer',
  templateUrl: 'page-renderer.html',
  imports: [NgnDocsPageSection, NgnBreadcrumb],
  host: {
    class: 'min-w-0 w-full h-full flex flex-col pt-2 pl-2 md:pt-8 md:pl-8',
  },
})
export class NgnDocsPageRenderer {
  private readonly _title = inject(Title);
  private readonly _activatedRoute = inject(ActivatedRoute);

  protected readonly category = this._activatedRoute.snapshot.data['category'] as
    | NgnDocsCategory
    | undefined;
  protected readonly page = this._activatedRoute.snapshot.data['page'] as NgnDocsSinglePage;

  protected readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    return [
      this.category?.title
        ? {
            id: this.category ? safeRoutePath(this.category.title) : 'all',
            label: this.category.title,
          }
        : null,
      {
        id: safeRoutePath(this.page.title),
        label: this.page.title,
      },
    ].filter(notNullish);
  });
}
