import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  isDevMode,
  runInInjectionContext,
  signal,
  viewChild,
  type Signal,
} from '@angular/core';
import {
  elementSizeSignal,
  elementsSizesSignal,
  JigTemplate,
  Platform,
  type Size,
} from '@awdlab/jig/api/ng';
import { JIG_CONTROL, JigPt, provideSelf } from '@awdlab/jig/base';
import { JigIcon } from '@awdlab/jig/icon';
import { I18n } from '@awdlab/jig/i18n';
import { calculateItemViewLayout, type OverflowOrder } from '@awdlab/jig/item-view';
import { JigPopover } from '@awdlab/jig/popover';
import { JigRovingGroup, resolveDisabled, resolveFocusable } from '@awdlab/jig/roving-focus';
import { JigError } from '@awdlab/jig/utils';
import { generateElementId } from '@awdlab/jig/utils-ng';
import { toolbarControlTemplate } from '@awdlab/jig-themes/templates/toolbar';

import { JigToolbarRegion } from './toolbar-region';
import { ToolbarTemplates } from './toolbar-templates';
import {
  TOOLBAR_CONTROL,
  type ToolbarControl,
  type ToolbarOrientation,
  type ToolbarOverflow,
  type ToolbarPlacement,
  type ToolbarRegionRef,
} from './types';

import type { IconType } from '@awdlab/jig-custom-types';

type PlacementItem = {
  region: JigToolbarRegion;
  regionIndex: number;
  itemIndex: number;
};

/**
 * @category control
 */
@Component({
  selector: 'jig-toolbar',
  templateUrl: './toolbar.html',
  imports: [JigPt, NgTemplateOutlet, JigTemplate, JigIcon, JigPopover, JigRovingGroup],
  providers: [
    provideSelf(JigToolbar),
    {
      provide: TOOLBAR_CONTROL,
      deps: [JigToolbar],
      useFactory: (toolbar: JigToolbar) =>
        <ToolbarControl>{
          orientation: toolbar.orientation,
          overflow: toolbar.overflow,
          isItemOverflowed: toolbar.isItemOverflowed.bind(toolbar),
        },
    },
  ],
  host: {
    '[attr.role]': '"toolbar"',
    '[attr.aria-orientation]': 'orientation()',
    '[style.--jig-toolbar-content-width]':
      'orientation() === "horizontal" ? naturalContentSizePx() : null',
    '[style.--jig-toolbar-content-height]':
      'orientation() === "vertical" ? naturalContentSizePx() : null',
  },
})
export class JigToolbar extends ToolbarTemplates {
  protected readonly theme = this.injectThemeTemplate(toolbarControlTemplate, 'root');

  /**
   * The axis the toolbar runs along. Drives the grid direction, the measured
   * axis and `aria-orientation`.
   *
   * Vertical overflow only happens when the toolbar's height is bounded by its
   * surroundings — an unbounded column always fits its own content.
   * @default 'horizontal'
   */
  public readonly orientation = input<ToolbarOrientation>('horizontal');
  /**
   * What happens when the content no longer fits.
   * - `'wrap'` — the toolbar grows along the cross axis. Pure CSS, nothing is measured.
   * - `'popover'` — items collapse into a `…` trigger per placement. Requires
   *   collapsible content to be declared as `<ng-template #item>` inside a
   *   {@link JigToolbarRegion}.
   * @default 'wrap'
   */
  public readonly overflow = input<ToolbarOverflow>('wrap');
  /**
   * Icon for the default `…` trigger. Ignored when {@link templateOverflow} is set.
   */
  public readonly iconOverflow = input<IconType>();

  protected readonly i18n = inject(I18n).translations;

  private readonly _isBrowser = inject(Platform).isBrowser;
  private readonly _injector = inject(Injector);

  protected readonly measuring = computed(() => this.overflow() === 'popover');

  private readonly _regions = contentChildren(JigToolbarRegion, { descendants: true });
  private readonly _directControls = contentChildren(JIG_CONTROL, { descendants: true });

  private readonly _trackStartRef = viewChild.required<ElementRef<HTMLElement>>('trackStart');
  private readonly _trackCenterRef = viewChild.required<ElementRef<HTMLElement>>('trackCenter');
  private readonly _trackEndRef = viewChild.required<ElementRef<HTMLElement>>('trackEnd');
  private readonly _triggerStartRef = viewChild<ElementRef<HTMLElement>>('triggerStart');
  private readonly _triggerCenterRef = viewChild<ElementRef<HTMLElement>>('triggerCenter');
  private readonly _triggerEndRef = viewChild<ElementRef<HTMLElement>>('triggerEnd');

  private readonly _gap = signal(0);
  private readonly _roving = viewChild.required(JigRovingGroup);
  private readonly _hostSize = elementSizeSignal(this.element.nativeElement, this.measuring);

