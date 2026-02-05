import { booleanAttribute, Directive, input, model } from '@angular/core';
import { generateElementId } from '@ngneers/controls/utils-ng';

import { NgnBase } from './base';

import type { FormValueControl } from '@angular/forms/signals';
import type { ControlName } from '@ngneers/controls-themes/templates';

@Directive()
export abstract class ValueControlBase<C extends ControlName, T>
  extends NgnBase<C>
  implements FormValueControl<T>
{
  /**
   * The label for the control.
   */
  public readonly label = input<string | null>(null);
  /**
   * Sets the `aria-labelledby` attribute on the control.
   * @default null
   */
  public readonly labelledBy = input<string | null>(null);
  /**
   * The ID for the control
   * @default generateElementId()
   */
  public readonly inputId = input<string>(generateElementId());
  /**
   * Explicitly apply invalid state styling
   * @default false
   */
  public readonly invalid = input(false, { transform: booleanAttribute });
  /**
   * The value of the control.
   */
  public readonly value = model<T>(undefined as T);
  /**
   * Set the disabled state of the control.
   */
  public readonly disabled = input(false, { transform: booleanAttribute });

  public readonly readonly = input(false, { transform: booleanAttribute });

  public readonly touched = model(false);

  public readonly dirty = input(false, { transform: booleanAttribute });
}
