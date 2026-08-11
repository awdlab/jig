import { Component, ElementRef, inject, viewChildren } from '@angular/core';
import { JigBase, provideSelf } from '@awdlab/jig/base';
import { I18n } from '@awdlab/jig/i18n';
import { NotificationRegionController, OverlayLifecycle } from '@awdlab/jig/utils-ng';
import { snackbarControlTemplate } from '@awdlab/jig-themes/templates/snackbar';

import { JigSnackbar } from './snackbar';
import { JigSnackbarManager } from './snackbar-manager';

/**
 * The host component that renders snackbars.
 */
@Component({
  selector: 'jig-snackbar-host',
  templateUrl: 'snackbar-host.html',
  imports: [JigSnackbar],
  providers: [provideSelf(JigSnackbarHost)],
  host: {
    role: 'region',
    '[attr.aria-label]': "i18n['snackbar_region']()",
    '(document:keydown)': 'region.handleGlobalKeydown($event)',
    '(keydown)': 'region.handleKeydown($event)',
    '(focusin)': 'region.handleFocusIn()',
    '(focusout)': 'region.handleFocusOut($event)',
  },
})
export class JigSnackbarHost extends JigBase<'snackbar'> {
  protected readonly theme = this.injectThemeTemplate(snackbarControlTemplate, 'host');
  protected readonly i18n = inject(I18n).translations;
  private readonly _snackbarManager = inject(JigSnackbarManager);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly _items = viewChildren(JigSnackbar);

  // The first snackbar is anchored at the bottom; each new one stacks above it (mirroring how a
  // second toast appears below the first). Paired with the host's `column-reverse`, the first item
  // in DOM order sits at the bottom anchor, so a leaving item's following siblings are exactly the
  // ones that reflow toward the anchor — keeping the `& ~ *` leave-shift animation correct.
  protected readonly snackbars = this._snackbarManager.snackbars;

  /**
   * Drives keyboard access to the region: `F6` jumps focus to the newest snackbar,
   * arrow keys rove between them, and focus anywhere inside pauses every timer.
   */
  protected readonly region = new NotificationRegionController(this._el.nativeElement, () =>
    this._items()
  );

  /**
   * Only occupies the top layer while snackbars exist — a permanently open popover blocks
   * later top-layer entries from stacking predictably and looks like top-layer hijacking
   * to password managers.
   */
  private readonly _lifecycle = new OverlayLifecycle(() => this._el.nativeElement, {
    mode: () => 'manual',
    openWhen: () => this.snackbars().length > 0,
    // The last snackbar animates itself out with `animate.leave` while still in the DOM —
    // hiding the region first would `display: none` that animation away.
    deferHide: true,
    awaitSubtree: true,
  });

  protected removeSnackbar(id: number): void {
    this._snackbarManager.removeSnackbar(id);
  }
}
