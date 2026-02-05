import { Component, ChangeDetectionStrategy } from '@angular/core';
import { injectThemeColors } from '@ngneers/controls/api/ng';
import { NgnButton } from '@ngneers/controls/button';
import { injectToastCreator } from '@ngneers/controls/toast';

import type { CustomColor } from '@ngneers/controls-custom-types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnButton],
  selector: 'ngn-demo-toast-colors',
  template: `
    @for (color of colors; track color) {
      <button ngnButton kind="text" [color]="color" (click)="showToast(color)">
        {{ color }}
      </button>
    }
  `,
})
export class Demo_Toast_Colors {
  protected readonly colors = injectThemeColors('toast');
  private readonly _toastCreator = injectToastCreator();

  protected showToast(color: CustomColor) {
    this._toastCreator.show({
      header: 'Notification',
      content: `This is a basic toast message with color ${color}.`,
      color,
    });
  }
}
