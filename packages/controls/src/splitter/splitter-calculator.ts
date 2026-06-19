import { computed, EmbeddedViewRef, signal, type Signal } from '@angular/core';
import {
  ResizeEngine,
  type ResizableItem,
  type ResizeDistributionMode,
  type ResizeSize,
} from '@ngneers/controls/api/resize';
import { Logger, throwExp } from '@ngneers/controls/utils';

import { NgnSplitterPanel } from './panel/splitter-panel';
import { NgnSplitter } from './splitter';

import type { SplitterLayout } from './types';

/**
 * Type interface for the {@link SplitterCalculator} interface.
 */
export interface SplitterCalculatorType {
  new (splitter: NgnSplitter): SplitterCalculator;
}

/**
 * Represents a calculator for the {@link NgnSplitter} component, handling panel sizes, drag events, and min/max size constraints.
 * This interface defines the methods and properties required for managing the splitter's layout and behavior.
 */
export interface SplitterCalculator {
  /**
   * Signal that provides the ordered list of panels in the splitter.
   */
  orderedPanels: Signal<readonly NgnSplitterPanel[]>;

  /**
   * Signal that provides the grid template sizes for the splitter (to use in `grid-template-rows` or `grid-template-columns` CSS properties).
   */
  gridTemplateSizes: Signal<string>;

  /**
   * Signal that provides the grid template areas for the splitter (to use in `grid-template-areas` CSS property).
   */
  gridTemplateAreas: Signal<string | null>;

  /**
   * Signal that provides the current drag context. Returns `null` if no drag is in progress.
   */
  dragContext: Signal<SplitterDragContext | null>;

  /**
   * Signal that provides the minimum size of the splitter, calculated based on the panels' min sizes and dividers.
   */
  minSize: Signal<string>;

  /**
   * Signal that provides the maximum size of the splitter, calculated based on the panels' max sizes and dividers.
   */
  maxSize: Signal<string>;

  /**
   * Starts a drag operation for the specified divider index.
   * @param index The index of the divider to start dragging.
   * @param event The pointer event that initiated the drag.
   */
  startDrag(index: number, event: PointerEvent): void;

  /**
   * Handles the drag operation for the specified divider index.
   * @param index The index of the divider being dragged.
   * @param event The pointer event that is being processed during the drag.
   */
  drag(index: number, event: PointerEvent): void;

  /**
   * Ends the drag operation for the specified divider index.
   * @param index The index of the divider being dragged.
   * @param event The pointer event that ended the drag.
   * @param isCancel Whether the drag operation was cancelled. If true, the panel sizes will be reset to their original values.
   */
  endDrag(index: number, event: PointerEvent, isCancel: boolean): void;

  /**
   * Moves the divider at the specified index by the given pixel delta.
   * @param index The index of the divider to move.
   * @param pxDelta The pixel delta to move the divider by. Positive values move the divider to the right (or down), negative values move it to the left (or up).
   */
  moveDivider(index: number, pxDelta: number): void;
}

/**
 * Represents the context of a drag operation in the splitter.
 */
export type SplitterDragContext = {
  /**
   * The index of the divider being dragged.
   */
  dividerIndex: number;
  /**
   * The ID of the pointer that initiated the drag operation.
   */
  pointerId: number;
  /**
   * The starting position of the pointer when the drag operation started, in pixels.
   */
  startPosition: number;
};

/**
 * Default implementation of the {@link SplitterCalculator} interface.
 * Delegates all resize math to the generic {@link ResizeEngine}.
 */
export class DefaultSplitterCalculator implements SplitterCalculator {
  protected readonly panels: Signal<readonly NgnSplitterPanel[]>;
  protected readonly dividers: Signal<readonly EmbeddedViewRef<unknown>[]>;
  protected readonly panelOrder: Signal<readonly string[] | null | undefined>;
  protected readonly layout: Signal<SplitterLayout>;
  protected readonly splitterSize: Signal<number>;

  private readonly _engine: ResizeEngine;

