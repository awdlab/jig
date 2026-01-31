import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { avatarGroupControlTemplate } from '@ngneers/controls-themes/templates/avatar';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-avatar-group',
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
