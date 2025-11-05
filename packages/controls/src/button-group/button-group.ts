import { NgClass } from '@angular/common';
import { Component, computed, contentChildren, input } from '@angular/core';
import { elementSizeSignal, elementsSizesSignal } from '@ngneers/controls/api/ng';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { buttonGroupControlTemplate } from '@ngneers/controls-themes/templates/button-group';

/**
 * @category control
 */
@Component({
  selector: 'ngn-button-group',
  templateUrl: './button-group.html',
  imports: [NgClass],
  host: {
    '[class]': 'theme.class()',
  },
  providers: [provideSelf(NgnButtonGroup)],
})
export class NgnButtonGroup extends NgnBase {
  protected readonly theme = this.injectThemeTemplate(buttonGroupControlTemplate);

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
