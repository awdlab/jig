import { afterNextRender, Component, ElementRef, inject, viewChildren } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { I18n } from '@ngneers/controls/i18n';
import { NotificationRegionController } from '@ngneers/controls/utils-ng';
import { snackbarControlTemplate } from '@ngneers/controls-themes/templates/snackbar';

import { NgnSnackbar } from './snackbar';
import { NgnSnackbarManager } from './snackbar-manager';

/**
 * The host component that renders snackbars.
 */
@Component({
  selector: 'ngn-snackbar-host',
  templateUrl: 'snackbar-host.html',
  imports: [NgnSnackbar],
  providers: [provideSelf(NgnSnackbarHost)],
  host: {
    '[attr.popover]': '"manual"',
    role: 'region',
    '[attr.aria-label]': "i18n['snackbar_region']()",
    '(document:keydown)': 'region.handleGlobalKeydown($event)',
    '(keydown)': 'region.handleKeydown($event)',
    '(focusin)': 'region.handleFocusIn()',
    '(focusout)': 'region.handleFocusOut($event)',
  },
})
export class NgnSnackbarHost extends NgnBase<'snackbar'> {
  protected readonly theme = this.injectThemeTemplate(snackbarControlTemplate, 'host');
  protected readonly i18n = inject(I18n).translations;
  private readonly _snackbarManager = inject(NgnSnackbarManager);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly _items = viewChildren(NgnSnackbar);

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

  constructor() {
    super();
    afterNextRender(() => {
      this._el.nativeElement.showPopover();
    });
  }

  protected removeSnackbar(id: number): void {
    this._snackbarManager.removeSnackbar(id);
  }
}
