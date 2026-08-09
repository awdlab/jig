import { Component, input } from '@angular/core';
import { JigBase, provideSelf, JigPt } from '@awdlab/jig/base';
import { JigIcon } from '@awdlab/jig/icon';
import { tagControlTemplate } from '@awdlab/jig-themes/templates/tag';

import type { IconType } from '@awdlab/jig-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'jig-tag',
  templateUrl: './tag.html',
  imports: [JigPt, JigIcon],
  providers: [provideSelf(JigTag)],
})
export class JigTag extends JigBase<'tag'> {
  protected readonly theme = this.injectThemeTemplate(tagControlTemplate, 'root');

  /**
   * Set an icon to display before the text.
   */
  public readonly icon = input<IconType>();
}
