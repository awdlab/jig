import { Component, input } from '@angular/core';
import { NgnBase, provideSelf, NgnPt } from '@awdlab/jig/base';
import { NgnIcon } from '@awdlab/jig/icon';
import { messageControlTemplate } from '@awdlab/jig-themes/templates/message';

import type { IconType } from '@awdlab/jig-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'awd-message',
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
