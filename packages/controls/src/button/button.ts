import { booleanAttribute, Directive, input } from '@angular/core';
import { NgnBase, provideSelf } from '@awdlab/jig/base';
import { toggleClass } from '@awdlab/jig/utils';
import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';

/**
 * @category control
 */
@Directive({
  selector: 'button[ngnButton], a[ngnButton]',
  providers: [provideSelf(NgnButton)],
  exportAs: 'ngnButton',
})
export class NgnButton extends NgnBase<'button'> {
  protected readonly theme = this.injectThemeTemplate(buttonControlTemplate, {
    root: true,
    inline: () => this.inline(),
  });

  /**
   * Whether the button is displayed inline.
   * This will make the button height fit the current line height.
   */
  public readonly inline = input(false, {
    transform: booleanAttribute,
    // alias follows the awd{Directive}{Prop} convention for the `button[ngnButton], a[ngnButton]` selector
    alias: 'ngnButtonInline',
  });

  constructor() {
    super();
    toggleClass(this.element.nativeElement, this.theme.class('root'), true);
  }

  protected override afterLeave(): void {
    toggleClass(this.element.nativeElement, this.theme.class('root'), false);
  }
}
