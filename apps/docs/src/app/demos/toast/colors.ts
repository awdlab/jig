import { Component } from '@angular/core';
import { injectThemeColors } from '@awdlab/jig/api/ng';
import { JigButton } from '@awdlab/jig/button';
import { injectToastCreator } from '@awdlab/jig/toast';

import type { CustomColor } from '@awdlab/jig-custom-types';

@Component({
  imports: [JigButton],
  selector: 'jig-demo-toast-colors',
  template: `
    @for (color of colors(); track color) {
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
