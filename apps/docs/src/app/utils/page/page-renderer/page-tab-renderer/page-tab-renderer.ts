import { NgComponentOutlet } from '@angular/common';
import { Component, effect, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgnBreadcrumb } from '@ngneers/controls/breadcrumb';
import { NgnTab, NgnTabs } from '@ngneers/controls/tabs';
import { filter } from 'rxjs';

import { BreadcrumbService } from '../../../../frame/breadcrumb.service';
import { safeRoutePath } from '../../../routing';
import { NgnDocsPageSection } from '../section/section';
import { NgnDocsToc } from '../toc/toc';

import type { TocEntry } from '../../../md/types';
import type { NgnDocsTab, NgnDocsTabPage } from '../../types';
import type { NgnPassthrough } from '@ngneers/controls/base';
import type { BreadcrumbItem } from '@ngneers/controls/breadcrumb';

@Component({
  selector: 'ngn-docs-page-tab-renderer',
  templateUrl: 'page-tab-renderer.html',
  imports: [NgnDocsPageSection, NgnDocsToc, NgnTabs, NgnTab, NgComponentOutlet, NgnBreadcrumb],
  host: {
    class: 'min-w-0 w-full h-full flex flex-col pt-[5.5rem]',
  },
})
export class NgnDocsPageTabRenderer {
  private readonly _title = inject(Title);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _breadcrumb = inject(BreadcrumbService);
  protected readonly tab = this._activatedRoute.snapshot.data['tab'] as NgnDocsTab | undefined;
  protected readonly page = this._activatedRoute.snapshot.data['page'] as NgnDocsTabPage;

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

  protected readonly tabPt: NgnPassthrough<'tabs'> = {
    'headers-container': {
      $classes: 'mr-2 md:mr-8',
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
      this._title.setTitle(`${this.page.title}${tabTitle} - ngn-controls`);

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
