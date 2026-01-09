import { NgClass } from '@angular/common';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { IconType } from '@ngneers/controls-custom-types';
import { tagControlTemplate } from '@ngneers/controls-themes/templates/tag';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-tag',
  templateUrl: './tag.html',
  imports: [NgClass, NgnIcon],
  providers: [provideSelf(NgnTag)],
  host: {
    '[class]': 'theme.class()',
  },
})
export class NgnTag extends NgnBase<'tag'> {
  protected readonly theme = this.injectThemeTemplate(tagControlTemplate);

  /**
   * Set an icon to display before the text.
   */
  public readonly icon = input<IconType>();
}
