import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { PopoverCloseBy, toPopoverCloseBy } from '@ngneers/controls/api/ng';
import { provideSelf } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { drawerControlTemplate } from '@ngneers/controls-themes/templates/drawer';

import { DrawerTemplates } from './drawer-templates';

/**
 * @category control
 */
@Component({
  selector: 'ngn-drawer',
  templateUrl: './drawer.html',
  imports: [NgClass, NgTemplateOutlet, NgnDefer],
  providers: [provideSelf(NgnDrawer)],
})
export class NgnDrawer extends DrawerTemplates {
  protected readonly theme = this.injectThemeTemplate(drawerControlTemplate);

  /**
   * Emits when the drawer has fully closed
   */
  public readonly closed = output();
  /**
   * Shows or hides the drawer.
   *
   * You probably want to react to openChange events from outside to update your variable accordingly.
   */
  public readonly open = model<boolean>(false);
  /**
   * How the drawer closes depending on user interaction.
   * @default 'any'
   */
  public readonly closeBy = input<PopoverCloseBy>('any');
  /**
   * Position of the drawer
   * @default 'left'
   */
  public readonly position = input<'top' | 'right' | 'bottom' | 'left'>('left');
  /**
   * Lazy load the drawer content
   * @default false
   */
  public readonly lazy = input<boolean>(false);
  /**
   * Whether to cache the lazy loaded content
   * @default false
   */
  public readonly cache = input<boolean>(false);

  protected readonly isFullyClosed = signal(true);
  protected readonly closeByPopover = computed(() => toPopoverCloseBy(this.closeBy()));

  private readonly _popoverRef = viewChild.required<ElementRef<HTMLElement>>('popover');
  private readonly _popover = computed(() => this._popoverRef().nativeElement);
  private _triggeredByInput = false;

  constructor() {
    super();
    afterRenderEffect(() => {
      if (this.open()) {
        this._triggeredByInput = true;
        this.show();
      } else {
        this._triggeredByInput = true;
        this.close();
      }
    });
  }

  /**
   * Opens the drawer. Alternatively, you can also set the `open` input to `true`.
   */
  public show() {
    untracked(() => {
      if (this.open() && !this._triggeredByInput) {
        return;
      }
      this._triggeredByInput = false;
      this._popover().togglePopover(true);
    });
  }

  /**
   * Closes the drawer. Alternatively, you can also set the `open` input to `false`.
   */
  public close() {
    untracked(() => {
      if (!this.open() && !this._triggeredByInput) {
        return;
      }
      this._triggeredByInput = false;
      this._popover().togglePopover(false);
    });
  }

  /**
   * Toggles the drawer open or closed. Alternatively, you can also set the `open` input accordingly.
   */
  public toggle() {
    if (untracked(this.open)) {
      this.close();
    } else {
      this.show();
    }
  }

  protected onToggle(event: Event) {
    const evt = event as ToggleEvent;
    if (evt.newState === 'closed') {
      this.open.set(false);

      requestAnimationFrame(() => {
        const allAnimationsDone = Promise.all(
          this.element.nativeElement.getAnimations().map(x => x.finished)
        );
        allAnimationsDone
          .then(() => {
            this.isFullyClosed.set(true);
            this.closed.emit();
          })
          .catch(() => {
            // ignore cancelled animation
          });
      });
    } else {
      this.open.set(true);
      this.isFullyClosed.set(false);
    }
  }
}
