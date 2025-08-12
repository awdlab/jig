import { NgClass, NgTemplateOutlet } from '@angular/common';
import { afterRenderEffect, Component, computed, input, signal } from '@angular/core';
import { injectThemeTemplate, NgnTemplate } from '@ngneers/controls/api';
import { NgnBase } from '@ngneers/controls/base';
import { NgnError } from '@ngneers/controls/utils';
import { avatarControlTemplate } from '@ngneers/controls-themes/templates/avatar';

@Component({
  selector: 'ngn-avatar',
  templateUrl: './avatar.html',
  imports: [NgTemplateOutlet, NgnTemplate, NgClass],
})
export class NgnAvatar extends NgnBase {
  protected readonly theme = injectThemeTemplate(avatarControlTemplate);

  public readonly initials = input<string>();
  public readonly image = input<string>();
  public readonly alt = input<string>();
  public readonly size = input<number>(48);

  protected readonly imageLoadFailed = signal(false);
  protected readonly initialsLimited = computed(() => this.initials()?.slice(0, 4));

  constructor() {
    super();
    afterRenderEffect(() => {
      if (!this.initials() && !this.image()) {
        throw new NgnError(
          'avatar',
          'Avatar component requires either initials or an image to be set.'
        );
      }
    });
  }
}
