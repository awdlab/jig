import { Component, input } from '@angular/core';
import { AwdBase, provideSelf, AwdPt } from '@awdlab/jig/base';
import { AwdIcon } from '@awdlab/jig/icon';
import { messageControlTemplate } from '@awdlab/jig-themes/templates/message';

import type { IconType } from '@awdlab/jig-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'jig-message',
  templateUrl: './message.html',
  imports: [AwdPt, AwdIcon],
  providers: [provideSelf(AwdMessage)],
})
export class AwdMessage extends AwdBase<'message'> {
  protected readonly theme = this.injectThemeTemplate(messageControlTemplate, 'root');

  /**
   * Set an icon to display before the text.
   */
  public readonly icon = input<IconType>();
}
