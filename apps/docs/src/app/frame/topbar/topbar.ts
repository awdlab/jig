import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import tablerMenu2 from '@iconify/icons-tabler/menu-2';
import tablerSearch from '@iconify/icons-tabler/search';
import { NgnBreadcrumb } from '@awdlab/jig/breadcrumb';
import { NgnButton } from '@awdlab/jig/button';
import { NgnIcon } from '@awdlab/jig/icon';
import {
  ariaKeyShortcuts,
  formatShortcut,
  NgnKeyboardShortcut,
  type NgnShortcutBinding,
} from '@awdlab/jig/kbd';

import { AppLocation } from '../../helper/app-location';
import { DocsSearch, NgnDocsSearchDialog } from '../../utils/search';
import { BreadcrumbService } from '../breadcrumb.service';
import { FrameState } from '../frame-state';
import { NgnDocsTopbarActions } from './actions';

const SEARCH_SHORTCUT = 'mod+k';

@Component({
  selector: 'awd-docs-topbar',
  templateUrl: 'topbar.html',
  styleUrl: 'topbar.scss',
  imports: [
    NgnButton,
    NgnDocsSearchDialog,
    NgnDocsTopbarActions,
    NgnIcon,
    NgnKeyboardShortcut,
    RouterLink,
    NgnBreadcrumb,
  ],
})
export class NgnDocsTopbar {
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
  protected readonly searchShortcut = computed<NgnShortcutBinding[]>(() => [
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
