import { NgClass } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { avatarGroupControlTemplate } from '@ngneers/controls-themes/templates/avatar';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-avatar-group',
  templateUrl: './avatar-group.html',
  imports: [NgClass],
  providers: [provideSelf(NgnAvatarGroup)],
})
export class NgnAvatarGroup extends NgnBase<'avatarGroup'> {
  protected readonly theme = this.injectThemeTemplate(avatarGroupControlTemplate);

  constructor() {
    super();
  }
}
