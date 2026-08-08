import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { nova } from '@ngneers/controls-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import { NgnRadio } from './radio';
import { NgnRadioGroup } from './radio-group';

@Component({
  imports: [NgnRadioGroup, NgnRadio],
  template: `
    <ngn-radio-group
      [value]="value()"
      (valueChange)="value.set($event)"
      [disabled]="disabled()"
      [readonly]="readonly()"
    >
      <ngn-radio value="a">A</ngn-radio>
      <ngn-radio value="b" [disabled]="bDisabled()">B</ngn-radio>
      <ngn-radio value="c">C</ngn-radio>
    </ngn-radio-group>
  `,
})
class Host {
  value = signal<string | undefined>(undefined);
  disabled = signal(false);
  readonly = signal(false);
  bDisabled = signal(false);
  group = viewChild.required(NgnRadioGroup);
}

function press(host: HTMLElement, key: string): KeyboardEvent {
  const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  host.dispatchEvent(ev);
  return ev;
}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideNgnControls({ theme: { preset: nova }, disableAnimations: true })],
  });
});

function setup() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  const groupEl = fixture.nativeElement.querySelector('ngn-radio-group') as HTMLElement;
  const radios = Array.from(fixture.nativeElement.querySelectorAll('ngn-radio')) as HTMLElement[];
  return { fixture, groupEl, radios };
}

describe('ngn-radio-group value ownership', () => {
  it('the group host has role=radiogroup and children role=radio', () => {
    const { groupEl, radios } = setup();
    expect(groupEl.getAttribute('role')).toBe('radiogroup');
    expect(radios.every(r => r.getAttribute('role') === 'radio')).toBe(true);
  });

  it('reflects the selected value via aria-checked on the matching child', () => {
    const { fixture, radios } = setup();
    fixture.componentInstance.value.set('b');
    fixture.detectChanges();
    expect(radios[0]!.getAttribute('aria-checked')).toBe('false');
    expect(radios[1]!.getAttribute('aria-checked')).toBe('true');
    expect(radios[2]!.getAttribute('aria-checked')).toBe('false');
  });

  it('clicking a radio (pointerdown) selects its payload on the group', () => {
    const { fixture, radios } = setup();
    radios[2]!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('c');
    expect(radios[2]!.getAttribute('aria-checked')).toBe('true');
  });
});

describe('ngn-radio-group selection follows focus', () => {
  it('ArrowRight selects the next radio', () => {
    const { fixture, groupEl } = setup();
    fixture.componentInstance.value.set('a');
    fixture.detectChanges();
    press(groupEl, 'ArrowRight');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('b');
  });

  it('ArrowRight skips a disabled radio', () => {
    const { fixture, groupEl } = setup();
    fixture.componentInstance.bDisabled.set(true);
    fixture.componentInstance.value.set('a');
    fixture.detectChanges();
    press(groupEl, 'ArrowRight');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('c');
  });

  it('the checked radio is the group tab stop (tabindex=0)', () => {
    const { fixture, radios } = setup();
    fixture.componentInstance.value.set('c');
    fixture.detectChanges();
    expect(radios[2]!.getAttribute('tabindex')).toBe('0');
    expect(radios[0]!.getAttribute('tabindex')).toBe('-1');
  });
});

describe('ngn-radio-group disabled / readonly', () => {
  it('a group-disabled radio exposes aria-disabled and blocks selection', () => {
    const { fixture, groupEl, radios } = setup();
    fixture.componentInstance.disabled.set(true);
    fixture.componentInstance.value.set('a');
    fixture.detectChanges();
    expect(radios.every(r => r.getAttribute('aria-disabled') === 'true')).toBe(true);
    press(groupEl, 'ArrowRight');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('a');
  });

  it('readonly navigates focus but does not change the value', () => {
    const { fixture, groupEl } = setup();
    fixture.componentInstance.readonly.set(true);
    fixture.componentInstance.value.set('a');
    fixture.detectChanges();
    press(groupEl, 'ArrowRight');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('a');
  });

  it('an individually disabled radio is aria-disabled but others still work', () => {
    const { fixture, radios } = setup();
    fixture.componentInstance.bDisabled.set(true);
    fixture.detectChanges();
    expect(radios[1]!.getAttribute('aria-disabled')).toBe('true');
    radios[2]!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('c');
  });
});
