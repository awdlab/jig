import { booleanAttribute, computed, Directive, input, OnDestroy } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { toggleClass } from '@ngneers/controls/utils';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

/**
 * @category control
 */
@Directive({
  selector: 'button[ngnButton], a[ngnButton]',
  providers: [provideSelf(NgnButton)],
  host: {
    '[class]': 'hostClass()',
  },
})
export class NgnButton extends NgnBase<'button'> implements OnDestroy {
  protected readonly theme = this.injectThemeTemplate(buttonControlTemplate);

  /**
   * Whether the button is displayed inline.
   * This will make the button height fit the current line height.
   */
  public readonly inline = input(false, { transform: booleanAttribute });

  constructor() {
    super();
    toggleClass(this.element.nativeElement, this.theme.class(), true);
  }

  public ngOnDestroy(): void {
    toggleClass(this.element.nativeElement, this.theme.class(), false);
  }

  protected readonly hostClass = computed(() =>
    this.theme.classes({
      '': true,
      inline: this.inline(),
    })
  );
}
