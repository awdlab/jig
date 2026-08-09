import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideAwdControls } from '@awdlab/jig/api/ng';
import { AwdActionButton } from '@awdlab/jig/button';
import { AwdDialog } from '@awdlab/jig/dialog';
import { nova } from '@awdlab/jig-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import type { AwdActionButtonConfig } from '@awdlab/jig/api';

@Component({
  imports: [AwdDialog],
  template: `
    <jig-dialog
      title="Confirm"
      [open]="true"
      [footerButtons]="buttons()"
      (buttonClicked)="clicked.push($event)"
    >
      <input id="text" />
    </jig-dialog>
  `,
})
class DialogHost {
  // buttonClicked emits `value | null`, so the collector must admit null.
  public readonly clicked: (string | null)[] = [];
  public readonly buttons = signal<AwdActionButtonConfig<string>[]>([
    { label: 'Save', value: 'save', shortcut: 'ctrl+s' },
  ]);
}

@Component({
  imports: [AwdDialog, AwdActionButton],
  template: `
    <jig-dialog title="Rename" [open]="true">
      <input id="field" />
      <ng-template #footer>
        <jig-action-button [config]="button" (clicked)="clicked.push($event)" />
      </ng-template>
    </jig-dialog>
  `,
})
class CustomFooterHost {
  public readonly clicked: string[] = [];
  public readonly button: AwdActionButtonConfig<string> = {
    label: 'Save',
    value: 'save',
    shortcut: 'ctrl+s',
  };
}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideAwdControls({ theme: { preset: nova }, disableAnimations: true })],
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
