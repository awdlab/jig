import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { NgnRovingGroup, NgnRovingItem } from './roving-focus';

// Nested (tabindex / descendant) topology — item resolves group via injected token.
@Component({
  imports: [NgnRovingGroup, NgnRovingItem],
  template: `
    <div ngnRovingGroup>
      <span ngnRovingItem id="a">A</span>
      <span ngnRovingItem id="b">B</span>
      <span ngnRovingItem id="c">C</span>
    </div>
  `,
})
class NestedHost {
  group = viewChild.required(NgnRovingGroup);
}

// Sibling (activedescendant) topology — group host is a leaf <input>, items are
// SIBLINGS and must receive the group via the [ngnRovingItem] reference. This is
// the topology the mask actually uses; it proves the DI fallback works.
@Component({
  imports: [NgnRovingGroup, NgnRovingItem],
  template: `
    <div>
      <input #g="ngnRovingGroup" ngnRovingGroup rovingMode="activedescendant" />
      <span [ngnRovingItem]="g" id="a">A</span>
      <span [ngnRovingItem]="g" id="b">B</span>
      <span [ngnRovingItem]="g" id="c">C</span>
    </div>
  `,
})
class SiblingHost {
  group = viewChild.required(NgnRovingGroup);
}

describe('roving-focus registration', () => {
  it('orders items by DOM position (nested)', () => {
    const fixture = TestBed.createComponent(NestedHost);
    fixture.detectChanges();
    const ids = fixture.componentInstance
      .group()
      .items()
      .map(i => i.element.id);
    expect(ids).toEqual(['a', 'b', 'c']);
  });

  it('resolves the group via reference when items are siblings (activedescendant)', () => {
    const fixture = TestBed.createComponent(SiblingHost);
    fixture.detectChanges();
    const ids = fixture.componentInstance
      .group()
      .items()
      .map(i => i.element.id);
    expect(ids).toEqual(['a', 'b', 'c']); // would throw NullInjectorError if DI fallback were missing
  });

  it('defaults the first item active', () => {
    const fixture = TestBed.createComponent(NestedHost);
    fixture.detectChanges();
    expect(fixture.componentInstance.group().activeIndex()).toBe(0);
  });
});

@Component({
  imports: [NgnRovingGroup, NgnRovingItem],
  template: `
    <div ngnRovingGroup [rovingWrap]="true">
      <span ngnRovingItem id="a">A</span>
      <span ngnRovingItem id="b">B</span>
      <span ngnRovingItem id="c">C</span>
    </div>
  `,
})
class WrapHost {
  group = viewChild.required(NgnRovingGroup);
}

