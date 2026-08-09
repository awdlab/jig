import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import tablerMenu2 from '@iconify/icons-tabler/menu-2';
import tablerSearch from '@iconify/icons-tabler/search';
import { AwdBreadcrumb } from '@awdlab/jig/breadcrumb';
import { AwdButton } from '@awdlab/jig/button';
import { AwdIcon } from '@awdlab/jig/icon';
import {
  ariaKeyShortcuts,
  formatShortcut,
  AwdKeyboardShortcut,
  type AwdShortcutBinding,
} from '@awdlab/jig/kbd';

import { AppLocation } from '../../helper/app-location';
import { DocsSearch, AwdDocsSearchDialog } from '../../utils/search';
import { BreadcrumbService } from '../breadcrumb.service';
import { FrameState } from '../frame-state';
import { AwdDocsTopbarActions } from './actions';

const SEARCH_SHORTCUT = 'mod+k';

@Component({
  selector: 'jig-docs-topbar',
  templateUrl: 'topbar.html',
  styleUrl: 'topbar.scss',
  imports: [
    AwdButton,
    AwdDocsSearchDialog,
    AwdDocsTopbarActions,
    AwdIcon,
    AwdKeyboardShortcut,
    RouterLink,
    AwdBreadcrumb,
  ],
})
export class AwdDocsTopbar {
  protected readonly iconBars = tablerMenu2;
  protected readonly iconSearch = tablerSearch;
  protected readonly searchOpen = signal(false);
  private readonly _frameState = inject(FrameState);
  private readonly _appLocation = inject(AppLocation);
  private readonly _breadcrumb = inject(BreadcrumbService);
  private readonly _search = inject(DocsSearch);

  protected readonly isDocsPage = computed(() => this._appLocation.location().length > 0);
  protected readonly breadcrumbItems = this._breadcrumb.items;

  /** Page-wide, so the palette opens from anywhere and not just from the topbar. */
  protected readonly searchShortcut = computed<AwdShortcutBinding[]>(() => [
    { shortcut: SEARCH_SHORTCUT, callback: () => this.searchOpen.set(true), global: true },
  ]);
  protected readonly searchLabel = computed(
    () => `Search the docs (${formatShortcut(SEARCH_SHORTCUT)})`
  );
  protected readonly searchAriaShortcut = ariaKeyShortcuts(SEARCH_SHORTCUT);

  constructor() {
    // Clear the breadcrumb off docs routes — the page renderers won't.
    effect(() => {
      if (!this.isDocsPage()) {
        this._breadcrumb.clear();
      }
    });
  }

  protected toggleMenu() {
    this._frameState.menuOpen.update(v => !v);
  }

  /** Fetches the index and model ahead of the first keystroke. */
  protected warmSearch() {
    this._search.prefetch();
  }
}
