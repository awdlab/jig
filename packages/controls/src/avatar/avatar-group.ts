import { Component } from '@angular/core';
import { JigBase, provideSelf, JigPt } from '@awdlab/jig/base';
import { avatarGroupControlTemplate } from '@awdlab/jig-themes/templates/avatar';

/**
 * @category control
 */
@Component({
  selector: 'jig-avatar-group',
  templateUrl: './avatar-group.html',
  imports: [JigPt],
  providers: [provideSelf(JigAvatarGroup)],
})
export class JigAvatarGroup extends JigBase<'avatarGroup'> {
  protected readonly theme = this.injectThemeTemplate(avatarGroupControlTemplate);

  constructor() {
    super();
  }
}
