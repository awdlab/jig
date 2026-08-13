import { NgComponentOutlet } from '@angular/common';
import { Component, effect, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { JigBreadcrumb } from '@awdlab/jig/breadcrumb';
import { JigTab, JigTabs } from '@awdlab/jig/tabs';
import { filter } from 'rxjs';

import { BreadcrumbService } from '../../../../frame/breadcrumb.service';
import { safeRoutePath } from '../../../routing';
import { Seo } from '../../../seo';
import { JigDocsSourceLink } from '../../source-link';
import { JigDocsPageSection } from '../section/section';
import { JigDocsToc } from '../toc/toc';

import type { TocEntry } from '../../../md/types';
import type { JigDocsTab, JigDocsTabPage } from '../../types';
import type { JigPassthrough } from '@awdlab/jig/base';
import type { BreadcrumbItem } from '@awdlab/jig/breadcrumb';

@Component({
  selector: 'jig-docs-page-tab-renderer',
  templateUrl: 'page-tab-renderer.html',
  imports: [
    JigDocsPageSection,
    JigDocsToc,
    JigTabs,
    JigTab,
    NgComponentOutlet,
    JigBreadcrumb,
    JigDocsSourceLink,
  ],
  host: {
    class: 'min-w-0 w-full h-full flex flex-col pt-[5.5rem]',
  },
})
export class JigDocsPageTabRenderer {
  private readonly _seo = inject(Seo);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _breadcrumb = inject(BreadcrumbService);
  protected readonly tab = this._activatedRoute.snapshot.data['tab'] as JigDocsTab | undefined;
  protected readonly page = this._activatedRoute.snapshot.data['page'] as JigDocsTabPage;

  private _first = true;

  protected readonly activeTab = signal(
    this.page.tabs.find(t => t.default)?.title || this.page.tabs[0]?.title || ''
  );

  /** Content headings per markdown tab, keyed by tab title. */
  private readonly _headingsByTab = signal<Record<string, TocEntry[]>>({});

  /** Headings of the currently-active tab — empty for non-markdown tabs. */
  protected readonly activeHeadings = computed(() => this._headingsByTab()[this.activeTab()] ?? []);

  protected setTabHeadings(title: string, headings: TocEntry[]) {
    this._headingsByTab.update(map => ({ ...map, [title]: headings }));
  }

  protected readonly tabPt: JigPassthrough<'tabs'> = {
    'headers-container': {
      $classes: 'me-2 md:me-8',
    },
    content: {
      $styles: {
        height: '100%',
        minHeight: '0',
      },
    },
  };

  protected readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    return [
      {
        id: this.tab ? safeRoutePath(this.tab.title) : 'all',
        label: this.tab ? this.tab.title : 'All Components',
      },
      {
        id: safeRoutePath(this.page.title),
        label: this.page.title,
      },
      {
        id: this.activeTab(),
        label: this.activeTab(),
      },
    ];
  });

  constructor() {
    const switchToTabFromUrl = () => {
      const tab = this._activatedRoute.snapshot.firstChild?.url[0]?.path || '';
      const activeTab = this.page.tabs.find(
        t => (t.default ? '' : safeRoutePath(t.title)) === tab
      )?.title;
      if (activeTab) {
        this.activeTab.set(activeTab);
      }
    };

    switchToTabFromUrl();
    this._router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        switchToTabFromUrl();
      });

    effect(() => {
      this._breadcrumb.set(this.breadcrumbItems());
    });

    effect(() => {
      const activeTab = this.activeTab();

      const tabTitle = this.tab ? ` ${this.tab.tabTitle || this.tab.title}` : '';
      this._seo.set({ title: `${this.page.title}${tabTitle}` });

      if (this._first) {
        this._first = false;
        return;
      }
      const tab = this.page.tabs.find(x => x.title === activeTab);
      void this._router.navigate([
        this.tab ? safeRoutePath(this.tab.title) : '',
        safeRoutePath(this.page.title),
        ...(tab?.default ? [] : [safeRoutePath(activeTab)]),
      ]);
    });
  }
}
