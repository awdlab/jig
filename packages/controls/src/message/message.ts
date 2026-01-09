import { NgClass } from '@angular/common';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { IconType } from '@ngneers/controls-custom-types';
import { messageControlTemplate } from '@ngneers/controls-themes/templates/message';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-message',
  templateUrl: './message.html',
  imports: [NgClass, NgnIcon],
  providers: [provideSelf(NgnMessage)],
  host: {
    '[class]': 'theme.class()',
  },
})
export class NgnMessage extends NgnBase<'message'> {
  protected readonly theme = this.injectThemeTemplate(messageControlTemplate);

  /**
   * Set an icon to display before the text.
   */
  public readonly icon = input<IconType>();
}
