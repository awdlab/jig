import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  InjectionToken,
  input,
  output,
  signal,
  type Signal,
} from '@angular/core';
import { domEventHandler, inlineArrowStep } from '@awdlab/jig/api/ng';
import { generateElementId } from '@awdlab/jig/utils-ng';

export type RovingOrientation = 'horizontal' | 'vertical';
export type RovingMode = 'tabindex' | 'activedescendant';

export interface RovingItemRef {
  readonly id: string;
  readonly element: HTMLElement;
  /**
   * Optional reactive disabled flag. When it reads `true`, the item is skipped
   * by keyboard navigation (`next`/`prev`/`first`/`last`) and pointer
   * `activate()`. Absent (undefined) is treated as enabled.
   */
  readonly disabled?: Signal<boolean>;
}

export const ROVING_GROUP = new InjectionToken<JigRovingGroup>('ROVING_GROUP');

/**
 * Turns a set of {@link JigRovingItem}s into a single tab stop with arrow-key
 * navigation — the roving tabindex pattern that tabs, radio groups, menus and
 * toolbars are built on.
 *
 * Arrow keys move along {@link JigRovingGroup.orientation}, Home/End jump to
 * the ends, and disabled items are skipped. Items register themselves through
 * DI and are ordered by DOM position, so the group never needs a static list.
 *
 * @category directive
 */
@Directive({
  selector: '[jigRovingGroup]',
  providers: [{ provide: ROVING_GROUP, useExisting: JigRovingGroup }],
  exportAs: 'jigRovingGroup',
})
export class JigRovingGroup {
  /**
   * Which arrow keys move the active item: `'horizontal'` uses Left/Right,
   * `'vertical'` uses Up/Down. Home/End always jump to first/last.
   * @default 'horizontal'
   */
  public readonly orientation = input<RovingOrientation>('horizontal');
  /**
   * How the active item is exposed. `'tabindex'` moves the tab stop (and DOM
   * focus) between items; `'activedescendant'` keeps focus on the group and
   * points `aria-activedescendant` at the active item.
   * @default 'tabindex'
   */
  public readonly rovingMode = input<RovingMode>('tabindex');
  /**
   * Whether keyboard navigation wraps around the ends of the list instead of
   * stopping at the first/last item.
   * @default false
   */
  public readonly rovingWrap = input(false, { transform: booleanAttribute });
  /**
   * Suspends the group: arrow/Home/End navigation, pointer activation and
   * {@link setActive} become no-ops, and no active item is exposed. The host
   * stays a single tab stop, so a suspended group reads as one plain element
   * (e.g. a readonly mask input, whose sections must not be selectable).
   * @default false
   */
  public readonly rovingDisabled = input(false, { transform: booleanAttribute });

  /**
   * Emits the index of the newly active item whenever it changes via keyboard,
   * pointer, or {@link setActive}. Not emitted by {@link syncActiveIndex}.
   */
  public readonly activeItemChange = output<number>();

  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly _items = signal<RovingItemRef[]>([]);
  /** Items in DOM order. */
  public readonly items = computed(() =>
    [...this._items()].sort((a, b) => {
      if (a.element === b.element) return 0;
      return a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1;
    })
  );

  public readonly activeIndex = signal(0);

  /**
   * Tracks the previously active item's id so we can decide whether to call
   * `.focus()`. Initialized to `null` — the first effect pass sets it without
   * focusing; subsequent passes focus when the id actually changes.
   */
  private _prevActiveId: string | null = null;

  /**
   * When set, the next focus-mode effect pass updates the tab stop / attributes
   * but does NOT move DOM focus. Consumed (reset) by that pass. Lets consumers
   * sync the active item to a programmatic selection (e.g. a radio group's
   * `value` change) without stealing focus into the group.
   */
  private _suppressFocus = false;

