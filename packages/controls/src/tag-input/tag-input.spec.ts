import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideJigControls } from '@awdlab/jig/api/ng';
import { withDefaultIcons } from '@awdlab/jig/default-icons';
import { I18n } from '@awdlab/jig/i18n';
import { nova } from '@awdlab/jig-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import { JigTagInput } from './tag-input';

import type { TagRejection, TagSuggestions } from './types';

@Component({
  imports: [JigTagInput],
  template: `
    <jig-tag-input
      #tags
      inputId="tags"
      [delimiters]="','"
      [allowDuplicates]="allowDuplicates()"
      [maxTags]="maxTags()"
      [minTagLength]="minTagLength()"
      [maxTagLength]="maxTagLength()"
      [multiline]="multiline()"
      [readonly]="readonly()"
      [disabled]="disabled()"
      [required]="required()"
    />
  `,
})
class Host {
  public allowDuplicates = signal(false);
  public maxTags = signal<number | undefined>(undefined);
  public minTagLength = signal<number | undefined>(undefined);
  public maxTagLength = signal<number | undefined>(undefined);
  public multiline = signal(false);
  public readonly = signal(false);
  public disabled = signal(false);
  public required = signal(false);
  public tags = viewChild.required<JigTagInput>('tags');
}

function setup() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  return {
    fixture,
    host: fixture.componentInstance,
    tags: fixture.componentInstance.tags(),
    root: fixture.nativeElement as HTMLElement,
  };
}

/**
 * Puts `text` into the field the way typing would. The element is the control's
 * authoritative source for pending text, so setting `pendingText` alone is not
 * enough to drive a commit.
 */
