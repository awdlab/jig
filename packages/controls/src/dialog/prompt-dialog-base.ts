import { Component, effect, input } from '@angular/core';

@Component({
  template: '',
})
export abstract class PromptDialogBase<D, ButtonValues> {
  /**
   * Injected by the hosting dialog to resolve the prompt. Carries the button value that
   * triggered the prompt and the callback used to report the result back to the dialog.
   * You typically do not set this yourself; call `fulfilPrompt` from your subclass instead.
   */
  public readonly ngnPromptDialogResolveFn = input<{
    fn: (value: D | null) => void;
    button: ButtonValues;
  }>();

  constructor() {
    effect(() => {
      const fn = this.ngnPromptDialogResolveFn(); // trigger
      if (fn) {
        this.onDialogButtonClicked(fn.button);
      }
    });
  }

  protected fulfilPrompt(data?: D) {
    this.ngnPromptDialogResolveFn()?.fn(data ?? null);
  }

  protected abstract onDialogButtonClicked(button: ButtonValues): void;
}
