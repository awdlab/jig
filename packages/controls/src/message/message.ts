import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { CustomColor, IconType } from '@ngneers/controls-custom-types';
import { messageControlTemplate } from '@ngneers/controls-themes/templates/message';

/**
 * @category control
 */
@Component({
  selector: 'ngn-message',
  templateUrl: './message.html',
  imports: [NgClass, NgnIcon],
  providers: [provideSelf(NgnMessage)],
  host: {
    '[class]': 'hostClass()',
  },
})
export class NgnMessage extends NgnBase<'message'> {
  protected readonly theme = this.injectThemeTemplate(messageControlTemplate);

  /**
   * Set an icon to display before the text.
   */
  public readonly icon = input<IconType>();
  /**
   * Set the color of the message.
   */
  public readonly color = input<CustomColor | null>();

  protected readonly hostClass = computed(() =>
    this.theme.classes({
      '': true,
      [`kind-${this.kind()}`]: !!this.kind(),
      [`color-${this.color()}`]: !!this.color(),
    })
  );
}