function typeInto(root: HTMLElement, text: string): void {
  const input = root.querySelector('input')!;
  input.value = text;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function collectRejections(tags: JigTagInput): TagRejection[] {
  const rejections: TagRejection[] = [];
  tags.rejected.subscribe(rejection => rejections.push(rejection));
  return rejections;
}

/** Detects changes until the async default-language import has landed. */
async function flush(fixture: { detectChanges: () => void }): Promise<void> {
  const i18n = TestBed.inject(I18n);
  for (let i = 0; i < 25; i++) {
    fixture.detectChanges();
    if (i18n.translations._unsafe['tagInput_added']({ tag: 'x' }) !== 'tagInput_added') {
      break;
    }
    await new Promise(resolve => setTimeout(resolve));
  }
  fixture.detectChanges();
}

describe('jig-tag-input', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideJigControls(
          { theme: { preset: nova }, disableAnimations: true },
          withDefaultIcons()
        ),
      ],
    });
  });

  it('starts with a null value, not an empty array', () => {
    const { tags } = setup();

    expect(tags.value()).toBeNull();
    expect(tags.empty()).toBe(true);
  });

  it('commits a tag and reports not empty', () => {
    const { fixture, tags } = setup();

    expect(tags.addTag('alpha')).toBe(true);
    fixture.detectChanges();

    expect(tags.value()).toEqual(['alpha']);
    expect(tags.empty()).toBe(false);
  });

  it('counts pending text as not empty so a field label can float', () => {
    const { fixture, tags } = setup();

    tags.pendingText.set('typ');
    fixture.detectChanges();

    expect(tags.value()).toBeNull();
    expect(tags.empty()).toBe(false);
  });

  it('returns to null when the last tag is removed', () => {
    const { fixture, tags } = setup();

    tags.addTag('alpha');
    fixture.detectChanges();
    expect(tags.removeTag(0)).toBe(true);
    fixture.detectChanges();

    expect(tags.value()).toBeNull();
  });

  it('keeps an array while other tags remain', () => {
    const { fixture, tags } = setup();

    tags.addTag('alpha');
    tags.addTag('beta');
    fixture.detectChanges();
    tags.removeTag(0);
    fixture.detectChanges();

    expect(tags.value()).toEqual(['beta']);
  });

  it('clearValue writes null', () => {
    const { fixture, tags } = setup();

    tags.addTag('alpha');
    tags.addTag('beta');
    fixture.detectChanges();

    expect(tags.clearValue()).toBe(true);
    fixture.detectChanges();

    expect(tags.value()).toBeNull();
  });

  it('trims before committing', () => {
    const { tags } = setup();

    tags.addTag('  alpha  ');

    expect(tags.value()).toEqual(['alpha']);
  });

  it('ignores blank text without rejecting', () => {
    const { tags } = setup();
    const rejections = collectRejections(tags);

    expect(tags.addTag('   ')).toBe(false);
    expect(tags.value()).toBeNull();
    expect(rejections).toEqual([]);
  });

  it('rejects a duplicate', () => {
    const { fixture, tags } = setup();
    const rejections = collectRejections(tags);

    tags.addTag('alpha');
    fixture.detectChanges();

    expect(tags.addTag('alpha')).toBe(false);
    expect(tags.value()).toEqual(['alpha']);
    expect(rejections).toEqual([{ text: 'alpha', reason: 'duplicate' }]);
  });

  it('allows a duplicate when allowDuplicates is set', () => {
    const { fixture, host, tags } = setup();
    host.allowDuplicates.set(true);
    fixture.detectChanges();

    tags.addTag('alpha');
    fixture.detectChanges();

    expect(tags.addTag('alpha')).toBe(true);
    expect(tags.value()).toEqual(['alpha', 'alpha']);
  });

  it('rejects text shorter than minTagLength and keeps it pending', () => {
    const { fixture, host, tags } = setup();
    host.minTagLength.set(3);
    fixture.detectChanges();
    const rejections = collectRejections(tags);

    tags.pendingText.set('ab');
    expect(tags.addTag('ab')).toBe(false);
    expect(tags.value()).toBeNull();
    expect(tags.pendingText()).toBe('ab');
    expect(rejections).toEqual([{ text: 'ab', reason: 'tooShort' }]);

    expect(tags.addTag('abc')).toBe(true);
    expect(tags.value()).toEqual(['abc']);
  });

  it('rejects once maxTags is reached and reports full', () => {
    const { fixture, host, tags } = setup();
    host.maxTags.set(2);
    fixture.detectChanges();
    const rejections = collectRejections(tags);

    tags.addTag('a');
    tags.addTag('b');
    fixture.detectChanges();
    expect(tags.full()).toBe(true);

    expect(tags.addTag('c')).toBe(false);
    expect(tags.value()).toEqual(['a', 'b']);
    expect(rejections).toEqual([{ text: 'c', reason: 'maxTags' }]);
  });

  it('marks the field readonly at maxTags', () => {
    const { fixture, host, tags, root } = setup();
    host.maxTags.set(1);
    fixture.detectChanges();

    tags.addTag('alpha');
    fixture.detectChanges();

    expect(root.querySelector<HTMLInputElement>('input')!.readOnly).toBe(true);
  });

  it('reflects maxTagLength as the field maxlength', () => {
    const { fixture, host, root } = setup();
    host.maxTagLength.set(6);
    fixture.detectChanges();

    expect(root.querySelector('input')!.getAttribute('maxlength')).toBe('6');
  });

  it('splits pending text on a delimiter and keeps the remainder', () => {
    const { fixture, tags, root } = setup();

    typeInto(root, 'alpha,beta,');
    tags.commitPendingDelimited();
    fixture.detectChanges();

    expect(tags.value()).toEqual(['alpha', 'beta']);
    expect(tags.pendingText()).toBe('');
  });

  it('leaves an unterminated fragment pending', () => {
    const { fixture, tags, root } = setup();

    typeInto(root, 'alpha,bet');
    tags.commitPendingDelimited();
    fixture.detectChanges();

    expect(tags.value()).toEqual(['alpha']);
    expect(tags.pendingText()).toBe('bet');
  });

  it('stops splitting at maxTags and hands back the remainder', () => {
    const { fixture, host, tags, root } = setup();
    host.maxTags.set(2);
    fixture.detectChanges();

    typeInto(root, 'a,b,c,d');
    tags.commitPendingDelimited();
    fixture.detectChanges();

    expect(tags.value()).toEqual(['a', 'b']);
    expect(tags.pendingText()).toBe('c,d');
  });

  it('splits a pasted payload on delimiters and newlines', () => {
    const { fixture, tags, root } = setup();
    const input = root.querySelector('input')!;

    const event = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', {
      value: { getData: () => 'one,two\nthree' },
    });
    input.dispatchEvent(event);
    fixture.detectChanges();

    expect(tags.value()).toEqual(['one', 'two']);
    expect(tags.pendingText()).toBe('three');
    expect(event.defaultPrevented).toBe(true);
  });

  it('leaves a single-tag paste to the browser', () => {
    const { fixture, tags, root } = setup();
    const input = root.querySelector('input')!;

    const event = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => 'plain' } });
    input.dispatchEvent(event);
    fixture.detectChanges();

    expect(tags.value()).toBeNull();
    expect(event.defaultPrevented).toBe(false);
  });

  it('removes the last tag on Backspace with an empty field', () => {
    const { fixture, tags, root } = setup();

    tags.addTag('alpha');
    tags.addTag('beta');
    fixture.detectChanges();

    root
      .querySelector('input')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    fixture.detectChanges();

    expect(tags.value()).toEqual(['alpha']);
  });

  it('leaves Backspace to the caret while text is pending', () => {
    const { fixture, tags, root } = setup();

    tags.addTag('alpha');
    typeInto(root, 'be');
    fixture.detectChanges();

    root
      .querySelector('input')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    fixture.detectChanges();

    expect(tags.value()).toEqual(['alpha']);
  });

  it('renders a remove button per tag, labelled with the tag', async () => {
    const { fixture, tags, root } = setup();

    tags.addTag('alpha');
    tags.addTag('beta');
    await flush(fixture);

    const buttons = root.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]!.getAttribute('aria-label')).toBe('Remove alpha');
  });

  it('hides the remove buttons when readonly or disabled', () => {
    const { fixture, host, tags, root } = setup();

    tags.addTag('alpha');
    fixture.detectChanges();
    expect(root.querySelectorAll('button')).toHaveLength(1);

    host.readonly.set(true);
    fixture.detectChanges();
    expect(root.querySelectorAll('button')).toHaveLength(0);

    host.readonly.set(false);
    host.disabled.set(true);
    fixture.detectChanges();
    expect(root.querySelectorAll('button')).toHaveLength(0);
  });

  it('swaps the layout state class between modes', () => {
    const { fixture, host, root } = setup();

    expect(root.querySelector('.jig-tag-input-single-line')).not.toBeNull();
    expect(root.querySelector('.jig-tag-input-multiline')).toBeNull();

    host.multiline.set(true);
    fixture.detectChanges();

    expect(root.querySelector('.jig-tag-input-single-line')).toBeNull();
    expect(root.querySelector('.jig-tag-input-multiline')).not.toBeNull();
  });

  it('announces additions and rejections into the live region', async () => {
    const { fixture, tags, root } = setup();

    tags.addTag('alpha');
    await flush(fixture);

    const liveRegion = root.querySelector('[role="status"]')!;
    expect(liveRegion.getAttribute('aria-live')).toBe('polite');
    expect(liveRegion.textContent?.trim()).toBe('alpha added');

    tags.addTag('alpha');
    await flush(fixture);
    expect(liveRegion.textContent?.trim()).toBe('alpha is already added');

    // The same refusal again still reaches the region: same wording, different node value.
    const firstRejection = liveRegion.textContent;
    tags.addTag('alpha');
    await flush(fixture);
    expect(liveRegion.textContent?.trim()).toBe('alpha is already added');
    expect(liveRegion.textContent).not.toBe(firstRejection);

    tags.removeTag(0);
    await flush(fixture);
    expect(liveRegion.textContent?.trim()).toBe('alpha removed');
  });

  it('exposes the combobox contract on the field', () => {
    const { root } = setup();
    const input = root.querySelector('input')!;

    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-haspopup')).toBe('listbox');
    expect(input.id).toBe('tags');
  });

  it('reflects required as aria-required', () => {
    const { fixture, host, root } = setup();

    expect(root.querySelector('input')!.getAttribute('aria-required')).toBeNull();

    host.required.set(true);
    fixture.detectChanges();

    expect(root.querySelector('input')!.getAttribute('aria-required')).toBe('true');
  });
});

