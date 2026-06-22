import { Component, input } from '@angular/core';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { tagControlTemplate } from '@ngneers/controls-themes/templates/tag';

import type { IconType } from '@ngneers/controls-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-tag',
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
