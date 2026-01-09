import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { NgnActionButtonConfig } from '@ngneers/controls/api';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnTooltip } from '@ngneers/controls/tooltip';

import { NgnButton } from './button';

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

  public readonly clicked = output<T>();

  protected click(event: PointerEvent): void {
    this.clicked.emit(this.config().value);
    this.config().action?.(event);
  }
}
