import { Component, input } from '@angular/core';
import { NgnBase, provideSelf, NgnPt } from '@awdlab/jig/base';
import { NgnIcon } from '@awdlab/jig/icon';
import { tagControlTemplate } from '@awdlab/jig-themes/templates/tag';

import type { IconType } from '@awdlab/jig-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'awd-tag',
  templateUrl: './tag.html',
  imports: [NgnPt, NgnIcon],
  providers: [provideSelf(NgnTag)],
})
export class NgnTag extends NgnBase<'tag'> {
  protected readonly theme = this.injectThemeTemplate(tagControlTemplate, 'root');

  /**
   * Set an icon to display before the text.
   */
  public readonly icon = input<IconType>();
}
