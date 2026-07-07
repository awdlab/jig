import { Component, DestroyRef, inject, signal, type WritableSignal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnState } from '@ngneers/controls/state';

@Component({
  imports: [NgnState, NgnButton, NgnInput, NgnInputField],
  selector: 'ngn-demo-state-button',
  template: `
    <ngn-input-field label="Type to test">
      <input ngnInput value="" (input)="onInput()" />
      <ngn-state [kind]="inputState() ?? undefined" [visible]="!!inputState()" />
    </ngn-input-field>
    <br />
    <button ngnButton (click)="onButton()">
      Click to test
      <ngn-state [kind]="buttonState() ?? undefined" replaceContent [visible]="!!buttonState()" />
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
