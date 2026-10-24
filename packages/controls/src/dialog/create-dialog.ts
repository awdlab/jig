import { ComponentRef, Injector, type OutputRef, ViewContainerRef } from '@angular/core';
import { setComponentInput } from '@awdlab/jig/api/ng';

import { JigDialog } from './dialog';
import { PromptDialogBase } from './prompt-dialog-base';

import type { DialogConfig } from './types';
import type { JigActionButtonConfig } from '@awdlab/jig/api';

export type DialogHandle<
  T,
  Buttons extends JigActionButtonConfig<T extends PromptDialogBase<any, infer B> ? B : unknown>[],
> = {
  close: () => void;
  updateConfig: (config: Partial<DialogConfig<T, Buttons>>) => void;
  buttonClicked: OutputRef<Buttons[number]['value'] | null>;
};

export type PromptDialogHandle<
  T,
  Buttons extends JigActionButtonConfig<T extends PromptDialogBase<any, infer B> ? B : unknown>[],
> = {
  close: () => void;
  updateConfig: (config: Partial<DialogConfig<T, Buttons>>) => void;
  result: Promise<{
    value: (T extends PromptDialogBase<infer D, Buttons> ? D : never) | null;
    button: Buttons[number]['value'] | null;
  }>;
};

function applyDialogConfig<
  T,
  Buttons extends JigActionButtonConfig<T extends PromptDialogBase<any, infer B> ? B : unknown>[],
>(dialogRef: ComponentRef<JigDialog<T, Buttons>>, config: Partial<DialogConfig<T, Buttons>>): void {
  // Every DialogConfig key is a JigDialog input of the same name, so forwarding
  // by key keeps the two from drifting as inputs are added.
  for (const [key, value] of Object.entries(config)) {
    if (value !== undefined) {
      setComponentInput(dialogRef, key as keyof DialogConfig<T, Buttons> & string, value);
    }
  }
}

export function createDialog<
  T,
  Buttons extends JigActionButtonConfig<T extends PromptDialogBase<any, infer B> ? B : unknown>[],
>(
  injector: Injector,
  config: DialogConfig<T, Buttons>
): T extends PromptDialogBase<any, any>
  ? PromptDialogHandle<T, Buttons>
  : DialogHandle<T, Buttons> {
  type ButtonValues = Buttons[number]['value'];

  const viewContainerRef = injector.get(ViewContainerRef);
  const dialogRef = viewContainerRef.createComponent(JigDialog, {
    injector,
  }) as unknown as ComponentRef<JigDialog<T, Buttons>>;

  applyDialogConfig(dialogRef, config);

  const handle = {
    close: () => dialogRef.destroy(),
    updateConfig: (newConfig: Partial<DialogConfig<T, Buttons>>) =>
      applyDialogConfig(dialogRef, newConfig),
  };

  if (
    typeof config.content === 'function' &&
    config.content.prototype instanceof PromptDialogBase
  ) {
    const result = Promise.withResolvers<{
      value: (T extends PromptDialogBase<infer D, ButtonValues> ? D : never) | null;
      button: ButtonValues | null;
    }>();

    dialogRef.instance.promptResult.subscribe(value => {
      result.resolve(value);
    });

    return { ...handle, result: result.promise } as T extends PromptDialogBase<any, any>
      ? PromptDialogHandle<T, Buttons>
      : DialogHandle<T, Buttons>;
  }

  const buttonClicked: OutputRef<ButtonValues | null> = dialogRef.instance.buttonClicked;
  return { ...handle, buttonClicked } as T extends PromptDialogBase<any, any>
    ? PromptDialogHandle<T, Buttons>
    : DialogHandle<T, Buttons>;
}
