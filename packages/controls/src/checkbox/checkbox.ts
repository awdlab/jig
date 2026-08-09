import { Component, computed, input } from '@angular/core';
import { AwdPt, provideSelf, ValueControlBase } from '@awdlab/jig/base';
import { AwdIcon } from '@awdlab/jig/icon';
import { checkboxControlTemplate } from '@awdlab/jig-themes/templates/checkbox';

import type { InputGeneric } from '@awdlab/jig/utils';
import type { IconType } from '@awdlab/jig-custom-types';

type ValueType<Indeterminate extends boolean> =
  InputGeneric<Indeterminate, false> extends false ? boolean : boolean | null;

/**
 * @category control
 */
@Component({
  selector: 'jig-checkbox',
  templateUrl: './checkbox.html',
  imports: [AwdPt, AwdIcon],
  providers: [provideSelf(AwdCheckbox)],
})
export class AwdCheckbox<Indeterminate extends boolean> extends ValueControlBase<
  'checkbox',
  ValueType<Indeterminate>
> {
  protected readonly theme = this.injectThemeTemplate(checkboxControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
  });

  /**
   * Set a custom icon for the checked state.
   */
  public readonly iconChecked = input<IconType>();
  /**
   * Set a custom icon for the unchecked state.
   */
  public readonly iconUnchecked = input<IconType>();
  /**
   * Set a custom icon for the indeterminate state.
   */
  public readonly iconIndeterminate = input<IconType>();
  /**
   * Set whether to allow the indeterminate state.
   * If `true`, this will change the {@link value} type to `boolean | null`.
   */
  public readonly allowIndeterminate = input<Indeterminate>();
  protected readonly indeterminate = computed(
    () => this.allowIndeterminate() && this.value() === null
  );

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