@Component({
  imports: [JigTagInput],
  template: `
    <jig-tag-input #tags inputId="tags" [suggestions]="suggestions()" [suggestionsDebounce]="0" />
  `,
})
class SuggestionHost {
  public suggestions = signal<TagSuggestions | undefined>(['alpha', 'beta', 'gamma']);
  public tags = viewChild.required<JigTagInput>('tags');
}

describe('jig-tag-input suggestions', () => {
  beforeEach(() => {
    Element.prototype.scrollTo ??= () => undefined;
    HTMLElement.prototype.togglePopover ??= () => true;
    HTMLElement.prototype.showPopover ??= () => undefined;
    HTMLElement.prototype.hidePopover ??= () => undefined;

    TestBed.configureTestingModule({
      providers: [
        provideJigControls(
          { theme: { preset: nova }, disableAnimations: true },
          withDefaultIcons()
        ),
      ],
    });
  });

  /**
   * Drains macrotasks so the debounced text signal and the async suggestion
   * resolution both land — `whenStable()` alone does not await a `setTimeout`.
   */
  async function settle(fixture: {
    detectChanges: () => void;
    whenStable: () => Promise<unknown>;
  }): Promise<void> {
    for (let i = 0; i < 5; i++) {
      fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve));
      await fixture.whenStable();
    }
    fixture.detectChanges();
  }

  async function suggestionSetup() {
    const fixture = TestBed.createComponent(SuggestionHost);
    await settle(fixture);
    return { fixture, host: fixture.componentInstance, tags: fixture.componentInstance.tags() };
  }

  it('offers a static list as items', async () => {
    const { tags } = await suggestionSetup();

    expect(tags.resolvedSuggestions().map(item => item.value)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('subtracts tags already added', async () => {
    const { fixture, tags } = await suggestionSetup();

    tags.addTag('beta');
    await settle(fixture);

    expect(tags.resolvedSuggestions().map(item => item.value)).toEqual(['alpha', 'gamma']);
  });

  it('passes the typed text and current tags to a callback', async () => {
    const { fixture, host, tags } = await suggestionSetup();
    const calls: [string, readonly string[]][] = [];

    host.suggestions.set((text, current) => {
      calls.push([text, [...current]]);
      return ['from-callback'];
    });
    tags.addTag('alpha');
    tags.pendingText.set('fr');
    await settle(fixture);

    expect(calls.at(-1)).toEqual(['fr', ['alpha']]);
    expect(tags.resolvedSuggestions().map(item => item.value)).toEqual(['from-callback']);
  });

  it('resolves an async callback', async () => {
    const { fixture, host, tags } = await suggestionSetup();

    host.suggestions.set(async () => ['async-one', 'async-two']);
    await settle(fixture);

    expect(tags.resolvedSuggestions().map(item => item.value)).toEqual(['async-one', 'async-two']);
  });

  it('accepts items whose label differs from the committed value', async () => {
    const { fixture, host, tags } = await suggestionSetup();

    host.suggestions.set([{ label: 'Alpha Team', value: 'alpha' }]);
    await settle(fixture);

    expect(tags.resolvedSuggestions()).toEqual([{ label: 'Alpha Team', value: 'alpha' }]);
  });

  it('commits a picked suggestion and clears the pending text', async () => {
    const { fixture, tags } = await suggestionSetup();

    tags.pendingText.set('be');
    tags.pickSuggestion('beta');
    fixture.detectChanges();

    expect(tags.value()).toEqual(['beta']);
    expect(tags.pendingText()).toBe('');
  });

  it('filters a static list through the list box, not the callback path', async () => {
    const { fixture, host, tags } = await suggestionSetup();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('jig-dropdown-list')).not.toBeNull();

    host.suggestions.set(() => ['only']);
    await settle(fixture);

    // A callback owns its own filtering, so the list box filter is off.
    expect(tags.resolvedSuggestions().map(item => item.value)).toEqual(['only']);
  });

  it('renders no dropdown at all without suggestions', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('jig-dropdown-list')).toBeNull();
  });
});
