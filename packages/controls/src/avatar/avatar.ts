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

  public readonly initials = input<string>();
  public readonly color = input<string>();
  public readonly image = input<string>();
  public readonly alt = input<string>();
  public readonly size = input<number>(48);

  protected readonly imageLoadFailed = signal(false);
  protected readonly initialsLimited = computed(() => this.initials()?.slice(0, 4));

  constructor() {
    super();
  }
}
