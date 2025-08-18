import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api/ng';
import { NgnBase } from '@ngneers/controls/base';
import { avatarGroupControlTemplate } from '@ngneers/controls-themes/templates/avatar';

/**
 * @category control
 */
@Component({
  selector: 'ngn-avatar-group',
  templateUrl: './avatar-group.html',
  imports: [NgClass],
})
export class NgnAvatarGroup extends NgnBase {
  protected readonly theme = injectThemeTemplate(avatarGroupControlTemplate);

  constructor() {
    super();
  }
}
