import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  type ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';
import { NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { signalWithPrevious } from '@ngneers/controls/utils-ng';
import { inplaceControlTemplate } from '@ngneers/controls-themes/templates/inplace';

import { InplaceTemplates } from './inplace-templates';

/**
 * @category control
 */
@Component({
  selector: 'ngn-inplace',
  templateUrl: './inplace.html',
  imports: [NgnPt, NgTemplateOutlet, NgnDefer],
  providers: [provideSelf(NgnInplace)],
})
export class NgnInplace extends InplaceTemplates {
  protected readonly theme = this.injectThemeTemplate(inplaceControlTemplate, {
    root: true,
    disabled: () => this.disabled(),
  });

  protected readonly closeContent = this.switchToDisplay.bind(this);

  private readonly _displayTrigger = viewChild<ElementRef<HTMLButtonElement>>('displayTrigger');

  constructor() {
    super();
    // `contentVisible` is declared below; its field initializer has already run by
    // the time this constructor body executes, so it is safe to read here.
    const contentVisibleWithPrevious = signalWithPrevious(this.contentVisible);
    // When returning from the content view to the display view, restore focus to
    // the display trigger so keyboard/screen-reader users are not dropped to the
    // document body when the content unmounts. Runs after render so the trigger
    // button exists. Only restores focus when it was lost to the body (i.e. the
    // previously focused content element was removed), never when focus has
    // already moved elsewhere in the page.
    afterRenderEffect(() => {
      const { current: visible, previous } = contentVisibleWithPrevious();
      if (visible || previous !== true) {
        return;
      }
      const trigger = this._displayTrigger()?.nativeElement;
      if (!trigger) {
        return;
      }
      const active = trigger.ownerDocument.activeElement;
      if (active === null || active === trigger.ownerDocument.body) {
        trigger.focus();
      }
    });
  }

  /**
   * Controls the visibility of the content.
   */
  public readonly contentVisible = model<boolean>(false);
  /**
   * Whether the content is loaded lazily.
   * @default true
   */
  public readonly lazy = input(true, { transform: booleanAttribute });
  /**
   * Whether the content is cached when closed.
   * @default false
   */
  public readonly cache = input(false, { transform: booleanAttribute });
  /**
   * Explicitly apply disabled state styling
   * @default false
   */
  public readonly disabled = input(false, { transform: booleanAttribute });

  /**
   * Switches to the content view.
   */
  public switchToContent() {
    if (this.disabled()) {
      return;
    }
    this.contentVisible.set(true);
  }

  /**
   * Switches to the display view.
   */
  public switchToDisplay() {
    this.contentVisible.set(false);
  }

  /**
   * Toggles between the display and content views.
   */
  public toggle() {
    this.contentVisible.update(v => !v);
  }
}