  constructor() {
    domEventHandler(this._host, 'keydown', e => this._onKeydown(e));

    // Apply focus-mode side effects reactively.
    effect(() => {
      const items = this.items();
      const mode = this.rovingMode();

      // Clamp the active index LOCALLY (do not mutate the activeIndex signal)
      // so that attributes/focus always reference a valid item even if
      // activeIndex is stale after the items list shrinks.
      const active = items.length
        ? Math.max(0, Math.min(this.activeIndex(), items.length - 1))
        : this.activeIndex();

      if (mode === 'tabindex') {
        // Clean up activedescendant mode attributes.
        this._host.removeAttribute('aria-activedescendant');
        this._host.removeAttribute('aria-owns');

        // Apply tabindex to all items.
        items.forEach((it, i) => {
          it.element.setAttribute('tabindex', i === active ? '0' : '-1');
        });

        // Move focus when the active item changes — but NOT on the first pass
        // (where _prevActiveId is null) to avoid stealing focus on mount.
        const activeEl = items[active]?.element;
        const activeId = activeEl?.id ?? null;
        if (
          activeEl &&
          this._prevActiveId !== null &&
          this._prevActiveId !== activeId &&
          !this._suppressFocus
        ) {
          activeEl.focus();
        }
        this._prevActiveId = activeId;
        this._suppressFocus = false;
      } else {
        // activedescendant mode: remove tabindex from all items.
        items.forEach(it => it.element.removeAttribute('tabindex'));

        // Guard the empty-items window (items register during effects, so the
        // first effect pass may see an empty list).
        if (!items.length || this.rovingDisabled()) {
          this._host.removeAttribute('aria-activedescendant');
          this._host.removeAttribute('aria-owns');
          return;
        }

        this._host.setAttribute('aria-owns', items.map(i => i.id).join(' '));
        const activeId = items[active]?.id;
        if (activeId) {
          this._host.setAttribute('aria-activedescendant', activeId);
        }

        // Reset the focus guard when in activedescendant mode so that switching
        // back to tabindex mode doesn't immediately call focus.
        this._prevActiveId = null;
      }
    });
  }

  public register(item: RovingItemRef): void {
    this._items.update(list => (list.includes(item) ? list : [...list, item]));
  }

  public unregister(item: RovingItemRef): void {
    this._items.update(list => list.filter(i => i !== item));
    // Normalize the stored active index so it never dangles past the end —
    // otherwise JigRovingItem.isActive() would be false for every item.
    const n = this.items().length;
    if (this.activeIndex() >= n) {
      this.activeIndex.set(Math.max(0, n - 1));
    }
  }

  public activate(target: RovingItemRef): void {
    if (this.rovingDisabled() || target.disabled?.()) return;
    const idx = this.items().indexOf(target);
    if (idx >= 0) this._setActive(idx);
  }

  public next(): void {
    this._move(1);
  }

  public prev(): void {
    this._move(-1);
  }

  public first(): void {
    const items = this.items();
    const idx = items.findIndex(it => !it.disabled?.());
    if (idx >= 0) this._setActive(idx);
  }

  public last(): void {
    const items = this.items();
    for (let i = items.length - 1; i >= 0; i--) {
      if (!items[i]?.disabled?.()) {
        this._setActive(i);
        return;
      }
    }
  }

  /** Set the active item by index (clamped to range); emits activeItemChange. */
  public setActive(index: number): void {
    if (this.rovingDisabled()) return;
    if (index >= 0 && index < this.items().length) this._setActive(index);
  }

  /**
   * Move the tab stop to `index` WITHOUT moving DOM focus or emitting
   * `activeItemChange`. For syncing the roving state to a programmatic
   * selection (e.g. a radio group's `value` changing from code) where stealing
   * focus into the group would be wrong.
   */
  public syncActiveIndex(index: number): void {
    if (index < 0 || index >= this.items().length) return;
    if (index === this.activeIndex()) return;
    this._suppressFocus = true;
    this.activeIndex.set(index);
  }

