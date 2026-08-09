import { Component, signal } from '@angular/core';
import { NgnActionButton } from '@awdlab/jig/button';

import type { NgnActionButtonConfig } from '@awdlab/jig/api';

@Component({
  selector: 'awd-demo-button-action',
  imports: [NgnActionButton],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <awd-action-button [config]="saveConfig" (clicked)="onClicked($event)" />
      <span>{{ status() }}</span>
    </div>
  `,
})
export class Demo_Button_Action {
  protected readonly status = signal('Ready');

  protected readonly saveConfig: NgnActionButtonConfig<'save'> = {
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
