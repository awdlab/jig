import { Component, effect, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export abstract class PromptDialogBase<D, ButtonValues> {
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
