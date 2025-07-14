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
import {
  SplitterLayout,
  SplitterPanelSize,
  SplitterPanelSizeLimitUnit,
  SplitterPanelSizeUnit,
} from './types';
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

export interface SplitterCalculatorType {
  new (splitter: NgnSplitter): SplitterCalculator;
}

export interface SplitterCalculator {
  orderedPanels: Signal<readonly NgnSplitterPanel[]>;
  gridTemplateSizes: Signal<string>;
  gridTemplateAreas: Signal<string | null>;
  dragContext: Signal<SplitterDragContext | null>;
  minSize: Signal<string>;
  maxSize: Signal<string>;

  startDrag(index: number, event: PointerEvent): void;
  drag(index: number, event: PointerEvent): void;
  endDrag(index: number, event: PointerEvent, isCancel: boolean): void;
  moveDivider(index: number, pxDelta: number): void;
}

export type SplitterDragContext = {
  dividerIndex: number;
  pointerId: number;
  startPosition: number;
  leftStartSize: ExpandedSplitterPanelSize;
  rightStartSize: ExpandedSplitterPanelSize;
  leftLimits: {
    min: ExpandedSplitterPanelSizeLimit;
    max: ExpandedSplitterPanelSizeLimit;
  };
  rightLimits: {
    min: ExpandedSplitterPanelSizeLimit;
    max: ExpandedSplitterPanelSizeLimit;
  };
  leftPanel: NgnSplitterPanel;
  rightPanel: NgnSplitterPanel;
};

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
        result.push(` ${dividerSize}px`);
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
  protected readonly fractionFactors = computed(() => {
    const frArea = this.splitterSize() - this.totalDividerSize() - this.totalPanelSizes().px;
    return {
      frPerPx: this.totalPanelSizes().fr / frArea,
      pxPerFr: frArea / this.totalPanelSizes().fr,
    };
  });

  public startDrag(index: number, event: PointerEvent) {
    const panels = this.orderedPanels();
    if (index < 0 || index >= panels.length - 1) return;

    const leftPanel = panels[index];
    const rightPanel = panels[index + 1];

    this.dragContext.set({
      dividerIndex: index,
      pointerId: event.pointerId,
      startPosition: this.layout() === 'horizontal' ? event.clientX : event.clientY,
      leftStartSize: expandSplitterPanelSize(leftPanel.size()),
      rightStartSize: expandSplitterPanelSize(rightPanel.size()),
      leftLimits: {
        min: expandSplitterPanelSizeLimit(leftPanel.minSize()),
        max: expandSplitterPanelSizeLimit(leftPanel.maxSize()),
      },
      rightLimits: {
        min: expandSplitterPanelSizeLimit(rightPanel.minSize()),
        max: expandSplitterPanelSizeLimit(rightPanel.maxSize()),
      },
      leftPanel,
      rightPanel,
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

    this.applyDividerDelta(pxDelta, ctx);
  }

  public endDrag(index: number, event: PointerEvent, isCancel: boolean) {
    const ctx = this.dragContext();
    if (!ctx || ctx.dividerIndex !== index || ctx.pointerId !== event.pointerId) return;

    if (isCancel) {
      // Reset the panels to their original sizes
      ctx.leftPanel.size.set(`${ctx.leftStartSize.value}${ctx.leftStartSize.unit}`);
      ctx.rightPanel.size.set(`${ctx.rightStartSize.value}${ctx.rightStartSize.unit}`);
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

    this.applyDividerDelta(pxDelta, {
      leftPanel,
      rightPanel,
      leftStartSize: expandSplitterPanelSize(leftPanel.size()),
      rightStartSize: expandSplitterPanelSize(rightPanel.size()),
      leftLimits: {
        min: expandSplitterPanelSizeLimit(leftPanel.minSize()),
        max: expandSplitterPanelSizeLimit(leftPanel.maxSize()),
      },
      rightLimits: {
        min: expandSplitterPanelSizeLimit(rightPanel.minSize()),
        max: expandSplitterPanelSizeLimit(rightPanel.maxSize()),
      },
    });
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
    pxDelta: number,
    options: {
      leftPanel: NgnSplitterPanel;
      rightPanel: NgnSplitterPanel;
      leftStartSize: { unit: SplitterPanelSizeUnit; value: number };
      rightStartSize: { unit: SplitterPanelSizeUnit; value: number };
      leftLimits: {
        min: { unit: SplitterPanelSizeLimitUnit; value: number };
        max: { unit: SplitterPanelSizeLimitUnit; value: number };
      };
      rightLimits: {
        min: { unit: SplitterPanelSizeLimitUnit; value: number };
        max: { unit: SplitterPanelSizeLimitUnit; value: number };
      };
    }
  ) {
    const { leftPanel, rightPanel, leftStartSize, rightStartSize, leftLimits, rightLimits } =
      options;

    const leftStartPx =
      leftStartSize.unit === 'px'
        ? leftStartSize.value
        : this.fractionFactors().pxPerFr * leftStartSize.value;
    const newLeftPx = leftStartPx + pxDelta;
    if (pxDelta < 0) {
      const min =
        leftLimits.min.unit === 'px'
          ? leftLimits.min.value
          : (leftLimits.min.value / 100) * this.splitterSize();
      if (min > newLeftPx) {
        pxDelta = -(leftStartPx - min);
      }
    } else if (pxDelta > 0) {
      const max =
        leftLimits.max.unit === 'px'
          ? leftLimits.max.value
          : (leftLimits.max.value / 100) * this.splitterSize();
      if (max < newLeftPx) {
        pxDelta = max - leftStartPx;
      }
    }

    const rightStartPx =
      rightStartSize.unit === 'px'
        ? rightStartSize.value
        : this.fractionFactors().pxPerFr * rightStartSize.value;
    const newRightPx = rightStartPx - pxDelta;
    if (pxDelta > 0) {
      const min =
        rightLimits.min.unit === 'px'
          ? rightLimits.min.value
          : (rightLimits.min.value / 100) * this.splitterSize();
      if (min > newRightPx) {
        pxDelta = rightStartPx - min;
      }
    } else if (pxDelta < 0) {
      const max =
        rightLimits.max.unit === 'px'
          ? rightLimits.max.value
          : (rightLimits.max.value / 100) * this.splitterSize();
      if (max < newRightPx) {
        pxDelta = -(max - rightStartPx);
      }
    }

    const frDelta = pxDelta * this.fractionFactors().frPerPx;
    if (leftStartSize.unit === 'px') {
      this.setPanelSize(leftPanel, `${leftStartSize.value + pxDelta}px`);
    } else if (leftStartSize.unit === 'fr') {
      this.setPanelSize(leftPanel, `${leftStartSize.value + frDelta}fr`);
    }
    if (rightStartSize.unit === 'px') {
      this.setPanelSize(rightPanel, `${rightStartSize.value - pxDelta}px`);
    } else if (rightStartSize.unit === 'fr') {
      this.setPanelSize(rightPanel, `${rightStartSize.value - frDelta}fr`);
    }
  }
}
