import { Component, inject, Injector, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createDialog, PromptDialogBase } from '@ngneers/controls/dialog';
import { NgnInput } from '@ngneers/controls/input';

@Component({
  selector: 'ngn-demo-dialog-prompt',
  imports: [FormsModule, NgnInput],
  template: `<input ngnInput [(ngModel)]="value" />`,
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
  selector: 'ngn-demo-dialog-prompt',
  imports: [],
  template: `<button (click)="prompt()">Show Prompt</button>`,
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
          label: 'Confirm',
          kind: 'primary',
          value: true,
        },
        {
          label: 'Cancel',
          kind: 'secondary',
          value: false,
        },
      ],
    });

    res.result.then(res => {
      if (res.button) {
        console.log('Prompt result:', res.value);
      } else {
        console.log('Prompt cancelled');
      }
    });
  }
}
