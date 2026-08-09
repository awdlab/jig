import { Component } from '@angular/core';
import { NgnBase, provideSelf, NgnPt } from '@awdlab/jig/base';
import { avatarGroupControlTemplate } from '@awdlab/jig-themes/templates/avatar';

/**
 * @category control
 */
@Component({
  selector: 'awd-avatar-group',
  templateUrl: './avatar-group.html',
  imports: [NgnPt],
  providers: [provideSelf(NgnAvatarGroup)],
})
export class NgnAvatarGroup extends NgnBase<'avatarGroup'> {
  protected readonly theme = this.injectThemeTemplate(avatarGroupControlTemplate);

  constructor() {
    super();
  }
}
