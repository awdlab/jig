import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
  untracked,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgnTemplate, Openable, PopoverCloseBy, toPopoverCloseBy } from '@ngneers/controls/api/ng';
import { provideSelf } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDefer } from '@ngneers/controls/defer';
import { NgnIcon } from '@ngneers/controls/icon';
import { IconType } from '@ngneers/controls-custom-types';
import { drawerControlTemplate } from '@ngneers/controls-themes/templates/drawer';

import { DrawerTemplates } from './drawer-templates';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-drawer',
  templateUrl: './drawer.html',
  imports: [NgClass, NgTemplateOutlet, NgnDefer, NgnButton, NgnIcon, NgnTemplate],
  providers: [provideSelf(NgnDrawer)],
  host: {
    '[class]': 'theme.classes({"": true, horizontal: horizontal()})',
    '[attr.popover]': 'closeByPopover()',
    '(toggle)': 'onToggle($event)',
    '[ariaModal]': 'modal() ? "true" : undefined',
    role: 'complementary',
    '[attr.data-position]': 'position()',
  },
})
export class NgnDrawer extends DrawerTemplates implements Openable {
  protected readonly theme = this.injectThemeTemplate(drawerControlTemplate);

  /**
   * Emits when the drawer has fully closed.
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
   * Whether the drawer is a modal or not.
   * A modal drawer prevents interaction with the rest of the page while open.
   * @default false
   */
  public readonly modal = input(false, { transform: booleanAttribute });
  /**
   * Position of the drawer
   * @default 'left'
   */
  public readonly position = input<'top' | 'right' | 'bottom' | 'left'>('left');
  /**
   * The width or height of the drawer depending on its position
   * @default '300px'
   */
  public readonly size = input<string>('300px');
  /**
   * Header text of the drawer
   */
  public readonly header = input<string>();
  /**
   * The icon to use for the close button in the default header template
   */
  public readonly iconClose = input<IconType>();
  /**
   * Lazy load the drawer content
   * @default false
   */
  public readonly lazy = input(false, { transform: booleanAttribute });
  /**
   * Whether to cache the lazy loaded content
   * @default false
   */
  public readonly cache = input(false, { transform: booleanAttribute });

  private _togglingTriggeredByInput = false;
  protected readonly isFullyClosed = signal(true);
  protected readonly closeByPopover = computed(() => toPopoverCloseBy(this.closeBy()));
  protected readonly horizontal = computed(
    () => this.position() === 'top' || this.position() === 'bottom'
  );
  protected readonly doClose = this.hide.bind(this);

  constructor() {
    super();
    afterRenderEffect(() => {
      if (this.open()) {
        this._togglingTriggeredByInput = true;
        this.show();
      } else {
        this._togglingTriggeredByInput = true;
        this.hide();
      }
    });

    effect(() => {
      const position = this.position();
      this.element.nativeElement.style.top = position !== 'bottom' ? '0' : 'unset';
      this.element.nativeElement.style.bottom = position !== 'top' ? '0' : 'unset';
      this.element.nativeElement.style.left = position !== 'right' ? '0' : 'unset';
      this.element.nativeElement.style.right = position !== 'left' ? '0' : 'unset';
      if (position === 'left' || position === 'right') {
        this.element.nativeElement.style.width = this.size();
        this.element.nativeElement.style.height = '100%';
      } else {
        this.element.nativeElement.style.height = this.size();
        this.element.nativeElement.style.width = '100%';
      }
    });
  }

  /**
   * Opens the drawer. Alternatively, you can also set the `open` input to `true`.
   */
  public show() {
    untracked(() => {
      if (this.open() && !this._togglingTriggeredByInput) {
        return;
      }
      this._togglingTriggeredByInput = false;
      this.element.nativeElement.togglePopover(true);
    });
  }

  /**
   * Closes the drawer. Alternatively, you can also set the `open` input to `false`.
   */
  public hide() {
    untracked(() => {
      if (!this.open() && !this._togglingTriggeredByInput) {
        return;
      }
      this._togglingTriggeredByInput = false;
      this.element.nativeElement.togglePopover(false);
    });
  }

  /**
   * Toggles the drawer open or closed. Alternatively, you can also set the `open` input accordingly.
   */
  public toggle() {
    if (untracked(this.open)) {
      this.hide();
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
