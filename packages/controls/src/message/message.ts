import { Component, input } from '@angular/core';
import { JigBase, provideSelf, JigPt } from '@awdlab/jig/base';
import { JigIcon } from '@awdlab/jig/icon';
import { messageControlTemplate } from '@awdlab/jig-themes/templates/message';

import type { IconType } from '@awdlab/jig-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'jig-message',
  templateUrl: './message.html',
  imports: [JigPt, JigIcon],
  providers: [provideSelf(JigMessage)],
})
export class JigMessage extends JigBase<'message'> {
  protected readonly theme = this.injectThemeTemplate(messageControlTemplate, 'root');

  /**
   * Set an icon to display before the text.
   */
  public readonly icon = input<IconType>();
}
