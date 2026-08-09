import { Component, DestroyRef, inject, signal, type WritableSignal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnState } from '@awdlab/jig/state';

@Component({
  imports: [NgnState, NgnButton, NgnInput, NgnInputField],
  selector: 'awd-demo-state-button',
  template: `
    <awd-input-field label="Type to test">
      <input ngnInput value="" (input)="onInput()" />
      <awd-state [kind]="inputState() ?? undefined" [visible]="!!inputState()" />
    </awd-input-field>
    <br />
    <button ngnButton (click)="onButton()">
      Click to test
      <awd-state [kind]="buttonState() ?? undefined" replaceContent [visible]="!!buttonState()" />
    </button>
  `,
})
export class Demo_State_Interactive {
  private readonly _destroyRef = inject(DestroyRef);

  protected readonly inputState = signal<'loading' | 'success' | null>(null);
  protected readonly buttonState = signal<'loading' | 'success' | null>(null);

  private readonly _timers: Partial<Record<'input' | 'button', ReturnType<typeof setTimeout>>> = {};

  constructor() {
    this._destroyRef.onDestroy(() => {
      this._clearTimer('input');
      this._clearTimer('button');
    });
  }

  protected onInput() {
    this._runCycle(this.inputState, 'input');
  }

  protected onButton() {
    this._runCycle(this.buttonState, 'button');
  }

  private _runCycle(
    state: WritableSignal<'loading' | 'success' | null>,
    timer: 'input' | 'button'
  ): void {
    this._clearTimer(timer);
    state.set('loading');
    this._timers[timer] = setTimeout(() => {
      state.set('success');
      this._timers[timer] = setTimeout(() => {
        state.set(null);
        this._timers[timer] = undefined;
      }, 1000);
    }, 1000);
  }

  private _clearTimer(timer: 'input' | 'button'): void {
    const current = this._timers[timer];
    if (current) {
      clearTimeout(current);
      this._timers[timer] = undefined;
    }
  }
}
