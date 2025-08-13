import { NgClass } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { NgnBase } from '@ngneers/controls/base';
import { avatarControlTemplate } from '@ngneers/controls-themes/templates/avatar';

@Component({
  selector: 'ngn-avatar',
  templateUrl: './avatar.html',
  imports: [NgClass],
  host: {
    '[class]': 'theme.class()',
    '[style.--size.px]': 'size()',
    '[style.--color]': 'color()',
  },
})
export class NgnAvatar extends NgnBase {
  protected readonly theme = injectThemeTemplate(avatarControlTemplate);

  /**
   * The initials to display when no image is available.
   * Max 4 characters.
   */
  public readonly initials = input<string>();
  /**
   * The background color of the avatar, if the initials are used.
   */
  public readonly color = input<string>();
  /**
   * The image URL to display in the avatar.
   */
  public readonly image = input<string>();
  /**
   * The alt text for the image.
   */
  public readonly alt = input<string>();
  /**
   * The size of the avatar in pixels.
   * @defaultValue `48`
   */
  public readonly size = input<number>(48);

  protected readonly imageLoadFailed = signal(false);
  protected readonly initialsLimited = computed(() => this.initials()?.slice(0, 4));

  constructor() {
    super();
  }
}
