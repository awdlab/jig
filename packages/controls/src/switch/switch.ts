import { Component } from '@angular/core';
import { AwdPt, provideSelf, ValueControlBase } from '@awdlab/jig/base';
import { switchControlTemplate } from '@awdlab/jig-themes/templates/switch';

/**
 * @category control
 */
@Component({
  selector: 'jig-switch',
  templateUrl: './switch.html',
  imports: [AwdPt],
  providers: [provideSelf(AwdSwitch)],
})
export class AwdSwitch extends ValueControlBase<'switch', boolean> {
  protected readonly theme = this.injectThemeTemplate(switchControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
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
