import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgnPt, provideSelf, ValueControlBase } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { checkboxControlTemplate } from '@ngneers/controls-themes/templates/checkbox';

import type { InputGeneric } from '@ngneers/controls/utils';
import type { IconType } from '@ngneers/controls-custom-types';

type ValueType<Indeterminate extends boolean> =
  InputGeneric<Indeterminate, false> extends false ? boolean : boolean | null;

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-checkbox',
  templateUrl: './checkbox.html',
  imports: [NgnPt, NgnIcon],
  providers: [provideSelf(NgnCheckbox)],
})
export class NgnCheckbox<Indeterminate extends boolean> extends ValueControlBase<
  'checkbox',
  ValueType<Indeterminate>
> {
  protected readonly theme = this.injectThemeTemplate(checkboxControlTemplate, {
    root: true,
    invalid: () => this.invalid(),
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
