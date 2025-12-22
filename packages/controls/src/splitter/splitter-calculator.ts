import {
  afterRenderEffect,
  computed,
  EmbeddedViewRef,
  signal,
  Signal,
  untracked,
} from '@angular/core';
import { Logger } from '@ngneers/controls/utils';

import { NgnSplitterPanel } from './panel/splitter-panel';
import { NgnSplitter } from './splitter';
import { SplitterLayout, SplitterPanelSize } from './types';
import {
  ExpandedSplitterPanelSize,
  ExpandedSplitterPanelSizeLimit,
  expandSplitterPanelSize,
  expandSplitterPanelSizeLimit,
  getSplitterPanelSizeLimitInPx,
  getSplitterPanelSizeLimitUnit,
  getSplitterPanelSizeLimitValue,
  getSplitterPanelSizeUnit,
  getSplitterPanelSizeValue,
} from './utils';

const LAST_CALC_SIZE_SYMBOL = Symbol('lastCalcSize');

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

type SplitterFractionFactors = {
  /**
   * The number of fraction units per pixel.
   * This is used to convert pixel values to fraction values.
   */
  frPerPx: number;
  /**
   * The number of pixels per fraction unit.
   * This is used to convert fraction values to pixel values.
   */
  pxPerFr: number;
};

type SplitterDragContextPanel = {
  /**
   * A reference to the panel component.
   */
  panel: NgnSplitterPanel;
  /**
   * The starting size of the panel at the beginning of the drag operation.
   */
  startSize: ExpandedSplitterPanelSize;
  /**
   * The minimum size limit of the panel.
   */
  minSize: ExpandedSplitterPanelSizeLimit;
  /**
   * The maximum size limit of the panel.
   */
  maxSize: ExpandedSplitterPanelSizeLimit;
};

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
  /**
   * An array of panels involved in the drag operation.
   */
  panels: SplitterDragContextPanel[];
  /**
   * The fraction factors used for calculating sizes during the drag operation.
   */
  fractionFactors: SplitterFractionFactors;
};

/**
 * Default implementation of the {@link SplitterCalculator} interface.
 */
export class DefaultSplitterCalculator implements SplitterCalculator {
  protected readonly panels: Signal<readonly NgnSplitterPanel[]>;
  protected readonly dividers: Signal<readonly EmbeddedViewRef<unknown>[]>;
  protected readonly panelOrder: Signal<readonly string[] | null | undefined>;
  protected readonly layout: Signal<SplitterLayout>;
  protected readonly splitterSize: Signal<number>;

