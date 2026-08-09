import { Component, computed, input, linkedSignal } from '@angular/core';
import { JigBase, provideSelf, JigPt } from '@awdlab/jig/base';
import { avatarControlTemplate } from '@awdlab/jig-themes/templates/avatar';

/**
 * @category control
 */
@Component({
  selector: 'jig-avatar',
  templateUrl: './avatar.html',
  imports: [JigPt],
  host: {
    '[style.--size.px]': 'size()',
    '[style.--color]': 'bgColor()',
  },
  providers: [provideSelf(JigAvatar)],
})
export class JigAvatar extends JigBase<'avatar'> {
  protected readonly theme = this.injectThemeTemplate(avatarControlTemplate, 'root');

  /**
   * The initials to display when no image is available.
   * Max 4 characters.
   */
  public readonly initials = input<string>();
  /**
   * The background color of the avatar, if the initials are used.
   */
  public readonly bgColor = input<string>();
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
   * @default 48
   */
  public readonly size = input<number>(48);

  protected readonly imageLoadFailed = linkedSignal<boolean>(() => !!this.image() && false);
  protected readonly initialsLimited = computed(() => this.initials()?.slice(0, 4));

  constructor() {
    super();
  }
}
