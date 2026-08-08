import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { NgnActionButton } from '@ngneers/controls/button';
import { NgnDialog } from '@ngneers/controls/dialog';
import { nova } from '@ngneers/controls-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import type { NgnActionButtonConfig } from '@ngneers/controls/api';

@Component({
  imports: [NgnDialog],
  template: `
    <ngn-dialog
      title="Confirm"
      [open]="true"
      [footerButtons]="buttons()"
      (buttonClicked)="clicked.push($event)"
    >
      <input id="text" />
    </ngn-dialog>
  `,
})
class DialogHost {
  // buttonClicked emits `value | null`, so the collector must admit null.
  public readonly clicked: (string | null)[] = [];
  public readonly buttons = signal<NgnActionButtonConfig<string>[]>([
    { label: 'Save', value: 'save', shortcut: 'ctrl+s' },
  ]);
}

@Component({
  imports: [NgnDialog, NgnActionButton],
  template: `
    <ngn-dialog title="Rename" [open]="true">
      <input id="field" />
      <ng-template #footer>
        <ngn-action-button [config]="button" (clicked)="clicked.push($event)" />
      </ng-template>
    </ngn-dialog>
  `,
})
class CustomFooterHost {
  public readonly clicked: string[] = [];
  public readonly button: NgnActionButtonConfig<string> = {
    label: 'Save',
    value: 'save',
    shortcut: 'ctrl+s',
  };
}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideNgnControls({ theme: { preset: nova }, disableAnimations: true })],
  });
});

describe('dialog footer button shortcuts', () => {
  it('fires the footer button shortcut from a focused field inside the dialog', () => {
    const fixture = TestBed.createComponent(DialogHost);
    fixture.detectChanges();

    fixture.nativeElement
      .querySelector('#text')!
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true, cancelable: true })
      );

    expect(fixture.componentInstance.clicked).toEqual(['save']);
  });

  it('fires the shortcut for an action button inside a consumer-supplied footer template', () => {
    const fixture = TestBed.createComponent(CustomFooterHost);
    fixture.detectChanges();

    fixture.nativeElement
      .querySelector('#field')!
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true, cancelable: true })
      );

    expect(fixture.componentInstance.clicked).toEqual(['save']);
  });
});