describe('roving-focus navigation methods', () => {
  describe('next()', () => {
    it('increments activeIndex from 0 to 1', () => {
      const fixture = TestBed.createComponent(NestedHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      group.next();
      expect(group.activeIndex()).toBe(1);
    });

    it('emits activeItemChange with the new index on next()', () => {
      const fixture = TestBed.createComponent(NestedHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const emitted: number[] = [];
      group.activeItemChange.subscribe(i => emitted.push(i));
      group.next();
      expect(emitted).toEqual([1]);
    });

    it('next() at last index with rovingWrap=false stays at last', () => {
      const fixture = TestBed.createComponent(NestedHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      group.last();
      const emitted: number[] = [];
      group.activeItemChange.subscribe(i => emitted.push(i));
      group.next();
      expect(group.activeIndex()).toBe(2);
      expect(emitted).toEqual([2]);
    });

    it('next() at last index with rovingWrap=true wraps to 0', () => {
      const fixture = TestBed.createComponent(WrapHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      group.last();
      const emitted: number[] = [];
      group.activeItemChange.subscribe(i => emitted.push(i));
      group.next();
      expect(group.activeIndex()).toBe(0);
      expect(emitted).toEqual([0]);
    });
  });

  describe('prev()', () => {
    it('decrements activeIndex from 1 to 0', () => {
      const fixture = TestBed.createComponent(NestedHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      group.next();
      group.prev();
      expect(group.activeIndex()).toBe(0);
    });

    it('prev() at index 0 with rovingWrap=false stays at 0 (clamped)', () => {
      const fixture = TestBed.createComponent(NestedHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const emitted: number[] = [];
      group.activeItemChange.subscribe(i => emitted.push(i));
      group.prev();
      expect(group.activeIndex()).toBe(0);
      expect(emitted).toEqual([0]);
    });

    it('prev() at index 0 with rovingWrap=true wraps to last index (2)', () => {
      const fixture = TestBed.createComponent(WrapHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const emitted: number[] = [];
      group.activeItemChange.subscribe(i => emitted.push(i));
      group.prev();
      expect(group.activeIndex()).toBe(2);
      expect(emitted).toEqual([2]);
    });

    it('emits activeItemChange on prev()', () => {
      const fixture = TestBed.createComponent(NestedHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      group.next(); // move to 1
      const emitted: number[] = [];
      group.activeItemChange.subscribe(i => emitted.push(i));
      group.prev();
      expect(emitted).toEqual([0]);
    });
  });

  describe('first() and last()', () => {
    it('first() sets activeIndex to 0', () => {
      const fixture = TestBed.createComponent(NestedHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      group.next();
      group.next();
      expect(group.activeIndex()).toBe(2);
      const emitted: number[] = [];
      group.activeItemChange.subscribe(i => emitted.push(i));
      group.first();
      expect(group.activeIndex()).toBe(0);
      expect(emitted).toEqual([0]);
    });

    it('last() sets activeIndex to items.length - 1', () => {
      const fixture = TestBed.createComponent(NestedHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const emitted: number[] = [];
      group.activeItemChange.subscribe(i => emitted.push(i));
      group.last();
      expect(group.activeIndex()).toBe(2);
      expect(emitted).toEqual([2]);
    });

    it('first() is a no-op when items list is empty', () => {
      // Empty host — verify no throw
      @Component({
        imports: [NgnRovingGroup],
        template: `<div ngnRovingGroup></div>`,
      })
      class EmptyHost {
        group = viewChild.required(NgnRovingGroup);
      }
      const fixture = TestBed.createComponent(EmptyHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      expect(() => group.first()).not.toThrow();
    });

    it('last() is a no-op when items list is empty', () => {
      @Component({
        imports: [NgnRovingGroup],
        template: `<div ngnRovingGroup></div>`,
      })
      class EmptyHost2 {
        group = viewChild.required(NgnRovingGroup);
      }
      const fixture = TestBed.createComponent(EmptyHost2);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      expect(() => group.last()).not.toThrow();
    });
  });

  describe('activate(item)', () => {
    it("sets activeIndex to that item's DOM-order position", () => {
      const fixture = TestBed.createComponent(NestedHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const target = group.items()[1]; // second item (id="b")
      const emitted: number[] = [];
      group.activeItemChange.subscribe(i => emitted.push(i));
      group.activate(target);
      expect(group.activeIndex()).toBe(1);
      expect(emitted).toEqual([1]);
    });

    it('activate() with an unregistered item does not change activeIndex', () => {
      const fixture = TestBed.createComponent(NestedHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      group.next(); // move to 1
      const fakeItem = { id: 'fake', element: document.createElement('span') };
      group.activate(fakeItem);
      expect(group.activeIndex()).toBe(1); // unchanged
    });
  });
});

// ── Keyboard navigation tests ────────────────────────────────────────────────

@Component({
  selector: 'test-keyboard-horizontal-host',
  imports: [NgnRovingGroup, NgnRovingItem],
  template: `
    <div ngnRovingGroup>
      <span ngnRovingItem id="a">A</span>
      <span ngnRovingItem id="b">B</span>
      <span ngnRovingItem id="c">C</span>
    </div>
  `,
})
class KeyboardHorizontalHost {
  group = viewChild.required(NgnRovingGroup);
}

@Component({
  selector: 'test-keyboard-vertical-host',
  imports: [NgnRovingGroup, NgnRovingItem],
  template: `
    <div ngnRovingGroup orientation="vertical">
      <span ngnRovingItem id="a">A</span>
      <span ngnRovingItem id="b">B</span>
      <span ngnRovingItem id="c">C</span>
    </div>
  `,
})
class KeyboardVerticalHost {
  group = viewChild.required(NgnRovingGroup);
}

function press(host: HTMLElement, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
  const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
  host.dispatchEvent(ev);
  return ev;
}

describe('roving-focus keyboard', () => {
  describe('horizontal orientation (default)', () => {
    it('ArrowRight moves to next and calls preventDefault', () => {
      const fixture = TestBed.createComponent(KeyboardHorizontalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      const ev = press(host, 'ArrowRight');
      expect(group.activeIndex()).toBe(1);
      expect(ev.defaultPrevented).toBe(true);
    });

    it('ArrowLeft moves to prev and calls preventDefault', () => {
      const fixture = TestBed.createComponent(KeyboardHorizontalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      press(host, 'ArrowRight'); // go to 1
      const ev = press(host, 'ArrowLeft');
      expect(group.activeIndex()).toBe(0);
      expect(ev.defaultPrevented).toBe(true);
    });

    it('ArrowUp does NOT change index and does NOT prevent default', () => {
      const fixture = TestBed.createComponent(KeyboardHorizontalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      const ev = press(host, 'ArrowUp');
      expect(group.activeIndex()).toBe(0);
      expect(ev.defaultPrevented).toBe(false);
    });

    it('ArrowDown does NOT change index and does NOT prevent default', () => {
      const fixture = TestBed.createComponent(KeyboardHorizontalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      const ev = press(host, 'ArrowDown');
      expect(group.activeIndex()).toBe(0);
      expect(ev.defaultPrevented).toBe(false);
    });

    it('Home moves to first and calls preventDefault', () => {
      const fixture = TestBed.createComponent(KeyboardHorizontalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      press(host, 'ArrowRight');
      press(host, 'ArrowRight'); // go to 2
      const ev = press(host, 'Home');
      expect(group.activeIndex()).toBe(0);
      expect(ev.defaultPrevented).toBe(true);
    });

    it('End moves to last and calls preventDefault', () => {
      const fixture = TestBed.createComponent(KeyboardHorizontalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      const ev = press(host, 'End');
      expect(group.activeIndex()).toBe(2);
      expect(ev.defaultPrevented).toBe(true);
    });

    it('modifier key held (ctrlKey) does not move and does not prevent default', () => {
      const fixture = TestBed.createComponent(KeyboardHorizontalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      const ev = press(host, 'ArrowRight', { ctrlKey: true });
      expect(group.activeIndex()).toBe(0);
      expect(ev.defaultPrevented).toBe(false);
    });

    it('modifier key held (metaKey) does not move and does not prevent default', () => {
      const fixture = TestBed.createComponent(KeyboardHorizontalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      const ev = press(host, 'ArrowRight', { metaKey: true });
      expect(group.activeIndex()).toBe(0);
      expect(ev.defaultPrevented).toBe(false);
    });

    it('modifier key held (altKey) does not move and does not prevent default', () => {
      const fixture = TestBed.createComponent(KeyboardHorizontalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      const ev = press(host, 'ArrowRight', { altKey: true });
      expect(group.activeIndex()).toBe(0);
      expect(ev.defaultPrevented).toBe(false);
    });
  });

  describe('vertical orientation', () => {
    it('ArrowDown moves to next and calls preventDefault', () => {
      const fixture = TestBed.createComponent(KeyboardVerticalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      const ev = press(host, 'ArrowDown');
      expect(group.activeIndex()).toBe(1);
      expect(ev.defaultPrevented).toBe(true);
    });

    it('ArrowUp moves to prev and calls preventDefault', () => {
      const fixture = TestBed.createComponent(KeyboardVerticalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      press(host, 'ArrowDown'); // go to 1
      const ev = press(host, 'ArrowUp');
      expect(group.activeIndex()).toBe(0);
      expect(ev.defaultPrevented).toBe(true);
    });

    it('ArrowLeft does NOT change index and does NOT prevent default', () => {
      const fixture = TestBed.createComponent(KeyboardVerticalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      const ev = press(host, 'ArrowLeft');
      expect(group.activeIndex()).toBe(0);
      expect(ev.defaultPrevented).toBe(false);
    });

    it('ArrowRight does NOT change index and does NOT prevent default', () => {
      const fixture = TestBed.createComponent(KeyboardVerticalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      const ev = press(host, 'ArrowRight');
      expect(group.activeIndex()).toBe(0);
      expect(ev.defaultPrevented).toBe(false);
    });

    it('Home moves to first and calls preventDefault', () => {
      const fixture = TestBed.createComponent(KeyboardVerticalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      press(host, 'ArrowDown');
      press(host, 'ArrowDown'); // go to 2
      const ev = press(host, 'Home');
      expect(group.activeIndex()).toBe(0);
      expect(ev.defaultPrevented).toBe(true);
    });

    it('End moves to last and calls preventDefault', () => {
      const fixture = TestBed.createComponent(KeyboardVerticalHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      const ev = press(host, 'End');
      expect(group.activeIndex()).toBe(2);
      expect(ev.defaultPrevented).toBe(true);
    });
  });
});

// ── Focus mode side-effect tests ─────────────────────────────────────────────

@Component({
  selector: 'test-tabindex-mode-host',
  imports: [NgnRovingGroup, NgnRovingItem],
  template: `
    <div ngnRovingGroup>
      <span ngnRovingItem id="a">A</span>
      <span ngnRovingItem id="b">B</span>
      <span ngnRovingItem id="c">C</span>
    </div>
  `,
})
class TabindexModeHost {
  group = viewChild.required(NgnRovingGroup);
}

@Component({
  selector: 'test-activedescendant-mode-host',
  imports: [NgnRovingGroup, NgnRovingItem],
  template: `
    <div>
      <input #g="ngnRovingGroup" ngnRovingGroup rovingMode="activedescendant" />
      <span [ngnRovingItem]="g" id="a">A</span>
      <span [ngnRovingItem]="g" id="b">B</span>
      <span [ngnRovingItem]="g" id="c">C</span>
    </div>
  `,
})
class ActiveDescendantModeHost {
  group = viewChild.required(NgnRovingGroup);
}

@Component({
  selector: 'test-empty-activedescendant-host',
  imports: [NgnRovingGroup],
  template: `<input ngnRovingGroup rovingMode="activedescendant" />`,
})
class EmptyActivedescendantHost {
  group = viewChild.required(NgnRovingGroup);
}

// Host with a writable rovingMode — used to verify reverse-direction cleanup
// when the mode switches at runtime.
@Component({
  selector: 'test-dynamic-mode-host',
  imports: [NgnRovingGroup, NgnRovingItem],
  template: `
    <div #g="ngnRovingGroup" ngnRovingGroup [rovingMode]="mode()">
      <span [ngnRovingItem]="g" id="a">A</span>
      <span [ngnRovingItem]="g" id="b">B</span>
      <span [ngnRovingItem]="g" id="c">C</span>
    </div>
  `,
})
class DynamicModeHost {
  mode = signal<'tabindex' | 'activedescendant'>('activedescendant');
  group = viewChild.required(NgnRovingGroup);
}

// Host whose item count can shrink — used to verify the local active-index
// clamp keeps attributes/focus pointing at a valid item. Items use STATIC id
// attributes (resolved at construction time) and are conditionally rendered so
// the remaining item keeps a stable, valid id.
@Component({
  selector: 'test-shrinking-items-host',
  imports: [NgnRovingGroup, NgnRovingItem],
  template: `
    <div #g="ngnRovingGroup" ngnRovingGroup rovingMode="activedescendant">
      <span [ngnRovingItem]="g" id="a">A</span>
      @if (showRest()) {
        <span [ngnRovingItem]="g" id="b">B</span>
        <span [ngnRovingItem]="g" id="c">C</span>
      }
    </div>
  `,
})
class ShrinkingItemsHost {
  showRest = signal(true);
  group = viewChild.required(NgnRovingGroup);
}

// ── Disabled-skip navigation tests ───────────────────────────────────────────

@Component({
  selector: 'test-disabled-skip-host',
  imports: [NgnRovingGroup, NgnRovingItem],
  template: `
    <div ngnRovingGroup [rovingWrap]="wrap()">
      <span ngnRovingItem id="a">A</span>
      <span ngnRovingItem id="b">B</span>
      <span ngnRovingItem id="c">C</span>
      <span ngnRovingItem id="d">D</span>
    </div>
  `,
})
class DisabledSkipHost {
  wrap = signal(false);
  group = viewChild.required(NgnRovingGroup);
}

describe('roving-focus disabled skipping', () => {
  function setup(wrap = false) {
    const fixture = TestBed.createComponent(DisabledSkipHost);
    fixture.componentInstance.wrap.set(wrap);
    fixture.detectChanges();
    const group = fixture.componentInstance.group();
    const items = fixture.debugElement
      .queryAll(By.directive(NgnRovingItem))
      .map(d => d.injector.get(NgnRovingItem));
    return { fixture, group, items };
  }

  it('next() skips a disabled item (b disabled → 0 jumps to 2)', () => {
    const { group, items } = setup();
    items[1]!.disabled.set(true);
    group.next();
    expect(group.activeIndex()).toBe(2);
  });

  it('prev() skips a disabled item (c disabled → 3 jumps to 1)', () => {
    const { group, items } = setup();
    items[2]!.disabled.set(true);
    group.last(); // index 3
    group.prev();
    expect(group.activeIndex()).toBe(1);
  });

  it('next() at edge with all following disabled stays put (no wrap)', () => {
    const { group, items } = setup(false);
    items[2]!.disabled.set(true);
    items[3]!.disabled.set(true);
    group.next(); // 0 -> 1
    const emitted: number[] = [];
    group.activeItemChange.subscribe(i => emitted.push(i));
    group.next(); // 1 -> would need 2/3 but both disabled -> clamps to 1
    expect(group.activeIndex()).toBe(1);
    expect(emitted).toEqual([1]); // clamp-and-emit contract: re-emits current
  });

  it('next() with wrap skips disabled and wraps to first enabled', () => {
    const { group, items } = setup(true);
    items[3]!.disabled.set(true);
    group.last(); // lands on 2 (3 is disabled)
    expect(group.activeIndex()).toBe(2);
    group.next(); // 3 disabled -> wrap -> 0
    expect(group.activeIndex()).toBe(0);
  });

  it('first() lands on the first enabled item', () => {
    const { group, items } = setup();
    items[0]!.disabled.set(true);
    group.first();
    expect(group.activeIndex()).toBe(1);
  });

  it('last() lands on the last enabled item', () => {
    const { group, items } = setup();
    items[3]!.disabled.set(true);
    group.last();
    expect(group.activeIndex()).toBe(2);
  });

  it('activate() on a disabled item is a no-op', () => {
    const { group, items } = setup();
    items[1]!.disabled.set(true);
    const emitted: number[] = [];
    group.activeItemChange.subscribe(i => emitted.push(i));
    group.activate(group.items()[1]!);
    expect(group.activeIndex()).toBe(0);
    expect(emitted).toEqual([]);
  });
});

describe('roving-focus focus modes', () => {
  describe('tabindex mode', () => {
    it('active item (index 0) gets tabindex="0", others get tabindex="-1" after detectChanges', () => {
      const fixture = TestBed.createComponent(TabindexModeHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const items = group.items();
      expect(items[0]!.element.getAttribute('tabindex')).toBe('0');
      expect(items[1]!.element.getAttribute('tabindex')).toBe('-1');
      expect(items[2]!.element.getAttribute('tabindex')).toBe('-1');
    });

    it('after next() + detectChanges, index 1 host has tabindex="0" and index 0 has "-1"', () => {
      const fixture = TestBed.createComponent(TabindexModeHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      group.next();
      fixture.detectChanges();
      const items = group.items();
      expect(items[0]!.element.getAttribute('tabindex')).toBe('-1');
      expect(items[1]!.element.getAttribute('tabindex')).toBe('0');
      expect(items[2]!.element.getAttribute('tabindex')).toBe('-1');
    });

    it('after next() + detectChanges, document.activeElement is the index-1 host', () => {
      const fixture = TestBed.createComponent(TabindexModeHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      group.next();
      fixture.detectChanges();
      const items = group.items();
      expect(document.activeElement).toBe(items[1]!.element);
    });

    it('initial detectChanges does NOT steal focus (document.activeElement is not index-0 host)', () => {
      const fixture = TestBed.createComponent(TabindexModeHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const items = group.items();
      // After initial render only, the active item should not have received .focus()
      expect(document.activeElement).not.toBe(items[0]!.element);
    });

    it('group host does NOT have aria-activedescendant or aria-owns in tabindex mode', () => {
      const fixture = TestBed.createComponent(TabindexModeHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      expect(host.getAttribute('aria-activedescendant')).toBeNull();
      expect(host.getAttribute('aria-owns')).toBeNull();
    });
  });

  describe('activedescendant mode', () => {
    it('group host has aria-activedescendant = active item id after detectChanges', () => {
      const fixture = TestBed.createComponent(ActiveDescendantModeHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const input = fixture.nativeElement.querySelector('input') as HTMLElement;
      const activeId = group.items()[0]!.id;
      expect(input.getAttribute('aria-activedescendant')).toBe(activeId);
    });

    it('group host has aria-owns containing all three item ids after detectChanges', () => {
      const fixture = TestBed.createComponent(ActiveDescendantModeHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const input = fixture.nativeElement.querySelector('input') as HTMLElement;
      const allIds = group
        .items()
        .map(i => i.id)
        .join(' ');
      expect(input.getAttribute('aria-owns')).toBe(allIds);
    });

    it('item spans do NOT have tabindex attribute in activedescendant mode', () => {
      const fixture = TestBed.createComponent(ActiveDescendantModeHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      for (const item of group.items()) {
        expect(item.element.getAttribute('tabindex')).toBeNull();
      }
    });

    it('after next() + detectChanges, aria-activedescendant updates to index-1 item id', () => {
      const fixture = TestBed.createComponent(ActiveDescendantModeHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      group.next();
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input') as HTMLElement;
      const activeId = group.items()[1]!.id;
      expect(input.getAttribute('aria-activedescendant')).toBe(activeId);
    });
  });

  describe('empty-items guard (activedescendant)', () => {
    it('group with no items does NOT have aria-activedescendant attribute', () => {
      const fixture = TestBed.createComponent(EmptyActivedescendantHost);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input') as HTMLElement;
      expect(input.getAttribute('aria-activedescendant')).toBeNull();
    });

    it('group with no items does NOT have aria-owns attribute', () => {
      const fixture = TestBed.createComponent(EmptyActivedescendantHost);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input') as HTMLElement;
      expect(input.getAttribute('aria-owns')).toBeNull();
    });
  });

  describe('isActive computed on NgnRovingItem', () => {
    it('only the active item (index 0) has isActive() === true initially', () => {
      const fixture = TestBed.createComponent(TabindexModeHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const rovingItems = fixture.debugElement
        .queryAll(By.directive(NgnRovingItem))
        .map(d => d.injector.get(NgnRovingItem));
      expect(rovingItems[0]!.isActive()).toBe(true);
      expect(rovingItems[1]!.isActive()).toBe(false);
      expect(rovingItems[2]!.isActive()).toBe(false);
    });

    it('after next(), the second item becomes isActive() === true', () => {
      const fixture = TestBed.createComponent(TabindexModeHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      group.next();
      fixture.detectChanges();
      const rovingItems = fixture.debugElement
        .queryAll(By.directive(NgnRovingItem))
        .map(d => d.injector.get(NgnRovingItem));
      expect(rovingItems[0]!.isActive()).toBe(false);
      expect(rovingItems[1]!.isActive()).toBe(true);
      expect(rovingItems[2]!.isActive()).toBe(false);
    });
  });

  describe('pointerdown activates item', () => {
    it('dispatching pointerdown on index-1 item activates it', () => {
      const fixture = TestBed.createComponent(TabindexModeHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const items = group.items();
      items[1]!.element.dispatchEvent(new Event('pointerdown', { bubbles: true }));
      expect(group.activeIndex()).toBe(1);
    });

    it('after pointerdown on index-2 item, document.activeElement is that item after detectChanges', () => {
      const fixture = TestBed.createComponent(TabindexModeHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const items = group.items();
      items[2]!.element.dispatchEvent(new Event('pointerdown', { bubbles: true }));
      fixture.detectChanges();
      expect(document.activeElement).toBe(items[2]!.element);
    });
  });

  describe('dynamic mode switch (reverse-direction cleanup)', () => {
    it('switching activedescendant -> tabindex removes group aria and sets item tabindexes', () => {
      const fixture = TestBed.createComponent(DynamicModeHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;
      const group = fixture.componentInstance.group();

      // Sanity: activedescendant attributes are present initially.
      expect(host.getAttribute('aria-activedescendant')).not.toBeNull();
      expect(host.getAttribute('aria-owns')).not.toBeNull();

      // Switch to tabindex mode.
      fixture.componentInstance.mode.set('tabindex');
      fixture.detectChanges();

      // Group aria attributes must be cleaned up.
      expect(host.getAttribute('aria-activedescendant')).toBeNull();
      expect(host.getAttribute('aria-owns')).toBeNull();

      // Item tabindexes must be applied (0 active / -1 others).
      const items = group.items();
      expect(items[0]!.element.getAttribute('tabindex')).toBe('0');
      expect(items[1]!.element.getAttribute('tabindex')).toBe('-1');
      expect(items[2]!.element.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('active index clamp when items shrink (activedescendant)', () => {
    it('aria-activedescendant references a valid item after the active item is removed', () => {
      const fixture = TestBed.createComponent(ShrinkingItemsHost);
      fixture.detectChanges();
      const group = fixture.componentInstance.group();
      const host = fixture.nativeElement.querySelector('[ngnRovingGroup]') as HTMLElement;

      // Move active to the last item (index 2 -> id "c").
      group.last();
      fixture.detectChanges();
      expect(host.getAttribute('aria-activedescendant')).toBe('c');

      // Remove the last two items so the stale activeIndex (2) is out of range.
      fixture.componentInstance.showRest.set(false);
      fixture.detectChanges();

      // The clamped active index must reference the only remaining valid item.
      const remainingIds = group.items().map(i => i.id);
      expect(remainingIds).toEqual(['a']);
      expect(host.getAttribute('aria-activedescendant')).toBe('a');
      expect(host.getAttribute('aria-owns')).toBe('a');

      // The stored activeIndex must also be normalized so isActive() stays true
      // for the remaining item (not just the local display clamp).
      expect(group.activeIndex()).toBe(0);
      const remainingItem = fixture.debugElement
        .queryAll(By.directive(NgnRovingItem))
        .map(d => d.injector.get(NgnRovingItem))[0]!;
      expect(remainingItem.isActive()).toBe(true);
    });
  });
});
