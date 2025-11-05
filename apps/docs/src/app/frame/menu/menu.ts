import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgnTemplate, templateTypesFn } from '@ngneers/controls/api/ng';

import { ALL_DOCS_PAGES } from '../../docs';
import { AppLocation } from '../../helper/app-location';
import { safeRoutePath } from '../../utils/routing';
import { FrameState } from '../frame-state';

type MenuItem = {
  title: string;
  link: string;
  children?: MenuItem[];
};

@Component({
  selector: 'ngn-docs-menu',
  templateUrl: 'menu.html',
  imports: [RouterLink, NgTemplateOutlet, NgnTemplate, RouterOutlet],
  host: { class: 'h-full min-h-0' },
  styleUrl: 'menu.scss',
})
export class NgnDocsMenu {
  private readonly _frameState = inject(FrameState);
  private readonly _appLocation = inject(AppLocation);

  public readonly isCompact = this._frameState.isCompact;
  protected readonly isOpen = this._frameState.menuOpen;

  protected readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: MenuItem;
      level: number;
    };
  }>();

  private readonly _docsPages = ALL_DOCS_PAGES;

  protected readonly menuItems: MenuItem[] = this._docsPages.map(page => {
    if (page.kind === 'category') {
      return {
        title: page.title,
        link: `/${safeRoutePath(page.title)}`,
        children: page.pages.map(subpage => ({
          title: subpage.title,
          link: `/${safeRoutePath(page.title)}/${safeRoutePath(subpage.title)}`,
        })),
      };
    } else {
      return {
        title: page.title,
        link: `/${safeRoutePath(page.title)}`,
      };
    }
  });

  protected readonly activeMenuItem = computed(() => {
    const location = this._appLocation.location();
    const items = this.menuItems;

    return findItem(items, location);
  });

  public toggle() {
    if (!this.isCompact()) {
      return;
    }
    this.isOpen.update(v => !v);
  }
}

function findItem(items: MenuItem[], routeParts: string[]): MenuItem | undefined {
  const currentPath = `/${routeParts.join('/')}`;

  for (const item of items) {
    if (item.link === currentPath) return item;
    if (item.children) {
      const found = findItem(item.children, routeParts);
      if (found) return found;
    }
  }

  return undefined;
}
