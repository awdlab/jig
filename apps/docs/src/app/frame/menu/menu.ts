import { NgTemplateOutlet } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgnTemplate, templateTypesFn } from '@ngneers/controls/api/ng';

import { ALL_DOCS_PAGES } from '../../docs';
import { safeRoutePath } from '../../utils/routing';

type MenuItem = {
  title: string;
  link: string;
  children?: MenuItem[];
};

@Component({
  selector: 'ngn-docs-menu',
  templateUrl: 'menu.html',
  imports: [RouterLink, NgTemplateOutlet, NgnTemplate],
  host: { class: 'h-full min-h-0' },
})
export class NgnDocsMenu {
  public readonly isCompact = input<boolean>(false);
  protected readonly isOpen = signal(false);

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
        link: `/docs/${safeRoutePath(page.title)}`,
        children: page.pages.map(subpage => ({
          title: subpage.title,
          link: `/docs/${safeRoutePath(page.title)}/${safeRoutePath(subpage.title)}`,
        })),
      };
    } else {
      return {
        title: page.title,
        link: `/docs/${safeRoutePath(page.title)}`,
      };
    }
  });

  public toggle() {
    if (!this.isCompact()) {
      return;
    }
    this.isOpen.update(v => !v);
  }
}
