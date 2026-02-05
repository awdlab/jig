import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { messageControlTemplate } from '@ngneers/controls-themes/templates/message';

import type { IconType } from '@ngneers/controls-custom-types';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-message',
  templateUrl: './message.html',
  imports: [NgnPt, NgnIcon],
  providers: [provideSelf(NgnMessage)],
})
export class NgnMessage extends NgnBase<'message'> {
  protected readonly theme = this.injectThemeTemplate(messageControlTemplate, 'root');

  /**
   * Set an icon to display before the text.
   */
  public readonly icon = input<IconType>();
}
