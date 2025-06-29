import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  untracked,
  viewChild,
} from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api';
import { generateElementId } from '@ngneers/controls/utils';

import { DialogTemplates } from './dialog-templates';

@Component({
  selector: 'ngn-dialog',
  imports: [NgTemplateOutlet, NgnTemplate],
  templateUrl: './dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog extends DialogTemplates {
  protected readonly headerId = generateElementId();

  private readonly _dialogElement = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public readonly open = input(true);
  public readonly modal = input(false);
  public readonly autofocus = input(this.modal());
  public readonly title = input<string | null>(null);

  constructor() {
    super();
    afterRenderEffect(() => {
      if (this.open()) {
        if (untracked(this.modal)) {
          this._dialogElement().nativeElement.showModal();
        } else {
          this._dialogElement().nativeElement.show();
        }
      } else {
        this._dialogElement().nativeElement.close();
      }
    });
  }
}
