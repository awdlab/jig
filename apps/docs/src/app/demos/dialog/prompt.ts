import { Component, inject, Injector, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { createDialog, PromptDialogBase } from '@awdlab/jig/dialog';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-dialog-prompt',
  imports: [JigInput, JigInputField],
  template: `
    <jig-input-field [label]="'Value'" [labelKind]="'over'">
      <input jigInput [(value)]="value" />
    </jig-input-field>
  `,
})
// TODO: figure out how to make the button values type safe here
export class DialogPromptDemo extends PromptDialogBase<{ value: string }, true | false> {
  protected value = '';

  // Handle dialog button clicks
  protected override onDialogButtonClicked(button: true | false): void {
    if (!button) {
      // Call fulfilPrompt with no arguments to resolve the prompt with null
      this.fulfilPrompt();
    } else {
      if (this.value) {
        // Call fulfilPrompt with the entered value to resolve the prompt
        this.fulfilPrompt({ value: this.value });
      }
    }
  }
}

@Component({
  selector: 'jig-demo-dialog-prompt',
  imports: [JigButton],
  template: `<button jigButton (click)="prompt()">Show Prompt</button>`,
})
export class Demo_Dialog_Prompt {
  private readonly _injector = inject(Injector);
  protected readonly open = signal(false);

  protected prompt(): void {
    const res = createDialog(this._injector, {
      title: 'Please enter something 🫡',
      content: DialogPromptDemo,
      footerButtons: [
        {
          label: 'Cancel',
          kind: 'secondary',
          value: false,
        },
        {
          label: 'Confirm',
          kind: 'primary',
          color: 'primary',
          value: true,
        },
      ],
    });

    void res.result.then(res => {
      if (res.button) {
        console.log('Prompt result:', res.value);
      } else {
        console.log('Prompt cancelled');
      }
    });
  }
}
