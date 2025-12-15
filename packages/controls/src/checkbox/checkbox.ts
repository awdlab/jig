import { NgClass } from '@angular/common';
import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { provideSelf, ValueControlBase } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { IconType } from '@ngneers/controls-custom-types';
import { checkboxControlTemplate } from '@ngneers/controls-themes/templates/checkbox';

type ValueType<Indeterminate extends boolean> = Indeterminate extends false
  ? boolean
  : boolean | null;

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-checkbox',
  templateUrl: './checkbox.html',
  imports: [NgClass, NgnIcon],
  providers: [provideSelf(NgnCheckbox)],
  host: {
    '[class]': 'theme.classes({ "": true, invalid: invalid() })',
  },
})
export class NgnCheckbox<Indeterminate extends boolean> extends ValueControlBase<
  'checkbox',
  ValueType<Indeterminate>
> {
  protected readonly theme = this.injectThemeTemplate(checkboxControlTemplate);

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
    if (this.readonly()) {
      return;
    }
    const target = event.target as HTMLInputElement;
    this.value.set(target.checked);
  }

  constructor() {
    super();
  }
}
