import { NgClass } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { provideSelf, ValueControlBase } from '@ngneers/controls/base';
import { switchControlTemplate } from '@ngneers/controls-themes/templates/switch';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-switch',
  templateUrl: './switch.html',
  imports: [NgClass],
  providers: [provideSelf(NgnSwitch)],
  host: {
    '[class]': 'theme.classes({ "": true, invalid: invalid() })',
  },
})
export class NgnSwitch extends ValueControlBase<'switch', boolean> {
  protected readonly theme = this.injectThemeTemplate(switchControlTemplate);

  protected changed(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.checked);
  }

  protected onClick(event: Event) {
    if (this.readonly() || this.disabled()) {
      event.preventDefault();
    }
  }

  constructor() {
    super();
  }
}
