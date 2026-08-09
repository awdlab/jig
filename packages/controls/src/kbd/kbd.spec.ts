import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideJigControls } from '@awdlab/jig/api/ng';
import { nova } from '@awdlab/jig-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import { JigKbd } from './kbd';

@Component({
  imports: [JigKbd],
  // Literal modifiers, so the expectation holds wherever the suite runs — `mod`
  // renders ⌘ on macOS and ⌃ everywhere else.
  template: `<jig-kbd shortcut="ctrl+shift+a" />`,
})
class KbdHost {}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideJigControls({ theme: { preset: nova }, disableAnimations: true })],
  });
});

describe('JigKbd', () => {
  it('renders the shortcut glyphs inside a kbd element', () => {
    const fixture = TestBed.createComponent(KbdHost);
    fixture.detectChanges();
    const kbd = fixture.nativeElement.querySelector('kbd') as HTMLElement;
    expect(kbd.textContent?.trim()).toBe('⌃⇧A');
  });
});