  constructor(splitter: NgnSplitter) {
    this.panels = splitter.panels;
    this.dividers = splitter.dividers;
    this.panelOrder = splitter.panelOrder;
    this.layout = splitter.layout;
    this.splitterSize = computed(() =>
      this.layout() === 'vertical' ? splitter.elementSize().height : splitter.elementSize().width
    );

    // Signal fires when any panel size is not calculated
    const hasUncalculatedSizesSig = computed(
      () => this.panels().some(panel => !this.isPanelSizeCalculated(panel)),
      { equal: (_, b) => b === false }
    ) as Signal<void>;

    // Ensure that min and max limits are handled correctly
    afterRenderEffect(() => {
      // Recalculate on outside changes (e.g. panel size input changes, state restore, etc.)
      hasUncalculatedSizesSig();
      // Recalculate on splitter size changes
      this.splitterSize();
      untracked(() => this.ensureMinMaxSizes());
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
          if (aIndex === -1) return 1; // a is not in order, put it at the end
          if (bIndex === -1) return -1; // b is not in order, put it at the end
          return aIndex - bIndex; // sort by index in panelOrder
        })
      : panels;
  });

  public readonly gridTemplateSizes = computed(() => {
    const panels = this.orderedPanels();
    const dividerSizes = this.dividerSizes();

    if (panels.length === 0) return 'none';
    const result: string[] = [];
    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i];
      const size = panel.size();
      result.push(size);

      if (i < dividerSizes.length) {
        const dividerSize = dividerSizes[i] || 0;
        result.push(`${dividerSize}px`);
      }
    }

    return result.join(' ');
  });

  public readonly gridTemplateAreas = computed(() => {
    const panels = this.orderedPanels();
    if (panels.length === 0) return null;
    let result = '';
    for (let i = 0; i < panels.length; i++) {
      if (i > 0) {
        result +=
          this.layout() === 'horizontal' ? ` ngn-divider-${i - 1} ` : ` "ngn-divider-${i - 1}" `;
      }
      result +=
        this.layout() === 'horizontal' ? panels[i]['gridArea']() : `"${panels[i]['gridArea']()}"`;
    }
    return this.layout() === 'horizontal' ? `"${result}"` : result;
  });

  public readonly minSize = computed(() => {
    const { px, '%': pc } = this.panels().reduce(
      (acc, panel) => {
        const size = panel.size();
        if (getSplitterPanelSizeUnit(size) === 'px') {
          acc.px += getSplitterPanelSizeValue(size);
        } else {
          const minSize = panel.minSize();
          acc[getSplitterPanelSizeLimitUnit(minSize)] += getSplitterPanelSizeLimitValue(minSize);
        }
        return acc;
      },
      { px: 0, '%': 0 }
    );
    return `calc(${px + this.totalDividerSize()}px + ${pc}%)`;
  });

  public readonly maxSize = computed(() => {
    const { px, '%': pc } = this.panels().reduce(
      (acc, panel) => {
        const size = panel.size();
        if (getSplitterPanelSizeUnit(size) === 'px') {
          acc.px += getSplitterPanelSizeValue(size);
        } else {
          const maxSize = panel.maxSize();
          acc[getSplitterPanelSizeLimitUnit(maxSize)] += getSplitterPanelSizeLimitValue(maxSize);
        }
        return acc;
      },
      { px: 0, '%': 0 }
    );
    return `calc(${px + this.totalDividerSize()}px + ${pc}%)`;
  });

  public readonly dragContext = signal<SplitterDragContext | null>(null);

  protected readonly dividerSizes = computed(() =>
    this.dividers().map(d => {
      const el = d.rootNodes.find(x => x instanceof HTMLElement);
      return el ? (this.layout() === 'horizontal' ? el.offsetWidth : el.offsetHeight) : 0;
    })
  );
  protected readonly totalDividerSize = computed(() =>
    this.dividerSizes().reduce((acc, size) => acc + size, 0)
  );
  protected readonly totalPanelSizes = computed(() =>
    this.panels().reduce(
      (acc, panel) => {
        const size = panel.size();
        acc[getSplitterPanelSizeUnit(size)] += getSplitterPanelSizeValue(size);
        return acc;
      },
      { px: 0, fr: 0 }
    )
  );

  public startDrag(index: number, event: PointerEvent) {
    const panels = this.orderedPanels();
    if (index < 0 || index >= panels.length - 1) return;

    this.dragContext.set({
      dividerIndex: index,
      pointerId: event.pointerId,
      startPosition: this.layout() === 'horizontal' ? event.clientX : event.clientY,
      panels: panels.map(panel => this.createContextPanel(panel)),
      fractionFactors: this.getCurrentFractionFactors(),
    });
  }

  public drag(index: number, event: PointerEvent) {
    const ctx = this.dragContext();
    if (!ctx || ctx.dividerIndex !== index || ctx.pointerId !== event.pointerId) return;

    const { startPosition } = ctx;

    let pxDelta: number;
    if (this.layout() === 'horizontal') {
      pxDelta = event.clientX - startPosition;
    } else {
      pxDelta = event.clientY - startPosition;
    }

    this.applyDividerDelta(index, pxDelta, ctx.panels, ctx.fractionFactors);
  }

  public endDrag(index: number, event: PointerEvent, isCancel: boolean) {
    const ctx = this.dragContext();
    if (!ctx || ctx.dividerIndex !== index || ctx.pointerId !== event.pointerId) return;

    if (isCancel) {
      // Reset the panels to their original sizes
      ctx.panels.forEach(p => p.panel.size.set(`${p.startSize.value}${p.startSize.unit}`));
    }

    this.dragContext.set(null);
  }

  public moveDivider(index: number, pxDelta: number) {
    const panels = this.orderedPanels();
    if (index < 0 || index >= panels.length - 1) return;

    const leftPanel = panels[index];
    const rightPanel = panels[index + 1];

    // If the size is not calculated, we cannot move the divider
    if (!this.isPanelSizeCalculated(leftPanel) || !this.isPanelSizeCalculated(rightPanel)) {
      Logger.warn('Cannot move divider, panel sizes are not calculated');
      return;
    }

    this.applyDividerDelta(
      index,
      pxDelta,
      panels.map(panel => this.createContextPanel(panel)),
      this.getCurrentFractionFactors()
    );
  }

  public ensureMinMaxSizes() {
    const panels = this.orderedPanels();
    if (panels.length === 0) return;

    const panelSizes = panels.map(panel => {
      return {
        panel,
        size: {
          unit: getSplitterPanelSizeUnit(panel.size()),
          value: getSplitterPanelSizeValue(panel.size()),
        },
        minSizePx: getSplitterPanelSizeLimitInPx(panel.minSize(), this.splitterSize()),
        maxSizePx: getSplitterPanelSizeLimitInPx(panel.maxSize(), this.splitterSize()),
      };
    });

    // First make sure all px sizes are in the limits
    for (const { size, minSizePx, maxSizePx } of panelSizes) {
      if (size.unit === 'px') {
        if (size.value < minSizePx) {
          size.value = minSizePx;
        } else if (size.value > maxSizePx) {
          size.value = maxSizePx;
        }
      }
    }

    // Calculate the fraction factors
    const totalPanelSizes = panelSizes.reduce(
      (acc, { size }) => {
        acc[size.unit] += size.value;
        return acc;
      },
      { px: 0, fr: 0 }
    );
    const frArea = this.splitterSize() - this.totalDividerSize() - totalPanelSizes.px;
    const frPerPx = totalPanelSizes.fr / frArea;
    const pxPerFr = frArea / totalPanelSizes.fr;

    // Now make sure all fr sizes are in the limits
    // We need to do this in a loop because we might need to adjust the fr sizes multiple times
    // until all panels are within their limits while distributing the over-/underflow evenly
    let frPanelsWithoutClamping = panelSizes.filter(p => p.size.unit === 'fr');
    let frToDistribute: number | undefined = undefined; // Not needed initially
    while (frPanelsWithoutClamping.length > 0 && frToDistribute !== 0) {
      const frToAddPerPanel = frToDistribute ? frToDistribute / frPanelsWithoutClamping.length : 0;
      const next: typeof panelSizes = []; // Track panels that are still within limits
      let currentTotalFrSize = totalPanelSizes.fr; // Track the total fr size after clamping
      for (const p of frPanelsWithoutClamping) {
        const minSizeFr = p.minSizePx * frPerPx;
        const maxSizeFr = p.maxSizePx * frPerPx;
        p.size.value += frToAddPerPanel;
        if (p.size.value < minSizeFr) {
          currentTotalFrSize = currentTotalFrSize - p.size.value + minSizeFr;
          p.size.value = minSizeFr;
        } else if (p.size.value > maxSizeFr) {
          currentTotalFrSize = currentTotalFrSize - p.size.value + maxSizeFr;
          p.size.value = maxSizeFr;
        } else {
          next.push(p);
        }
      }
      frToDistribute = totalPanelSizes.fr - currentTotalFrSize;
      if (Math.abs(frToDistribute * pxPerFr) < 1) {
        frToDistribute = 0; // Stop if we are close enough to zero
      }
      frPanelsWithoutClamping = next;
    }

    // Now set all the new sizes to the panels
    for (const { panel, size } of panelSizes) {
      this.setPanelSize(panel, `${size.value}${size.unit}`);
    }
  }

  private createContextPanel(panel: NgnSplitterPanel): SplitterDragContextPanel {
    return {
      panel,
      startSize: expandSplitterPanelSize(panel.size()),
      minSize: expandSplitterPanelSizeLimit(panel.minSize()),
      maxSize: expandSplitterPanelSizeLimit(panel.maxSize()),
    };
  }

  private getCurrentFractionFactors() {
    const frArea = this.splitterSize() - this.totalDividerSize() - this.totalPanelSizes().px || 1; // Avoid division by zero
    const totalFr = this.totalPanelSizes().fr || 1; // Avoid division by zero
    return {
      frPerPx: totalFr / frArea,
      pxPerFr: frArea / totalFr,
    };
  }

  private setPanelSize(panel: NgnSplitterPanel, size: SplitterPanelSize) {
    panel.size.set(size);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (panel as any)[LAST_CALC_SIZE_SYMBOL] = size;
  }

  private isPanelSizeCalculated(panel: NgnSplitterPanel): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (panel as any)[LAST_CALC_SIZE_SYMBOL] === panel.size();
  }

  private applyDividerDelta(
    dividerIndex: number,
    pxDelta: number,
    panels: SplitterDragContextPanel[],
    fractionFactors: SplitterFractionFactors
  ) {
    const appliedPanelDeltas: number[] = Array(panels.length).fill(0);

    const recursion = (
      pxDelta: number,
      panelIndex: number,
      panelIndexIncrement: number
    ): number => {
      if (panelIndex >= panels.length || panelIndex < 0) return 0;
      const panel = panels[panelIndex];
      let unappliedDelta = 0;

      const startPx =
        panel.startSize.unit === 'px'
          ? panel.startSize.value
          : fractionFactors.pxPerFr * panel.startSize.value;
      const newPx = startPx + pxDelta;
      if (pxDelta < 0) {
        const min =
          panel.minSize.unit === 'px'
            ? panel.minSize.value
            : (panel.minSize.value / 100) * this.splitterSize();
        if (min > newPx) {
          unappliedDelta = -(min - newPx);
        }
      } else if (pxDelta > 0) {
        const max =
          panel.maxSize.unit === 'px'
            ? panel.maxSize.value
            : (panel.maxSize.value / 100) * this.splitterSize();
        if (max < newPx) {
          unappliedDelta = newPx - max;
        }
      }

      const appliedDelta = pxDelta - unappliedDelta;
      appliedPanelDeltas[panelIndex] = appliedDelta;

      return unappliedDelta === 0
        ? pxDelta
        : appliedDelta +
            recursion(unappliedDelta, panelIndex + panelIndexIncrement, panelIndexIncrement);
    };

    let appliedLeft = recursion(pxDelta, dividerIndex, -1);
    let appliedRight = -recursion(-pxDelta, dividerIndex + 1, 1);

    if (appliedLeft !== pxDelta || appliedRight !== pxDelta) {
      pxDelta =
        pxDelta < 0 ? Math.max(appliedLeft, appliedRight) : Math.min(appliedLeft, appliedRight);
      appliedPanelDeltas.fill(0);
      appliedLeft = recursion(pxDelta, dividerIndex, -1);
      appliedRight = -recursion(-pxDelta, dividerIndex + 1, 1);

      // istanbul ignore next - Defensive code for edge case where adjusted pxDelta still can't be applied.
      // This appears to be unreachable given the adjustment logic above ensures pxDelta is set to the
      // min/max of what both sides can handle. Unable to reproduce in testing despite multiple attempts.
      if (appliedLeft !== pxDelta || appliedRight !== pxDelta) {
        return;
      }
    }

    for (let i = 0; i < panels.length; i++) {
      const pxDelta = appliedPanelDeltas[i];
      if (panels[i].startSize.unit === 'px') {
        const size = panels[i].startSize.value + pxDelta;
        this.setPanelSize(panels[i].panel, `${Math.max(0, size)}px`);
      } else {
        const size = panels[i].startSize.value + pxDelta * fractionFactors.frPerPx;
        this.setPanelSize(panels[i].panel, `${Math.max(0, size)}fr`);
      }
    }
  }
}
