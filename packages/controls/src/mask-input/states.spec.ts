import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideJigControls } from '@awdlab/jig/api/ng';
import { nova } from '@awdlab/jig-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import { JigMaskInput } from './mask-input';

@Component({
  imports: [JigMaskInput],
  template: `
    <jig-mask-input
      mask="time"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [invalid]="invalid()"
      invalidOn="immediate"
    />
  `,
})
class Host {
  protected readonly disabled = signal(false);
  protected readonly readonly = signal(false);
  protected readonly invalid = signal(false);
  public readonly state = {
    disabled: this.disabled,
    readonly: this.readonly,
    invalid: this.invalid,
  };
}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideJigControls({ theme: { preset: nova }, disableAnimations: true })],
  });
});

function setup() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  const host = fixture.nativeElement.querySelector('jig-mask-input') as HTMLElement;
  const proxy = host.querySelector('input') as HTMLInputElement;
  return { fixture, host, proxy, state: fixture.componentInstance.state };
}

describe('jig-mask-input states', () => {
  it('is neutral by default', () => {
    const { host, proxy } = setup();
    expect(host.className).not.toContain('jig-mask-input-disabled');
    expect(host.className).not.toContain('jig-mask-input-readonly');
    expect(host.className).not.toContain('jig-mask-input-invalid');
    expect(proxy.getAttribute('aria-invalid')).toBeNull();
    expect(proxy.getAttribute('aria-readonly')).toBeNull();
  });

  it('exposes disabled as a theme class and a disabled proxy', () => {
    const { fixture, host, proxy, state } = setup();
    state.disabled.set(true);
    fixture.detectChanges();
    expect(host.className).toContain('jig-mask-input-disabled');
    expect(proxy.disabled).toBe(true);
  });

  it('exposes readonly as a theme class, aria-readonly and the native attribute', () => {
    const { fixture, host, proxy, state } = setup();
    state.readonly.set(true);
    fixture.detectChanges();
    expect(host.className).toContain('jig-mask-input-readonly');
    expect(proxy.getAttribute('aria-readonly')).toBe('true');
    expect(proxy.hasAttribute('readonly')).toBe(true);
  });

  it('exposes invalid as a theme class and aria-invalid once the trigger allows it', () => {
    const { fixture, host, proxy, state } = setup();
    state.invalid.set(true);
    fixture.detectChanges();
    expect(host.className).toContain('jig-mask-input-invalid');
    expect(proxy.getAttribute('aria-invalid')).toBe('true');
  });

  it('is a single tab stop in every state', () => {
    const { fixture, host, state } = setup();
    for (const flag of [state.readonly, state.disabled]) {
      flag.set(true);
      fixture.detectChanges();
      const stops = [...host.querySelectorAll<HTMLElement>('*')].filter(
        el => (el.tabIndex ?? -1) >= 0
      );
      expect(stops).toHaveLength(1);
      expect(stops[0]!.tagName).toBe('INPUT');
      flag.set(false);
    }
  });

  it('has no selectable sections while readonly', () => {
    const { fixture, host, proxy, state } = setup();
    state.readonly.set(true);
    fixture.detectChanges();

    const sections = [...host.querySelectorAll<HTMLElement>('[role="spinbutton"]')];
    proxy.dispatchEvent(new FocusEvent('focus'));
    sections[1]!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    proxy.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    // No active-section highlight, and the proxy owns no active descendant.
    expect(host.querySelector('[class*="section-active"]')).toBeNull();
    expect(proxy.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('highlights the active section again once readonly is lifted', () => {
    const { fixture, host, proxy, state } = setup();
    state.readonly.set(true);
    fixture.detectChanges();
    state.readonly.set(false);
    fixture.detectChanges();

    proxy.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(host.querySelector('[class*="section-active"]')).not.toBeNull();
    expect(proxy.getAttribute('aria-activedescendant')).not.toBeNull();
  });

  it('rejects typing while readonly', () => {
    const { fixture, host, proxy, state } = setup();
    state.readonly.set(true);
    fixture.detectChanges();
    proxy.dispatchEvent(
      new InputEvent('beforeinput', {
        data: '1',
        inputType: 'insertText',
        bubbles: true,
        cancelable: true,
      })
    );
    fixture.detectChanges();
    expect(host.textContent).toContain('HH');
  });
});
