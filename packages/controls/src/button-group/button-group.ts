import {
  Component,
  computed,
  contentChildren,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { elementSizeSignal, elementsSizesSignal } from '@ngneers/controls/api/ng';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { buttonGroupControlTemplate } from '@ngneers/controls-themes/templates/button-group';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-button-group',
  templateUrl: './button-group.html',
  imports: [NgnPt],

  providers: [provideSelf(NgnButtonGroup)],
})
export class NgnButtonGroup extends NgnBase<'buttonGroup'> {
  protected readonly theme = this.injectThemeTemplate(buttonGroupControlTemplate, 'root');

  private readonly _contentRef = contentChildren(NgnButton);
  private readonly _content = computed(() =>
    this._contentRef().map(ref => ref.element.nativeElement)
  );
  private readonly _parentSize = elementSizeSignal(this.element.nativeElement);
  private readonly _contentSizes = elementsSizesSignal(this._content);
  private readonly _contentWidth = computed(() => {
    const sizes = this._contentSizes();
    return sizes.reduce((acc, size) => acc + size.width, 0);
  });

  /**
   * Defines the orientation of the button group.
   * - 'auto' - The orientation is determined based on the available space.
   * - 'horizontal' - The buttons are arranged horizontally. (Default for `auto` if enough space)
   * - 'vertical' - The buttons are arranged vertically.
   * @default 'auto'
   */
  public readonly orientation = input<'auto' | 'horizontal' | 'vertical'>('auto');
  protected readonly appliedOrientation = computed(() => {
    if (this.orientation() === 'auto') {
      return this._contentWidth() > this._parentSize().width ? 'vertical' : 'horizontal';
    }
    return this.orientation();
  });

  constructor() {
    super();
  }
}
