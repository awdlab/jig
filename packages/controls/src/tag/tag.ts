import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { IconType } from '@ngneers/controls-custom-types';
import { tagControlTemplate } from '@ngneers/controls-themes/templates/tag';

/**
 * @category control
 */
@Component({
  selector: 'ngn-tag',
  templateUrl: './tag.html',
  imports: [NgClass, NgnIcon],
  providers: [provideSelf(NgnTag)],
  host: {
    '[class]': 'hostClass()',
  },
})
export class NgnTag extends NgnBase<'tag'> {
  protected readonly theme = this.injectThemeTemplate(tagControlTemplate);

  /**
   * Set an icon to display before the text.
   */
  public readonly icon = input<IconType>();

  protected readonly hostClass = computed(() =>
    this.theme.classes({
      '': true,
      [`kind-${this.kind()}`]: !!this.kind(),
    })
  );
}
