import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  untracked,
} from '@angular/core';
import {
  JigTemplate,
  type Openable,
  Platform,
  type PopoverCloseBy,
  toPopoverCloseBy,
} from '@awdlab/jig/api/ng';
import { JigPt, provideSelf } from '@awdlab/jig/base';
import { JigButton } from '@awdlab/jig/button';
import { JigDefer } from '@awdlab/jig/defer';
import { I18n } from '@awdlab/jig/i18n';
import { JigIcon } from '@awdlab/jig/icon';
import { FocusTrap, generateElementId, OverlayLifecycle } from '@awdlab/jig/utils-ng';
import { drawerControlTemplate } from '@awdlab/jig-themes/templates/drawer';

import { DrawerTemplates } from './drawer-templates';

import type { IconType } from '@awdlab/jig-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'jig-drawer',
  templateUrl: './drawer.html',
  imports: [JigPt, NgTemplateOutlet, JigDefer, JigButton, JigIcon, JigTemplate],
  providers: [provideSelf(JigDrawer)],
  host: {
    '(toggle)': 'onToggle($event)',
    '[attr.aria-modal]': 'modal() ? "true" : null',
    // A modal overlay is a dialog; a non-modal side panel is complementary
    // landmark content. `aria-modal` is only coherent on the dialog role.
    '[attr.role]': 'modal() ? "dialog" : "complementary"',
    '[attr.aria-labelledby]': 'header() ? headerId : null',
    '[attr.data-position]': 'position()',
  },
})
export class JigDrawer extends DrawerTemplates implements Openable {
  protected readonly theme = this.injectThemeTemplate(drawerControlTemplate, {
    root: true,
    horizontal: () => this.horizontal(),
  });
  protected readonly i18n = inject(I18n).translations;
  protected readonly headerId = generateElementId();
  private _focusTrap?: FocusTrap;

  /**
   * Emits when the drawer has fully closed.
   */
  public readonly closed = output();
  /**
   * Shows or hides the drawer.
   *
   * You probably want to react to openChange events from outside to update your variable accordingly.
   * @default false
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
  public readonly position = input<'top' | 'right' | 'bottom' | 'left' | 'fullscreen'>('left');
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

  protected readonly appliedPosition = computed(() => {
    const position = this.position();
    if (this.platform.windowSize().height < 600 || this.platform.windowSize().width < 600) {
      return 'fullscreen';
    }
    return position;
  });

  private readonly platform = inject(Platform);
  /**
   * Open/close state, the native popover calls and the `popover` attribute. The
   * attribute only exists while open, so a closed drawer is not a top-layer element.
   */
  private readonly _lifecycle = new OverlayLifecycle(() => this.element.nativeElement, {
    mode: () => 'popover',
    control: this,
    popoverValue: () => toPopoverCloseBy(this.closeBy()),
  });

  /** `true` once the drawer is closed and done animating — the cue to unmount content. */
  protected readonly isFullyClosed = this._lifecycle.isFullyClosed;
  protected readonly horizontal = computed(
    () => this.position() === 'top' || this.position() === 'bottom'
  );
  protected readonly doClose = this.hide.bind(this);

  constructor() {
    super();
    // Trap focus inside a modal drawer while it is open. The Popover API already
    // handles Escape/light-dismiss; the trap adds focus-in, Tab wrapping, and
    // focus restore on close that the popover does not provide. Runs as an
    // afterRenderEffect so the (deferred) content has rendered before we move
    // focus onto its first focusable child — a rAF can fire before zoneless CD.
    afterRenderEffect(() => {
      if (this.open() && this.modal()) {
        (this._focusTrap ??= new FocusTrap(this.element.nativeElement)).activate();
      } else {
        this._focusTrap?.deactivate();
      }
    });

    effect(() => {
      const position = this.appliedPosition();

      if (position === 'fullscreen') {
        this.element.nativeElement.style.top = '0';
        this.element.nativeElement.style.bottom = '0';
        this.element.nativeElement.style.left = '0';
        this.element.nativeElement.style.right = '0';
        this.element.nativeElement.style.width = '100%';
        this.element.nativeElement.style.height = '100%';
        return;
      }

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
    untracked(() => this._lifecycle.show());
  }

  /**
   * Closes the drawer. Alternatively, you can also set the `open` input to `false`.
   */
  public hide() {
    untracked(() => this._lifecycle.hide());
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
    this._lifecycle.onNativeToggle(event);
  }
}
