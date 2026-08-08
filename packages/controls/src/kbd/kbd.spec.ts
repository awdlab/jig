import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { nova } from '@ngneers/controls-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import { NgnKbd } from './kbd';

@Component({
  imports: [NgnKbd],
  // Literal modifiers, so the expectation holds wherever the suite runs — `mod`
  // renders ⌘ on macOS and ⌃ everywhere else.
  template: `<ngn-kbd shortcut="ctrl+shift+a" />`,
})
class KbdHost {}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideNgnControls({ theme: { preset: nova }, disableAnimations: true })],
  });
});

describe('NgnKbd', () => {
  it('renders the shortcut glyphs inside a kbd element', () => {
    const fixture = TestBed.createComponent(KbdHost);
    fixture.detectChanges();
    const kbd = fixture.nativeElement.querySelector('kbd') as HTMLElement;
    expect(kbd.textContent?.trim()).toBe('⌃⇧A');
  });
});
