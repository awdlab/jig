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
  ? boolean | null
  : boolean;

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

  public readonly iconChecked = input<IconType>();
  public readonly iconUnchecked = input<IconType>();
  public readonly iconIndeterminate = input<IconType>();

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
