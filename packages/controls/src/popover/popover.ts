import {
  booleanAttribute,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  output,
  untracked,
  viewChild,
} from '@angular/core';
import {
  type PopoverCloseBy,
  toPopoverCloseBy,
  autoPositionElement,
  type AutoPositioningHandle,
  type Openable,
  type Anchor,
} from '@awdlab/jig/api/ng';
import { provideSelf, JigPt } from '@awdlab/jig/base';
import { JigDefer } from '@awdlab/jig/defer';
import { computedWithPrevious, OverlayLifecycle } from '@awdlab/jig/utils-ng';
import { popoverControlTemplate } from '@awdlab/jig-themes/templates/popover';

import { PopoverTemplates } from './popover-templates';

import type { PopoverOptions } from './types';

/**
 * @category control
 */
@Component({
  selector: 'jig-popover',
  templateUrl: './popover.html',
  imports: [JigPt, JigDefer],
  providers: [provideSelf(JigPopover)],
  host: {
    '(click)': '$event.stopPropagation()',
  },
})
export class JigPopover extends PopoverTemplates implements Openable {
  protected readonly theme = this.injectThemeTemplate(popoverControlTemplate, 'root');

  /**
   * Emits when the popover has fully closed.
   */
  public readonly closed = output();
  /**
   * Emits when the popover is closed.
   */
  public readonly closing = output();
  /**
   * Shows or hides the popover.
   *
   * You probably want to react to openChange events from outside to update your variable accordingly.
   */
  public readonly open = model<boolean>(false);
  /**
   * The element to which the popover is anchored.
   */
  public readonly anchor = input.required<Anchor>();
  /**
   * The popover options.
   */
  public readonly options = input<PopoverOptions>();
  /**
   * Set to true for scrollable/shrink-able content
   */
  public readonly hasShrinkableContent = input(false, { transform: booleanAttribute });
  /**
   * How the popover closes depending on user interaction.
   * @default any
   */
  public readonly closeBy = input<PopoverCloseBy>('any');

  protected readonly _content = viewChild.required<ElementRef<HTMLElement>>('content');

  protected readonly appliedOptions = computed(() => ({
    cache: false,
    ...this.options(),
  }));

  private readonly _injector = inject(Injector);
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _popoverRef = viewChild.required<ElementRef<HTMLElement>>('popover');
  private readonly _popover = computed(() => this._popoverRef().nativeElement);
  private readonly _autoPos = computedWithPrevious<AutoPositioningHandle | undefined>(prev => {
    prev?.stop();
    const popoverEl = this._popover();
    if (!popoverEl) {
      return undefined;
    }
    return autoPositionElement(this.anchor(), popoverEl, {
      injector: this._injector,
      stopped: true,
      sizeConstraints: this.appliedOptions()?.sizeConstraints,
      placement: this.appliedOptions()?.placement,
      offset: this.appliedOptions()?.padding,
      hasShrinkableContent: this.hasShrinkableContent(),
    });
  });

  /**
   * Open/close state, the native popover calls and the `popover` attribute. The
   * attribute only exists while open, so a closed popover is not a top-layer element.
   */
  private readonly _lifecycle = new OverlayLifecycle(() => this._popover(), {
    mode: () => 'popover',
    control: this,
    popoverValue: () => toPopoverCloseBy(this.closeBy()),
    deferShow: true,
    // The wrapper is `display: none` while closed; the exit animation runs on its content.
    animationElement: () => this._content()?.nativeElement,
    // Flush so the deferred content exists before the lifecycle's frame measures it.
    onOpening: () => this._cdr.detectChanges(),
    onBeforeShow: () => this._autoPos()?.start(),
    onClosing: () => this._autoPos()?.stop(),
  });

  /** `true` once the popover is closed and done animating — the cue to unmount content. */
  protected readonly isFullyClosed = this._lifecycle.isFullyClosed;
  /** `true` while the exit animation is still running. */
  protected readonly isClosing = computed(() => this._lifecycle.phase() === 'closing');

  /**
   * Opens the popover. Alternatively, you can also set the {@link open} input to `true`.
   */
  public show() {
    untracked(() => this._lifecycle.show());
  }

  /**
   * Closes the popover. Alternatively, you can also set the {@link open} input to `false`.
   */
  public hide(emitCloseEvent = true) {
    untracked(() => this._lifecycle.hide({ silent: !emitCloseEvent }));
  }

  /**
   * Toggles the popover open or closed. Alternatively, you can also set the {@link open} input accordingly.
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