  constructor(splitter: NgnSplitter) {
    this.panels = splitter.panels;
    this.dividers = splitter.dividers;
    this.panelOrder = splitter.panelOrder;
    this.layout = splitter.layout;
    this.splitterSize = computed(() =>
      this.layout() === 'vertical' ? splitter.elementSize().height : splitter.elementSize().width
    );

    // Create the resize engine with panels mapped as ResizableItems
    this._engine = new ResizeEngine({
      items: computed(() => this.orderedPanels() as unknown as readonly ResizableItem[]),
      containerSize: this.splitterSize,
      gapSizes: this.dividerSizes,
      distributionMode: computed(
        () => (splitter.resizeMode?.() ?? 'adjacent') as ResizeDistributionMode
      ),
      containerConstrained: signal(true), // Splitter is always constrained
      lockSizes: computed(() => splitter.lockSizes?.() ?? false),
    });
  }

  public readonly orderedPanels = computed(() => {
    const panels = this.panels();
    const order = this.panelOrder();
    return order
      ? [...panels].sort((a, b) => {
          const aIndex = order.indexOf(a['gridArea']());
          const bIndex = order.indexOf(b['gridArea']());
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        })
      : panels;
  });

  public readonly gridTemplateSizes = computed(() => this._engine.gridTemplateSizes());

  public readonly gridTemplateAreas = computed(() => {
    const panels = this.orderedPanels();
    if (panels.length === 0) return null;
    let result = '';
    panels.forEach((panel, i) => {
      if (i > 0) {
        result +=
          this.layout() === 'horizontal' ? ` ngn-divider-${i - 1} ` : ` "ngn-divider-${i - 1}" `;
      }
      result += this.layout() === 'horizontal' ? panel['gridArea']() : `"${panel['gridArea']()}"`;
    });
    return this.layout() === 'horizontal' ? `"${result}"` : result;
  });

  public readonly minSize = computed(() => this._engine.minTotalSize());

  public readonly maxSize = computed(() => this._engine.maxTotalSize());

  public readonly dragContext = signal<SplitterDragContext | null>(null);

  protected readonly dividerSizes = computed(() =>
    this.dividers().map(d => {
      const el = d.rootNodes.find(x => x instanceof HTMLElement);
      return el ? (this.layout() === 'horizontal' ? el.offsetWidth : el.offsetHeight) : 0;
    })
  );

  public startDrag(index: number, event: PointerEvent) {
    const panels = this.orderedPanels();
    if (index < 0 || index >= panels.length - 1) return;

    const startPosition = this.layout() === 'horizontal' ? event.clientX : event.clientY;

    this.dragContext.set({
      dividerIndex: index,
      pointerId: event.pointerId,
      startPosition,
    });

    this._engine.startDrag(index, startPosition);
  }

  public drag(index: number, event: PointerEvent) {
    const ctx = this.dragContext();
    if (!ctx || ctx.dividerIndex !== index || ctx.pointerId !== event.pointerId) return;

    const currentPosition = this.layout() === 'horizontal' ? event.clientX : event.clientY;
    this._engine.drag(index, currentPosition);
  }

  public endDrag(index: number, event: PointerEvent, isCancel: boolean) {
    const ctx = this.dragContext();
    if (!ctx || ctx.dividerIndex !== index || ctx.pointerId !== event.pointerId) return;

    this._engine.endDrag(index, isCancel);
    this.dragContext.set(null);
  }

  public moveDivider(index: number, pxDelta: number) {
    const panels = this.orderedPanels();
    if (index < 0 || index >= panels.length - 1) return;

    const leftPanel =
      panels[index] ??
      throwExp('NgnSplitterCalculator', `Left panel is missing for divider at index ${index}`);
    const rightPanel =
      panels[index + 1] ??
      throwExp('NgnSplitterCalculator', `Right panel is missing for divider at index ${index}`);

    if (
      !this._engine.isItemSizeCalculated(leftPanel as unknown as ResizableItem) ||
      !this._engine.isItemSizeCalculated(rightPanel as unknown as ResizableItem)
    ) {
      Logger.warn('Cannot move divider, panel sizes are not calculated');
      return;
    }

    this._engine.moveDivider(index, pxDelta);
  }

  /**
   * Ensures all panels respect their min/max size constraints.
   * Delegates to the underlying {@link ResizeEngine}.
   */
  public ensureMinMaxSizes() {
    this._engine.ensureMinMaxSizes();
  }

  /** @internal — used by tests to seed panel sizes into the engine. */
  public setPanelSize(panel: NgnSplitterPanel, size: string) {
    this._engine.setItemSize(panel as unknown as ResizableItem, size as ResizeSize);
  }
}
