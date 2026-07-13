import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgnTemplate, templateTypesFn } from '@ngneers/controls/api/ng';
import { NgnDrawer } from '@ngneers/controls/drawer';
import { NgnSelectButton } from '@ngneers/controls/select-button';

import { ALL_DOCS_TABS } from '../../docs';
import { AppLocation } from '../../helper/app-location';
import { safeRoutePath } from '../../utils/routing';
import { FrameState } from '../frame-state';

import type { NgnPassthrough } from '@ngneers/controls/base';

type MenuLink = {
  title: string;
  link: string;
};

type MenuGroup = {
  title: string;
  items: MenuLink[];
};

type MenuTab = {
  title: string;
  /** First page of the tab — where the switcher navigates on select. */
  link: string;
  groups: MenuGroup[];
};

@Component({
  selector: 'ngn-docs-menu',
  templateUrl: 'menu.html',
  imports: [RouterLink, RouterOutlet, NgTemplateOutlet, NgnTemplate, NgnDrawer, NgnSelectButton],
  host: { class: 'h-full min-h-0' },
  styleUrl: 'menu.scss',
})
export class NgnDocsMenu {
  private readonly _frameState = inject(FrameState);
  private readonly _appLocation = inject(AppLocation);
  private readonly _router = inject(Router);

  public readonly isCompact = this._frameState.isCompact;
  protected readonly isOpen = this._frameState.menuOpen;

  protected readonly templateTypes = templateTypesFn<{
    group: {
      $implicit: MenuGroup;
    };
  }>();

  protected readonly tabs: MenuTab[] = ALL_DOCS_TABS.map(tab => {
    const base = `/${safeRoutePath(tab.title)}`;
    const groups = tab.groups.map(group => ({
      title: group.title,
      items: group.pages.map(page => ({
        title: page.title,
        link: `${base}/${safeRoutePath(page.title)}`,
      })),
    }));
    return {
      title: tab.title,
      link: groups[0]?.items[0]?.link ?? base,
      groups,
    };
  });

  /** Options for the vertical tab switcher (select-button). */
  protected readonly tabOptions = this.tabs.map(tab => ({
    label: tab.title,
    value: tab.title,
  }));

  /**
   * Deep passthrough: stretch the vertical tab switcher to fill the sidebar
   * width instead of hugging its widest label. Reaches the nested button-group
   * container (`group`) and each toggle-button's host + inner button (`button`)
   * via their dependency slots — stable object so the passthrough engine does
   * not re-apply on every change detection.
   */
  protected readonly switcherPt: NgnPassthrough<'selectButton'> = {
    // The button-group host is already full width; its inner vertical flex
    // container is `width: fit-content`, so stretch that. Then stretch each
    // toggle-button's host and its inline-grid inner button to match.
    group: { vertical: { $styles: { width: '100%' } } },
    button: {
      root: { $styles: { width: '100%' } },
      button: { $styles: { width: '100%' } },
    },
  };

  /** The tab whose first URL segment matches the current location. */
  protected readonly activeTab = computed<MenuTab | undefined>(() => {
    const segment = this._appLocation.location()[0];
    return this.tabs.find(tab => tab.link.startsWith(`/${segment}/`)) ?? this.tabs[0];
  });

  protected readonly activeTabTitle = computed(() => this.activeTab()?.title ?? '');

  protected readonly activeLink = computed(() => `/${this._appLocation.location().join('/')}`);

  /**
   * A menu link is active for its own page and any sub-route of it (e.g. the
   * `/api` / `/accessibility` tab segments) — not just the exact examples URL.
   */
  protected isActiveLink(link: string): boolean {
    const current = this.activeLink();
    return current === link || current.startsWith(`${link}/`);
  }

  protected onTabChange(title: string): void {
    const tab = this.tabs.find(t => t.title === title);
    if (tab) {
      this.isOpen.set(false);
      this._router.navigateByUrl(tab.link).catch(() => {
        /* navigation cancelled/failed — nothing to recover */
      });
    }
  }

  public toggle() {
    if (!this.isCompact()) {
      return;
    }
    this.isOpen.update(v => !v);
  }
}
