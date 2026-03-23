import { booleanAttribute, Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnTooltip } from '@ngneers/controls/tooltip';
import { maybeCallback } from '@ngneers/controls/utils';

import { NgnButton } from './button';

import type { NgnActionButtonConfig } from '@ngneers/controls/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-action-button',
  templateUrl: 'action-button.html',
  imports: [NgnButton, NgnIcon, NgnTooltip],
  providers: [provideSelf(NgnActionButton)],
})
export class NgnActionButton<T> extends NgnBase<null> {
  protected readonly theme = null;

  public readonly config = input.required<NgnActionButtonConfig<T>>();

  /**
   * Whether the inner button is displayed inline (line-height sized).
   * @default false
   */
  public readonly inline = input(false, { transform: booleanAttribute });

  public readonly clicked = output<T>();

  protected readonly maybeCallback = maybeCallback;

  protected click(event: PointerEvent): void {
    this.clicked.emit(this.config().value);
    this.config().action?.(event);
  }
}
