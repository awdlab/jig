import {
  booleanAttribute,
  Component,
  contentChild,
  input,
  model,
  TemplateRef,
} from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';

import type { IconType } from '@ngneers/controls-custom-types';

/**
 * A single step within an `ngn-stepper`. Declares the step's header metadata and
 * projects its content via `<ng-template #content>`.
 * @category control
 */
@Component({
  selector: 'ngn-step',
  template: '',
  providers: [provideSelf(NgnStep)],
})
export class NgnStep extends NgnBase<'stepper'> {
  protected readonly theme = null;

  /** The step's header label. */
  public readonly label = input<string>('');
  /** Custom marker icon; when unset the 1-based step number is shown. */
  public readonly iconStep = input<IconType>();
  /** Marks the step optional (shown as a hint; skippable in linear mode). @default false */
  public readonly optional = input(false, { transform: booleanAttribute });
  /** Disables navigation to this step. @default false */
  public readonly disabled = input(false, { transform: booleanAttribute });
  /** Renders the step's marker in an error state. @default false */
  public readonly error = input(false, { transform: booleanAttribute });
  /**
   * Whether the step is complete. The app sets this; in linear mode it gates
   * forward navigation past this step. @default false
   */
  public readonly completed = model(false);

  public readonly content = contentChild<TemplateRef<unknown>>('content');
}
