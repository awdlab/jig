import { Component, effect, inject, computed } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgnBreadcrumb } from '@ngneers/controls/breadcrumb';
import { notNullish } from '@ngneers/controls/utils';

import { NgnDocsPageSection } from './section/section';
import { BreadcrumbService } from '../../../frame/breadcrumb.service';
import { safeRoutePath } from '../../routing';

import type { NgnDocsCategory, NgnDocsSinglePage } from '../types';
import type { BreadcrumbItem } from '@ngneers/controls/breadcrumb';

@Component({
  selector: 'ngn-docs-page-renderer',
  templateUrl: 'page-renderer.html',
  imports: [NgnDocsPageSection, NgnBreadcrumb],
  host: {
    class: 'min-w-0 w-full h-full flex flex-col pt-[5.5rem] pl-2 md:pl-8',
  },
})
export class NgnDocsPageRenderer {
  private readonly _title = inject(Title);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _breadcrumb = inject(BreadcrumbService);

  protected readonly category = this._activatedRoute.snapshot.data['category'] as
    NgnDocsCategory | undefined;
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

  constructor() {
    effect(() => {
      this._breadcrumb.set(this.breadcrumbItems());
    });
  }
}
