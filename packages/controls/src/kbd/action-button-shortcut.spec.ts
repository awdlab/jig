import { Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideAwdControls } from '@awdlab/jig/api/ng';
import { AwdActionButton } from '@awdlab/jig/button';
import { withDefaultIcons } from '@awdlab/jig/default-icons';
import { nova } from '@awdlab/jig-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import { AwdKeyboardShortcut } from './keyboard-shortcut';

import type { AwdActionButtonConfig } from '@awdlab/jig/api';

@Component({
  imports: [AwdActionButton, AwdKeyboardShortcut],
  template: `
    <div [ngnKeyboardShortcut]="[]">
      <jig-action-button [config]="config()" (clicked)="clicked.push($event)" />
      <input id="text" />
    </div>
  `,
})
class ScopedActionButtonHost {
  public readonly actions: string[] = [];
  public readonly clicked: string[] = [];
  public readonly config = signal<AwdActionButtonConfig<string>>({
    label: 'Save',
    value: 'save',
    shortcut: 'ctrl+s',
    action: () => this.actions.push('action'),
  });
}

/** Reproduces a wrapper that conditionally wraps projected content in a scope, e.g. a dialog shell. */
@Component({
  selector: 'toggleable-scope-wrapper',
  imports: [AwdKeyboardShortcut],
  template: `
    @if (enabled()) {
      <div [ngnKeyboardShortcut]="[]"><ng-content /></div>
    }
  `,
})
class ToggleableScopeWrapper {
  public readonly enabled = input(true);
}

@Component({
  imports: [AwdActionButton, ToggleableScopeWrapper],
  template: `
    <toggleable-scope-wrapper [enabled]="scoped()">
      <jig-action-button [config]="config()" (clicked)="clicked.push($event)" />
    </toggleable-scope-wrapper>
  `,
})
class ReResolvingScopeHost {
  public readonly scoped = signal(true);
  public readonly clicked: string[] = [];
  public readonly config = signal<AwdActionButtonConfig<string>>({
    label: 'Save',
    value: 'save',
    shortcut: 'ctrl+s',
  });
}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      provideAwdControls({ theme: { preset: nova }, disableAnimations: true }, withDefaultIcons()),
    ],
  });
});

function press(root: HTMLElement, selector: string, key: string, ctrlKey = true): void {
  root
    .querySelector(selector)!
    .dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey, bubbles: true, cancelable: true }));
}

describe('action button shortcut', () => {
  it('runs the config action and emits clicked when the combo is pressed', () => {
    const fixture = TestBed.createComponent(ScopedActionButtonHost);
    fixture.detectChanges();

    press(fixture.nativeElement, '#text', 's');
    expect(fixture.componentInstance.actions).toEqual(['action']);
    expect(fixture.componentInstance.clicked).toEqual(['save']);
  });

  it('renders the glyphs and exposes ARIA-valid aria-keyshortcuts', () => {
    const fixture = TestBed.createComponent(ScopedActionButtonHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.getAttribute('aria-keyshortcuts')).toBe('Control+S');
    expect(button.querySelector('kbd')?.textContent?.trim()).toBe('⌃S');
  });

  it('hides the glyphs from the accessible name', () => {
    const fixture = TestBed.createComponent(ScopedActionButtonHost);
    fixture.detectChanges();

    const kbd = fixture.nativeElement.querySelector('jig-kbd') as HTMLElement;
    expect(kbd.getAttribute('aria-hidden')).toBe('true');
  });

  it('does not advertise aria-keyshortcuts when no ancestor scope resolves', () => {
    @Component({
      imports: [AwdActionButton],
      template: `<jig-action-button [config]="config()" />`,
    })
    class UnscopedActionButtonHost {
      public readonly config = signal<AwdActionButtonConfig<string>>({
        label: 'Save',
        value: 'save',
        shortcut: 'ctrl+s',
      });
    }

    const fixture = TestBed.createComponent(UnscopedActionButtonHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.getAttribute('aria-keyshortcuts')).toBeNull();
  });

  it('gives a plain icon-kind button an accessible name with no shortcut', () => {
    @Component({
      imports: [AwdActionButton],
      template: `<jig-action-button [config]="config()" />`,
    })
    class IconOnlyActionButtonHost {
      public readonly config = signal<AwdActionButtonConfig<string>>({
        label: 'Close',
        value: 'close',
        defaultIcon: 'dialog-close',
      });
    }

    const fixture = TestBed.createComponent(IconOnlyActionButtonHost);
    fixture.detectChanges();
    TestBed.tick();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.getAttribute('aria-label')).toBe('Close');
  });

  it('names an icon-kind button with a shortcut by its plain label, glyphs hidden', () => {
    @Component({
      imports: [AwdActionButton, AwdKeyboardShortcut],
      template: `
        <div [ngnKeyboardShortcut]="[]">
          <jig-action-button [config]="config()" />
        </div>
      `,
    })
    class IconShortcutActionButtonHost {
      public readonly config = signal<AwdActionButtonConfig<string>>({
        label: 'Save',
        value: 'save',
        defaultIcon: 'dialog-close',
        shortcut: 'ctrl+s',
      });
    }

    const fixture = TestBed.createComponent(IconShortcutActionButtonHost);
    fixture.detectChanges();
    TestBed.tick();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.getAttribute('aria-label')).toBe('Save');
    const kbd = fixture.nativeElement.querySelector('jig-kbd') as HTMLElement;
    expect(kbd.getAttribute('aria-hidden')).toBe('true');
    expect(kbd.querySelector('kbd')?.textContent?.trim()).toBe('⌃S');
  });

  it('does not fire while the config is disabled', () => {
    const fixture = TestBed.createComponent(ScopedActionButtonHost);
    fixture.detectChanges();
    fixture.componentInstance.config.update(config => ({ ...config, disabled: true }));
    fixture.detectChanges();

    press(fixture.nativeElement, '#text', 's');
    expect(fixture.componentInstance.clicked).toEqual([]);
  });

  it('stops listening once the shortcut is removed from the config', () => {
    const fixture = TestBed.createComponent(ScopedActionButtonHost);
    fixture.detectChanges();
    fixture.componentInstance.config.update(config => ({ ...config, shortcut: undefined }));
    fixture.detectChanges();

    press(fixture.nativeElement, '#text', 's');
    expect(fixture.componentInstance.clicked).toEqual([]);
  });

  it('re-resolves its scope when the scope is torn down and recreated around it', () => {
    const fixture = TestBed.createComponent(ReResolvingScopeHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    const pressButton = () =>
      button.dispatchEvent(
        new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true, cancelable: true })
      );

    pressButton();
    expect(fixture.componentInstance.clicked).toEqual(['save']);

    fixture.componentInstance.scoped.set(false);
    fixture.detectChanges();
    pressButton();
    expect(fixture.componentInstance.clicked).toEqual(['save']);

    fixture.componentInstance.scoped.set(true);
    fixture.detectChanges();
    pressButton();
    expect(fixture.componentInstance.clicked).toEqual(['save', 'save']);
  });
});
