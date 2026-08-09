import { Component, signal } from '@angular/core';
import { JigActionButton } from '@awdlab/jig/button';

import type { JigActionButtonConfig } from '@awdlab/jig/api';

@Component({
  selector: 'jig-demo-button-action',
  imports: [JigActionButton],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <jig-action-button [config]="saveConfig" (clicked)="onClicked($event)" />
      <span>{{ status() }}</span>
    </div>
  `,
})
export class Demo_Button_Action {
  protected readonly status = signal('Ready');

  protected readonly saveConfig: JigActionButtonConfig<'save'> = {
    label: 'Save',
    value: 'save',
    kind: 'primary',
    action: async () => {
      this.status.set('Saving…');
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.status.set('Saved');
    },
  };

  protected onClicked(value: 'save'): void {
    // `clicked` emits the config's `value` right after `action` fires.
    console.log('clicked', value);
  }
}
