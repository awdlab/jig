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
import { JigPt, provideSelf } from '@awdlab/jig/base';
import { JigDefer } from '@awdlab/jig/defer';
import { signalWithPrevious } from '@awdlab/jig/utils-ng';
import { inplaceControlTemplate } from '@awdlab/jig-themes/templates/inplace';

import { InplaceTemplates } from './inplace-templates';

/**
 * @category control
 */
@Component({
  selector: 'jig-inplace',
  templateUrl: './inplace.html',
  imports: [JigPt, NgTemplateOutlet, JigDefer],
  providers: [provideSelf(JigInplace)],
})
export class JigInplace extends InplaceTemplates {
  protected readonly theme = this.injectThemeTemplate(inplaceControlTemplate, {
    root: true,
    disabled: () => this.disabled(),
  });

  protected readonly closeContent = this.switchToDisplay.bind(this);

  private readonly _displayTrigger = viewChild<ElementRef<HTMLButtonElement>>('displayTrigger');
  private readonly _contentRef = viewChild<ElementRef<HTMLElement>>('contentRef');

  constructor() {
    super();
    // `contentVisible` is declared below; its field initializer has already run by
    // the time this constructor body executes, so it is safe to read here.
    const contentVisibleWithPrevious = signalWithPrevious(this.contentVisible);
    // Keep focus with the user across the display↔content swap — the outgoing view
    // is unmounted, which would otherwise drop focus to the document body. Both
    // directions only act when focus WAS dropped to the body, never when the content
    // (or something else on the page) already claimed it — so a content control that
    // autofocuses itself (e.g. edit-inplace's input) keeps focus. Runs after render
    // so the target element exists.
    afterRenderEffect(() => {
      const { current: visible, previous } = contentVisibleWithPrevious();
      const doc = this.element.nativeElement.ownerDocument;
      const active = doc.activeElement;
      const droppedToBody = active === null || active === doc.body;
      if (!droppedToBody) {
        return;
      }
      if (visible && previous === false) {
        // Opened: move focus into the content region so it is not stranded.
        this._contentRef()?.nativeElement.focus();
      } else if (!visible && previous === true) {
        // Closed: return focus to the display trigger.
        this._displayTrigger()?.nativeElement.focus();
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
