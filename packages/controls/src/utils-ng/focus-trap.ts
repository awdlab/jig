const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

/** Visible, focusable descendants of `container`, in DOM order. */
function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0
  );
}

/**
 * Keeps keyboard focus inside a single container for the duration a modal
 * overlay is open. On {@link activate} it remembers what was focused, moves
 * focus into the container, and wraps `Tab`/`Shift+Tab` at the edges;
 * {@link deactivate} tears the listener down and restores the prior focus.
 *
 * The container itself is focused as a fallback when it has no focusable
 * children, so focus never escapes to the (inert) background.
 */
export class FocusTrap {
  private _previouslyFocused: HTMLElement | null = null;
  private _active = false;

  constructor(private readonly container: HTMLElement) {}

  public activate(): void {
    if (this._active) return;
    this._active = true;
    this._previouslyFocused = document.activeElement as HTMLElement | null;
    this.container.addEventListener('keydown', this._onKeydown);

    const focusable = getFocusable(this.container);
    const target = focusable[0] ?? this.container;
    if (target === this.container && !this.container.hasAttribute('tabindex')) {
      this.container.tabIndex = -1;
    }
    target.focus();
  }

  public deactivate(): void {
    if (!this._active) return;
    this._active = false;
    this.container.removeEventListener('keydown', this._onKeydown);
    // Restore focus only if it is still inside the trap — otherwise the user
    // has already moved on and we must not yank it back.
    if (this.container.contains(document.activeElement)) {
      this._previouslyFocused?.focus?.();
    }
    this._previouslyFocused = null;
  }

  private readonly _onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;
    const focusable = getFocusable(this.container);
    if (focusable.length === 0) {
      // Nothing to move to — keep focus pinned to the container.
      event.preventDefault();
      this.container.focus();
      return;
    }
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };
}
