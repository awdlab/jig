import { Component, input, output } from '@angular/core';
import { NgnActionButtonConfig } from '@ngneers/controls/api';
import { NgnBase } from '@ngneers/controls/base';

import { NgnButton } from './button';

@Component({
  selector: 'ngn-action-button',
  templateUrl: 'action-button.html',
  imports: [NgnButton],
})
export class NgnActionButton<T> extends NgnBase {
  public readonly config = input.required<NgnActionButtonConfig<T>>();

  public readonly clicked = output<T>();

  protected click(): void {
    this.clicked.emit(this.config().value);
    this.config().action?.();
  }
}
