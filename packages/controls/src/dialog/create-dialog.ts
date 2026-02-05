import { ComponentRef, Injector, ViewContainerRef } from '@angular/core';
import { setComponentInput } from '@ngneers/controls/api/ng';
import { Observable, Subject } from 'rxjs';

import { NgnDialog } from './dialog';
import { PromptDialogBase } from './prompt-dialog-base';

import type { DialogConfig } from './types';
import type { NgnActionButtonConfig } from '@ngneers/controls/api';

export type DialogHandle<T, Buttons extends NgnActionButtonConfig<unknown>[]> = {
  close: () => void;
  updateConfig: (config: Partial<DialogConfig<T, Buttons>>) => void;
  buttonClicked: Observable<Buttons[number]['value'] | null>;
};

export type PromptDialogHandle<T, Buttons extends NgnActionButtonConfig<unknown>[]> = {
  close: () => void;
  updateConfig: (config: Partial<DialogConfig<T, Buttons>>) => void;
  result: Promise<{
    value: T extends PromptDialogBase<infer D, Buttons> ? D : never | null;
    button: Buttons[number]['value'] | null;
  }>;
};

function applyDialogConfig<T, Buttons extends NgnActionButtonConfig<unknown>[]>(
  dialogRef: ComponentRef<NgnDialog<T, Buttons>>,
  config: DialogConfig<T, Buttons>
): void {
  if (config.title !== undefined) {
    setComponentInput(dialogRef, 'title', config.title);
  }
  if (config.size !== undefined) {
    setComponentInput(dialogRef, 'size', config.size);
  }
  if (config.modal !== undefined) {
    setComponentInput(dialogRef, 'modal', config.modal);
  }
  if (config.footerButtons !== undefined) {
    setComponentInput(dialogRef, 'footerButtons', config.footerButtons);
  }
  if (config.closeBy !== undefined) {
    setComponentInput(dialogRef, 'closeBy', config.closeBy);
  }
  if (config.content !== undefined) {
    setComponentInput(dialogRef, 'content', config.content);
  }
  if (config.movable !== undefined) {
    setComponentInput(dialogRef, 'movable', config.movable);
  }
  if (config.resizable !== undefined) {
    setComponentInput(dialogRef, 'resizable', config.resizable);
  }
}

export function createDialog<T, Buttons extends NgnActionButtonConfig<unknown>[]>(
  injector: Injector,
  config: DialogConfig<T, Buttons>
): T extends PromptDialogBase<any, any>
  ? PromptDialogHandle<T, Buttons>
  : DialogHandle<T, Buttons> {
  type ButtonValues = Buttons[number]['value'];

  const viewContainerRef = injector.get(ViewContainerRef);
  const dialogRef = viewContainerRef.createComponent(NgnDialog, {
    injector,
  });

  applyDialogConfig(dialogRef, config);
  dialogRef.instance.buttonClicked.subscribe(value => {
    buttonClicked.next(value);
  });

  const buttonClicked = new Subject<ButtonValues | null>();
  dialogRef.onDestroy(() => {
    buttonClicked.complete();
  });

  if (
    typeof config.content === 'function' &&
    config.content.prototype instanceof PromptDialogBase
  ) {
    const _result = Promise.withResolvers<{
      value: (T extends PromptDialogBase<infer D, ButtonValues> ? D : never) | null;
      button: ButtonValues | null;
    }>();

    (dialogRef.instance as unknown as NgnDialog<T, Buttons>).promptResult.subscribe(result => {
      _result.resolve(result);
    });

    return {
      close: () => dialogRef.destroy(),
      updateConfig: (newConfig: Partial<DialogConfig<T, Buttons>>) =>
        applyDialogConfig(dialogRef, newConfig),
      result: _result.promise,
    } as T extends PromptDialogBase<any, any>
      ? PromptDialogHandle<T, Buttons>
      : DialogHandle<T, Buttons>;
  }

  return {
    close: () => dialogRef.destroy(),
    updateConfig: (newConfig: Partial<DialogConfig<T, Buttons>>) =>
      applyDialogConfig(dialogRef, newConfig),
    buttonClicked: buttonClicked.asObservable(),
  } as T extends PromptDialogBase<any, any>
    ? PromptDialogHandle<T, Buttons>
    : DialogHandle<T, Buttons>;
}
