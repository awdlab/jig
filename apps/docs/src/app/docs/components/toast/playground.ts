import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { injectToastCreator } from '@ngneers/controls/toast';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnButton, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="Toast" [component]="component()">
      <button #ref ngnButton (click)="showToast()">Show Toast</button>
    </ngn-docs-playground>
  `,
})
export class NgnDocsToastPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnButton });
  private readonly _toastCreator = injectToastCreator();

  protected showToast() {
    this._toastCreator.show({
      header: 'Notification',
      content: 'This is a toast message.',
    });
  }
}