  private _onKeydown(e: KeyboardEvent): void {
    if (this.rovingDisabled() || e.ctrlKey || e.metaKey || e.altKey) return;
    const horizontal = this.orientation() === 'horizontal';
    let consumed = true;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowLeft':
        // The inline axis follows the writing direction, so in RTL ArrowLeft advances.
        if (!horizontal) {
          consumed = false;
        } else if (inlineArrowStep(this._host, e.key) === 1) {
          this.next();
        } else {
          this.prev();
        }
        break;
      case 'ArrowDown':
        if (!horizontal) this.next();
        else consumed = false;
        break;
      case 'ArrowUp':
        if (!horizontal) this.prev();
        else consumed = false;
        break;
      case 'Home':
        this.first();
        break;
      case 'End':
        this.last();
        break;
      default:
        consumed = false;
    }
    if (consumed) e.preventDefault();
  }

  private _move(delta: number): void {
    const items = this.items();
    const n = items.length;
    if (!n) return;
    const start = this.activeIndex();
    let i = start;
    // Step in `delta` direction until we land on an enabled item, skipping
    // disabled ones. When no enabled target exists in that direction we clamp
    // to the current index and still emit — preserving the pre-existing
    // clamp-and-emit contract. Bounded by `n` iterations so it terminates.
    for (let step = 0; step < n; step++) {
      i += delta;
      if (this.rovingWrap()) {
        i = ((i % n) + n) % n;
        if (i === start) break; // looped back — no other enabled item
      } else if (i < 0 || i >= n) {
        break; // reached an edge without finding an enabled item
      }
      if (!items[i]?.disabled?.()) {
        this._setActive(i);
        return;
      }
    }
    this._setActive(start);
  }

  private _setActive(i: number): void {
    this.activeIndex.set(i);
    this.activeItemChange.emit(i);
  }
}

/**
 * One navigable item inside a {@link JigRovingGroup}. It registers with the
 * nearest group (or the one passed to {@link JigRovingItem.jigRovingItem}),
 * gets an `id` if the element has none, and activates itself on pointerdown.
 *
 * @category directive
 */
@Directive({ selector: '[jigRovingItem]', exportAs: 'jigRovingItem' })
export class JigRovingItem implements RovingItemRef {
  private readonly _injectedGroup = inject(ROVING_GROUP, { optional: true });
  /**
   * The {@link JigRovingGroup} this item belongs to. Pass a group reference when
   * the item is not a DOM descendant of its group; leave empty/undefined to use
   * the nearest ancestor group via dependency injection.
   */
  public readonly jigRovingItem = input<JigRovingGroup | '' | undefined>(undefined);

  public readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  public readonly id: string;

  /**
   * Reactive disabled flag for this item. Consumers (e.g. `jig-radio`) set it
   * so the group's keyboard navigation and pointer `activate()` skip the item.
   */
  public readonly disabled = signal(false);

  private readonly _group = computed<JigRovingGroup>(() => {
    const explicit = this.jigRovingItem();
    const group = explicit instanceof JigRovingGroup ? explicit : this._injectedGroup;
    if (!group) {
      throw new Error(
        'jigRovingItem: no JigRovingGroup found. Provide via [jigRovingItem]="group" or nest inside one.'
      );
    }
    return group;
  });

  /** Whether this item is currently the active item in its group. */
  public readonly isActive = computed(() => {
    const g = this._group();
    return g.items()[g.activeIndex()] === this;
  });

  constructor() {
    // generateElementId() must be called in injection context (constructor is fine).
    this.id = this.element.id || generateElementId();
    if (!this.element.id) this.element.id = this.id;

    // Use effect() rather than afterNextRender() so that registration is
    // guaranteed to run synchronously during detectChanges() in Vitest/TestBed.
    // effect() reads this._group() reactively and (re)registers whenever the
    // resolved group changes; the onCleanup callback unregisters from the
    // previous group before re-running, and on destroy. Equivalent to
    // afterNextRender() in a browser environment.
    effect(onCleanup => {
      const group = this._group();
      group.register(this);
      onCleanup(() => group.unregister(this));
    });

    // Activate self in the group on pointerdown.
    domEventHandler(this.element, 'pointerdown', () => this._group().activate(this));
  }
}
