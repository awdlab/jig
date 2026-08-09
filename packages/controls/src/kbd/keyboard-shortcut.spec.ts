import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { NgnKeyboardShortcut, type NgnShortcutBinding } from './keyboard-shortcut';

@Component({
  imports: [NgnKeyboardShortcut],
  template: `
    <div [ngnKeyboardShortcut]="bindings()">
      <button id="inner">Inner</button>
      <input id="text" />
    </div>
  `,
})
class ScopeHost {
  public readonly bindings = signal<NgnShortcutBinding[]>([]);
  public readonly directive = viewChild.required(NgnKeyboardShortcut);
}

@Component({
  imports: [NgnKeyboardShortcut],
  template: `
    <div [ngnKeyboardShortcut]="outer()">
      <div [ngnKeyboardShortcut]="inner()">
        <button id="deep">Deep</button>
      </div>
    </div>
  `,
})
class NestedHost {
  public readonly outer = signal<NgnShortcutBinding[]>([]);
  public readonly inner = signal<NgnShortcutBinding[]>([]);
}

@Component({
  imports: [NgnKeyboardShortcut],
  template: `
    <div [ngnKeyboardShortcut]="bindings()">
      <button id="inner">Inner</button>
    </div>
  `,
})
class GlobalHost {
  public readonly bindings = signal<NgnShortcutBinding[]>([]);
}

/** Dispatches a bubbling keydown from outside every scope. */
function pressOutside(key: string, modifiers: Partial<KeyboardEventInit> = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...modifiers,
  });
  document.body.dispatchEvent(event);
  return event;
}

/** Dispatches a bubbling keydown from an element inside the scope. */
function press(
  root: HTMLElement,
  selector: string,
  key: string,
  modifiers: Partial<KeyboardEventInit> = {}
): KeyboardEvent {
  const target = root.querySelector(selector)!;
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...modifiers,
  });
  target.dispatchEvent(event);
  return event;
}

describe('NgnKeyboardShortcut', () => {
  it('fires the callback for a keydown from a focused descendant', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('save') },
    ]);
    fixture.detectChanges();

    const event = press(fixture.nativeElement, '#inner', 's', { ctrlKey: true });
    expect(calls).toEqual(['save']);
    expect(event.defaultPrevented).toBe(true);
  });

  it('ignores a non-matching combo', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('save') },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#inner', 's');
    expect(calls).toEqual([]);
  });

  it('ignores repeat events', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('save') },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#inner', 's', { ctrlKey: true, repeat: true });
    expect(calls).toEqual([]);
  });

  it('ignores a disabled binding', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('save'), disabled: true },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#inner', 's', { ctrlKey: true });
    expect(calls).toEqual([]);
  });

  it('suppresses a modifier-less combo inside a text input', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([{ shortcut: 'a', callback: () => calls.push('a') }]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#text', 'a');
    expect(calls).toEqual([]);

    press(fixture.nativeElement, '#inner', 'a');
    expect(calls).toEqual(['a']);
  });

  it('still fires a modifier combo inside a text input', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('save') },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#text', 's', { ctrlKey: true });
    expect(calls).toEqual(['save']);
  });

  it('still fires escape inside a text input', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'escape', callback: () => calls.push('escape') },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#text', 'Escape');
    expect(calls).toEqual(['escape']);
  });

  it('still fires a function key inside a text input', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([{ shortcut: 'f2', callback: () => calls.push('f2') }]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#text', 'F2');
    expect(calls).toEqual(['f2']);
  });

  it('still suppresses enter, backspace and arrowup inside a text input', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'enter', callback: () => calls.push('enter') },
      { shortcut: 'backspace', callback: () => calls.push('backspace') },
      { shortcut: 'arrowup', callback: () => calls.push('arrowup') },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#text', 'Enter');
    press(fixture.nativeElement, '#text', 'Backspace');
    press(fixture.nativeElement, '#text', 'ArrowUp');
    expect(calls).toEqual([]);
  });

  it('lets the inner scope win and does not reach the outer one', () => {
    const fixture = TestBed.createComponent(NestedHost);
    const calls: string[] = [];
    fixture.componentInstance.outer.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('outer') },
    ]);
    fixture.componentInstance.inner.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('inner') },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#deep', 's', { ctrlKey: true });
    expect(calls).toEqual(['inner']);
  });

  it('falls through to the outer scope when the inner one does not match', () => {
    const fixture = TestBed.createComponent(NestedHost);
    const calls: string[] = [];
    fixture.componentInstance.outer.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('outer') },
    ]);
    fixture.componentInstance.inner.set([
      { shortcut: 'ctrl+k', callback: () => calls.push('inner') },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#deep', 's', { ctrlKey: true });
    expect(calls).toEqual(['outer']);
  });

  it('checks registered bindings before the host bindings and unregisters on demand', () => {
    const fixture = TestBed.createComponent(ScopeHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+s', callback: () => calls.push('host') },
    ]);
    fixture.detectChanges();

    const unregister = fixture.componentInstance.directive().register(() => ({
      shortcut: 'ctrl+s',
      callback: () => calls.push('registered'),
    }));

    press(fixture.nativeElement, '#inner', 's', { ctrlKey: true });
    expect(calls).toEqual(['registered']);

    unregister();
    press(fixture.nativeElement, '#inner', 's', { ctrlKey: true });
    expect(calls).toEqual(['registered', 'host']);
  });
  it('a global binding fires for a keydown that never reaches the host', () => {
    const fixture = TestBed.createComponent(GlobalHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+k', callback: () => calls.push('palette'), global: true },
    ]);
    fixture.detectChanges();

    const event = pressOutside('k', { ctrlKey: true });

    expect(calls).toEqual(['palette']);
    expect(event.defaultPrevented).toBe(true);
  });

  it('a scoped binding ignores a keydown outside the host', () => {
    const fixture = TestBed.createComponent(GlobalHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+k', callback: () => calls.push('palette') },
    ]);
    fixture.detectChanges();

    pressOutside('k', { ctrlKey: true });

    expect(calls).toEqual([]);
  });

  it('mixes global and scoped bindings in one scope', () => {
    const fixture = TestBed.createComponent(GlobalHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+k', callback: () => calls.push('global'), global: true },
      { shortcut: 'ctrl+s', callback: () => calls.push('scoped') },
    ]);
    fixture.detectChanges();

    pressOutside('k', { ctrlKey: true });
    pressOutside('s', { ctrlKey: true });
    expect(calls).toEqual(['global']);

    press(fixture.nativeElement, '#inner', 's', { ctrlKey: true });
    expect(calls).toEqual(['global', 'scoped']);
  });

  it('runs a global binding pressed inside the host exactly once', () => {
    const fixture = TestBed.createComponent(GlobalHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+k', callback: () => calls.push('palette'), global: true },
    ]);
    fixture.detectChanges();

    press(fixture.nativeElement, '#inner', 'k', { ctrlKey: true });

    expect(calls).toEqual(['palette']);
  });

  it('stops listening on the document once the global binding goes away', () => {
    const fixture = TestBed.createComponent(GlobalHost);
    const calls: string[] = [];
    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+k', callback: () => calls.push('palette'), global: true },
    ]);
    fixture.detectChanges();

    fixture.componentInstance.bindings.set([
      { shortcut: 'ctrl+k', callback: () => calls.push('palette') },
    ]);
    fixture.detectChanges();

    pressOutside('k', { ctrlKey: true });

    expect(calls).toEqual([]);
  });
});
