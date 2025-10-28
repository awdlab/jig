import { Injector, ViewContainerRef } from '@angular/core';
import { setComponentInput } from '@ngneers/controls/api/ng';

import { DialogConfig } from './types';

export async function createDialog(injector: Injector, dialogConfig: DialogConfig): Promise<void> {
  const { NgnDialog } = await import('./dialog');

  const viewContainerRef = injector.get(ViewContainerRef);
  const dialogRef = viewContainerRef.createComponent(NgnDialog, {
    injector,
  });

  if (dialogConfig.title !== undefined) {
    setComponentInput(dialogRef, 'title', dialogConfig.title);
  }
  if (dialogConfig.size !== undefined) {
    setComponentInput(dialogRef, 'size', dialogConfig.size);
  }
  if (dialogConfig.modal !== undefined) {
    setComponentInput(dialogRef, 'modal', dialogConfig.modal);
  }
  if (dialogConfig.footerButtons !== undefined) {
    setComponentInput(dialogRef, 'footerButtons', dialogConfig.footerButtons);
  }
  if (dialogConfig.closeBy !== undefined) {
    setComponentInput(dialogRef, 'closeBy', dialogConfig.closeBy);
  }
  if (dialogConfig.content !== undefined) {
    setComponentInput(dialogRef, 'content', dialogConfig.content);
  }
  if (dialogConfig.movable !== undefined) {
    setComponentInput(dialogRef, 'movable', dialogConfig.movable);
  }
}

export async function createComponentDialog() {}