  protected readonly start = this._createPlacement(
    'start',
    this._trackStartRef,
    this._triggerStartRef
  );
  protected readonly center = this._createPlacement(
    'center',
    this._trackCenterRef,
    this._triggerCenterRef
  );
  protected readonly end = this._createPlacement('end', this._trackEndRef, this._triggerEndRef);

  private readonly _placements = [this.start, this.center, this.end];

  private _axisSize(size: Size): number {
    return this.orientation() === 'horizontal' ? size.width : size.height;
  }

  /**
   * Everything the theme puts between the host edge and the tracks: grid padding, border
   * and the gaps between the three tracks. Constant for a given theme, so measuring it
   * against the current host size does not feed back into the size it helps produce.
   */
  private readonly _chromeSize = computed(() => {
    const tracks = this._placements.reduce(
      (sum, placement) => sum + this._axisSize(placement.trackSize()),
      0
    );
    return Math.max(0, this._axisSize(this._hostSize()) - tracks);
  });

  /**
   * Size the toolbar needs with every item at its natural size, collapsed or not — the
   * theme feeds it to the host's main-axis size so a shrink-to-fit parent sizes to the
   * *uncollapsed* toolbar. Without it the parent wraps the collapsed content, which
   * shrinks the toolbar, which collapses more. Collapsed items stay laid out off-screen
   * precisely so this stays measurable. The trigger is excluded on purpose: at this size
   * nothing collapses, so no trigger is shown.
   */
  protected readonly naturalContentSizePx = computed<string | null>(() => {
    if (!this.measuring()) {
      return null;
    }
    const gap = this._gap();
    // Gaps are counted per track — the gaps *between* tracks are part of the chrome.
    const tracks = this._placements.map(placement => {
      const sizes = placement.itemSizes().map(size => this._axisSize(size));
      return sizes.reduce((sum, size) => sum + size, 0) + gap * Math.max(0, sizes.length - 1);
    });
    const total = Math.ceil(tracks.reduce((sum, size) => sum + size, 0) + this._chromeSize());
    return Number.isFinite(total) && total > 0 && total < 100_000 ? `${total}px` : null;
  });

  constructor() {
    super();

    // The gap is a theme value, so it is read from the DOM rather than duplicated
    // in TypeScript. Re-read when the axis flips, since row/column gap differ.
    effect(() => {
      this.orientation();
      this.measuring();
      const track = this._trackStartRef().nativeElement;
      if (!this._isBrowser) {
        return;
      }
      requestAnimationFrame(() => {
        const prop = this.orientation() === 'horizontal' ? 'column-gap' : 'row-gap';
        this._gap.set(parseFloat(getComputedStyle(track).getPropertyValue(prop)) || 0);
      });
    });

    // A popover whose trigger just disappeared would be anchored to nothing.
    effect(() => {
      for (const placement of this._placements) {
        if (placement.overflowCount() === 0 && placement.open()) {
          placement.open.set(false);
        }
      }
    });

    // Single tab stop across the whole toolbar. Offscreen copies of collapsed
    // items are inert, so they must not become navigable.
    // After render: which element owns a control's tab stop is read off the DOM, and a
    // projected control's own bindings — the `tabindex` a `jig-select` puts on its
    // trigger — are not applied yet while the toolbar's own view is being refreshed.
    afterRenderEffect(onCleanup => {
      const group = this._roving();
      const controls = [
        // A region is a JIG_CONTROL but not a focusable one. Registering its host would
        // give it a tabindex, which `resolveFocusable` then matches on every later pass,
        // pinning the tab stop to a wrapper that cannot be focused.
        ...this._directControls().filter(ref => !(ref instanceof JigToolbarRegion)),
        ...this._regions().flatMap(region => region.controls()),
      ];
      // A visible overflow trigger is a toolbar stop too. It is a plain element rather
      // than a JIG_CONTROL, so it is collected separately.
      const triggers = this._placements
        .filter(placement => placement.overflowCount() > 0)
        .map(placement => placement.triggerRef())
        .filter(ref => ref !== undefined);

      const seen = new Set<HTMLElement>();
      const entries = [
        ...controls.map(ref => ({ ref, host: ref.element.nativeElement })),
        ...triggers.map(ref => ({ ref, host: ref.nativeElement })),
      ];
      const items = entries
        // A control with nothing focusable in it — a decorative icon or tag, or the icon
        // inside an icon button — is not a stop. Nesting is not the test: a wrapper like
        // `jig-input-field` and the `jig-select` inside it both resolve to the same
        // focusable element, which the dedup below collapses into one stop.
        .flatMap(({ ref, host }) => {
          const element = resolveFocusable(host);
          return element ? [{ ref, element }] : [];
        })
        // Collapsed copies are inert, and popover copies belong to the popover's own
        // tab order — neither is a stop in the toolbar.
        .filter(({ element }) => !element.closest('[inert]') && !element.closest('jig-popover'))
        // A control can be reported twice: once by the toolbar's descendant query and
        // once by its region. Same element, one tab stop.
        .filter(({ element }) => !seen.has(element) && seen.add(element))
        .map(({ ref, element }) => {
          if (!element.id) {
            element.id = runInInjectionContext(this._injector, () => generateElementId());
          }
          return { id: element.id, element, disabled: resolveDisabled(ref, element) };
        });
      items.forEach(item => group.register(item));
      onCleanup(() => items.forEach(item => group.unregister(item)));
    });

    // Projected content cannot collapse — it would consume track space that the
    // layout never accounts for, so the split would be silently wrong.
    effect(() => {
      if (!isDevMode() || !this.measuring() || !this._isBrowser) {
        return;
      }
      const strays = [
        ...this._trackStartRef().nativeElement.children,
        ...this._trackCenterRef().nativeElement.children,
        ...this._trackEndRef().nativeElement.children,
      ].filter(
        child =>
          !child.matches('jig-toolbar-region') && !child.hasAttribute('data-jig-toolbar-overflow')
      );
      if (strays.length > 0) {
        throw new JigError(
          'JigToolbar',
          `overflow="popover" cannot collapse projected content. Wrap it in a <jig-toolbar-region> and declare each item as <ng-template #item>. Offending elements: ${strays
            .map(x => x.tagName.toLowerCase())
            .join(', ')}`
        );
      }
    });
  }

