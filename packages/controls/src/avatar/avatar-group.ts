import { Component } from '@angular/core';
import { AwdBase, provideSelf, AwdPt } from '@awdlab/jig/base';
import { avatarGroupControlTemplate } from '@awdlab/jig-themes/templates/avatar';

/**
 * @category control
 */
@Component({
  selector: 'jig-avatar-group',
  templateUrl: './avatar-group.html',
  imports: [AwdPt],
  providers: [provideSelf(AwdAvatarGroup)],
})
export class AwdAvatarGroup extends AwdBase<'avatarGroup'> {
  protected readonly theme = this.injectThemeTemplate(avatarGroupControlTemplate);

  constructor() {
    super();
  }
}
