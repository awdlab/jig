import { booleanAttribute, Directive, input } from '@angular/core';
import { JigBase, provideSelf } from '@awdlab/jig/base';
import { toggleClass } from '@awdlab/jig/utils';
import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';

/**
 * @category control
 */
@Directive({
  selector: 'button[jigButton], a[jigButton]',
  providers: [provideSelf(JigButton)],
  exportAs: 'jigButton',
  host: { '[attr.aria-busy]': 'loading() || null' },
})
export class JigButton extends JigBase<'button'> {
  protected readonly theme = this.injectThemeTemplate(buttonControlTemplate, {
    root: true,
    inline: () => this.inline(),
    loading: () => this.loading(),
  });

  /**
   * Whether the button is displayed inline.
   * This will make the button height fit the current line height.
   */
  public readonly inline = input(false, {
    transform: booleanAttribute,
    // alias follows the jig{Directive}{Prop} convention for the `button[jigButton], a[jigButton]` selector
    alias: 'jigButtonInline',
  });

  /**
   * Marks the button as busy: sets `aria-busy` and the theme's `loading` class.
   * Does not block clicks; combine with `disabled` for that.
   * @default false
   */
  public readonly loading = input(false, {
    transform: booleanAttribute,
    alias: 'jigButtonLoading',
  });

  constructor() {
    super();
    toggleClass(this.element.nativeElement, this.theme.class('root'), true);
  }

  protected override afterLeave(): void {
    toggleClass(this.element.nativeElement, this.theme.class('root'), false);
  }
}