  public isItemOverflowed(region: ToolbarRegionRef, itemIndex: number): boolean {
    const placement = this._placementFor(region.placement());
    const flatIndex = placement
      .items()
      .findIndex(item => item.region === region && item.itemIndex === itemIndex);
    return flatIndex >= 0 && placement.overflowed().has(flatIndex);
  }

  private _placementFor(placement: ToolbarPlacement) {
    switch (placement) {
      case 'start':
        return this.start;
      case 'center':
        return this.center;
      case 'end':
        return this.end;
    }
  }

  private _createPlacement(
    placement: ToolbarPlacement,
    trackRef: Signal<ElementRef<HTMLElement> | undefined>,
    triggerRef: Signal<ElementRef<HTMLElement> | undefined>
  ) {
    const measuring = computed(() => this.overflow() === 'popover');
    const axisSize = (size: Size) => this._axisSize(size);

    const regions = computed(() => this._regions().filter(r => r.placement() === placement));
    const items = computed<PlacementItem[]>(() =>
      regions().flatMap((region, regionIndex) =>
        region.itemTemplates().map((_, itemIndex) => ({ region, regionIndex, itemIndex }))
      )
    );
    const elements = computed(() => regions().flatMap(region => region.itemElements()));

    const trackSize = elementSizeSignal(trackRef, measuring);
    const triggerSize = elementSizeSignal(triggerRef, measuring);
    const itemSizes = elementsSizesSignal(elements, measuring);

    // Highest priority is kept longest; within one priority the earlier region,
    // then the earlier item, survives.
    const checkOrder = computed<OverflowOrder>(() =>
      items()
        .map((item, index) => ({ item, index }))
        .toSorted(
          (a, b) =>
            b.item.region.priority() - a.item.region.priority() ||
            a.item.regionIndex - b.item.regionIndex ||
            a.item.itemIndex - b.item.itemIndex
        )
        .map(entry => ({ index: entry.index, location: 'end' as const }))
    );

    const overflowed = computed<ReadonlySet<number>>(() => {
      if (!measuring()) {
        return new Set<number>();
      }
      const layout = calculateItemViewLayout({
        count: items().length,
        strategy: 'end',
        freezeCount: 0,
        strategyIndex: 0,
        checkOrder: checkOrder(),
        containerSize: axisSize(trackSize()),
        itemSizes: itemSizes().map(axisSize),
        overflowItemSize: axisSize(triggerSize()),
        gap: this._gap(),
      });
      return new Set(layout.remainingItemOrders.map(entry => entry.index));
    });

    const overflowCount = computed(() => overflowed().size);
    const overflowTemplates = computed(() =>
      items()
        .filter((_, index) => overflowed().has(index))
        .map(item => item.region.itemTemplates()[item.itemIndex])
        .filter(template => template !== undefined)
    );

    const open = signal(false);

    return {
      placement,
      items,
      overflowed,
      overflowCount,
      overflowTemplates,
      itemSizes,
      trackSize,
      triggerRef,
      open,
      toggle: () => open.update(value => !value),
    };
  }
}
