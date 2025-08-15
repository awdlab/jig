import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import {
  injectThemeTemplate,
  ValueControlBase,
  valueControlBaseProvider,
} from '@ngneers/controls/api';
import { IconType } from '@ngneers/controls/custom-types';
import { NgnIcon } from '@ngneers/controls/icon';
import { checkboxControlTemplate } from '@ngneers/controls-themes/templates/checkbox';

type ValueType<Indeterminate extends boolean> = Indeterminate extends false
  ? boolean
  : boolean | null;

@Component({
  selector: 'ngn-checkbox',
  templateUrl: './checkbox.html',
  imports: [NgClass, NgnIcon],
  providers: [valueControlBaseProvider(NgnCheckbox)],
  host: {
    '[class]': 'theme.class()',
  },
})
export class NgnCheckbox<Indeterminate extends boolean> extends ValueControlBase<
  ValueType<Indeterminate>
> {
  protected readonly theme = injectThemeTemplate(checkboxControlTemplate);

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
   * If `true`, this will change the {@link value} type to `boolean \| null`.
   */
  public readonly allowIndeterminate = input<Indeterminate>();
  protected readonly indeterminate = computed(
    () => this.allowIndeterminate() && this.value() === null
  );

  protected changed(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onChange(target.checked);
  }

  constructor() {
    super();
  }
}
