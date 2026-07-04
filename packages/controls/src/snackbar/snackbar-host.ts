import { afterNextRender, Component, ElementRef, inject } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
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
  },
})
export class NgnSnackbarHost extends NgnBase<'snackbar'> {
  protected readonly theme = this.injectThemeTemplate(snackbarControlTemplate, 'host');
  private readonly _snackbarManager = inject(NgnSnackbarManager);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

  // The first snackbar is anchored at the bottom; each new one stacks above it (mirroring how a
  // second toast appears below the first). Paired with the host's `column-reverse`, the first item
  // in DOM order sits at the bottom anchor, so a leaving item's following siblings are exactly the
  // ones that reflow toward the anchor — keeping the `& ~ *` leave-shift animation correct.
  protected readonly snackbars = this._snackbarManager.snackbars;

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
