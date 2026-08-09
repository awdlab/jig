import { Component, computed, input } from '@angular/core';
import { NgnBase, NgnPt, provideSelf } from '@awdlab/jig/base';
import { kbdControlTemplate } from '@awdlab/jig-themes/templates/kbd';

import { formatShortcut } from './shortcut';

/**
 * Displays a keyboard shortcut as glyphs, e.g. `mod+shift+a` → `⇧⌘A`.
 * @category control
 */
@Component({
  selector: 'awd-kbd',
  templateUrl: './kbd.html',
  imports: [NgnPt],
  providers: [provideSelf(NgnKbd)],
})
export class NgnKbd extends NgnBase<'kbd'> {
  protected readonly theme = this.injectThemeTemplate(kbdControlTemplate, 'root');

  /**
   * The shortcut to display, as `+`-joined lowercase tokens — `mod+shift+a`, `escape`,
   * `alt+arrowup`. `mod` renders as the key it resolves to — ⌘ on macOS, ⌃ elsewhere;
   * `ctrl` always renders ⌃.
   */
  public readonly shortcut = input.required<string>();

  protected readonly display = computed(() => formatShortcut(this.shortcut()));
}
