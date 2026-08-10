import { signal } from '@angular/core';

/**
 * An item managed by a {@link NotificationRegionController} — a single snackbar or
 * toast. The controller drives focus and timer state through this narrow contract.
 */
export interface NotificationRegionItem {
  /** Move DOM focus to this item's root element. */
  focus(): void;
  /** Freeze the auto-hide timer because the region as a whole holds focus. */
  regionPause(): void;
  /** Release the region-level freeze; the item resumes unless still hovered/focused. */
  regionResume(): void;
}

/**
 * Keyboard-accessibility controller for a stack of transient notifications
 * (snackbars / toasts) rendered inside a single host region.
 *
 * Implements the WAI-ARIA APG guidance for toasts: focus is never stolen when a
 * notification appears, but a global hotkey (`F6`) lets the user jump into the
 * region on demand. Within the region, a roving-tabindex model exposes exactly one
 * item to the Tab sequence while `ArrowUp`/`ArrowDown`/`Home`/`End` move between
 * items. Whenever the region holds focus, every timer in it is paused so nothing
 * disappears mid-read.
 *
 * The host component owns the wiring: it forwards its events to the handlers here
 * and binds {@link tabbableIndex} to each item's `tabindex`.
 */
export class NotificationRegionController<T extends NotificationRegionItem> {
  private readonly _host: HTMLElement;
  private readonly _items: () => readonly T[];

  /** The item index currently exposed to the Tab sequence (roving tabindex). */
  public readonly activeIndex = signal(0);

  /**
   * @param host  The region's root element, used to scope focus containment checks.
   * @param items A getter returning the live, ordered list of items (oldest first).
   */
  constructor(host: HTMLElement, items: () => readonly T[]) {
    this._host = host;
    this._items = items;
  }

  /**
   * The roving tabindex target, clamped to the current item count so the region
   * always has exactly one tabbable entry point even after items are removed.
   */
  public tabbableIndex(): number {
    const count = this._items().length;
    return count === 0 ? -1 : Math.min(this.activeIndex(), count - 1);
  }

  /** Document-level handler: `F6` moves focus to the newest notification. */
  public handleGlobalKeydown(event: KeyboardEvent): void {
    if (event.key !== 'F6') {
      return;
    }
    const items = this._items();
    if (items.length === 0) {
      return;
    }
    event.preventDefault();
    this.focusIndex(items.length - 1);
  }

  /** Region-level handler: arrow / Home / End roving between notifications. */
  public handleKeydown(event: KeyboardEvent): void {
    const items = this._items();
    if (items.length === 0) {
      return;
    }
    const current = Math.min(this.activeIndex(), items.length - 1);
    let next: number;
    switch (event.key) {
      case 'ArrowDown':
        next = Math.min(current + 1, items.length - 1);
        break;
      case 'ArrowUp':
        next = Math.max(current - 1, 0);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = items.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.focusIndex(next);
  }

  /** Region gained focus (via hotkey, Tab, or click) — pause every timer in it. */
  public handleFocusIn(): void {
    for (const item of this._items()) {
      item.regionPause();
    }
  }

  /** Region lost focus to something outside it — resume every timer. */
  public handleFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this._host.contains(next)) {
      return;
    }
    for (const item of this._items()) {
      item.regionResume();
    }
  }

  private focusIndex(index: number): void {
    this.activeIndex.set(index);
    this._items()[index]?.focus();
  }
}
