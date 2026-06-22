import { Component } from '@angular/core';
import { NgnPt, provideSelf, ValueControlBase } from '@ngneers/controls/base';
import { switchControlTemplate } from '@ngneers/controls-themes/templates/switch';

/**
 * @category control
 */
@Component({
  selector: 'ngn-switch',
  templateUrl: './switch.html',
  imports: [NgnPt],
  providers: [provideSelf(NgnSwitch)],
})
export class NgnSwitch extends ValueControlBase<'switch', boolean> {
  protected readonly theme = this.injectThemeTemplate(switchControlTemplate, {
    root: true,
    invalid: () => this.invalid(),
  });

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
