import { Component, input, output } from '@angular/core';
import { NgnActionButtonConfig } from '@ngneers/controls/api';
import { NgnBase } from '@ngneers/controls/base';

import { NgnButton } from './button';

@Component({
  selector: 'ngn-action-button',
  templateUrl: 'action-button.html',
  imports: [NgnButton],
})
export class NgnActionButton extends NgnBase {
  public readonly config = input.required<NgnActionButtonConfig>();
  public readonly closed = output<void>();

  protected clicked(): void {
    this.config().action?.();
    if (this.config().close) {
      this.closed.emit();
    }
  }
}
