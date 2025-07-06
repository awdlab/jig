import { NgClass } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  contentChildren,
  EmbeddedViewRef,
  HostBinding,
  inject,
  input,
  model,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  injectThemeTemplate,
  NGN_CONFIG,
  NgnTemplate,
  templateTypeFn,
} from '@ngneers/controls/api';
import { BaseDirective } from '@ngneers/controls/base';
import { Logger, NgnStateStorage, registerState } from '@ngneers/controls/utils';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';

import { SplitterPanel } from './panel/splitter-panel';
import {
  SplitterLayout,
  SplitterPanelSizeLimitUnit,
  SplitterPanelSizeUnit,
  SplitterState,
} from './types';
import {
  getSplitterPanelSizeLimitUnit,
  getSplitterPanelSizeLimitValue,
  getSplitterPanelSizeUnit,
  getSplitterPanelSizeValue,
  isSplitterPanelSize,
} from './utils';

type DragInfo = {
  dividerIndex: number;
  pointerId: number;
  startPosition: number;
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
  leftPanel: SplitterPanel;
  rightPanel: SplitterPanel;
};

@Component({
  selector: 'ngn-splitter',
  templateUrl: './splitter.html',
  styleUrls: ['./splitter.scss'], // TODO: refactor into theme
  encapsulation: ViewEncapsulation.None,
  imports: [NgClass, NgnTemplate],
  host: {
    role: 'region',
  },
})
export class Splitter extends BaseDirective implements OnDestroy {
  private readonly _viewContainer = inject(ViewContainerRef);
  private readonly _config = inject(NGN_CONFIG);
  protected readonly theme = injectThemeTemplate(splitterControlTemplate);

  // #region divider
  protected readonly dividerTemplateType = templateTypeFn<undefined, { index: number }>();
  private readonly _dividerTemplate =
    viewChild.required<TemplateRef<typeof this.dividerTemplateType>>('defaultDividerTemplate');
  public readonly dividers = signal<EmbeddedViewRef<typeof this.dividerTemplateType>[]>([]);
  private readonly _dividerSizes = computed(() =>
    this.dividers().map(d => {
      const el = d.rootNodes.find(x => x instanceof HTMLElement);
      return el ? (this.layout() === 'horizontal' ? el.offsetWidth : el.offsetHeight) : 0;
    })
  );
  // #endregion

  // #region panels
  public readonly panels = contentChildren(SplitterPanel);
  protected readonly orderedPanels = computed(() => {
    const panels = this.panels();
    const order = this.panelOrder();
    return order
      ? [...panels].sort((a, b) => {
          const aIndex = order.indexOf(a['gridArea']);
          const bIndex = order.indexOf(b['gridArea']);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1; // a is not in order, put it at the end
          if (bIndex === -1) return -1; // b is not in order, put it at the end
          return aIndex - bIndex; // sort by index in panelOrder
        })
      : panels;
  });
  // #endregion

  // #region sizes
  private readonly _totalDividerSize = computed(() =>
    this._dividerSizes().reduce((acc, size) => acc + size, 0)
  );
  private readonly _totalPanelSizes = computed(() =>
    this.panels().reduce(
      (acc, panel) => {
        const size = panel.size();
        acc[getSplitterPanelSizeUnit(size)] += getSplitterPanelSizeValue(size);
        return acc;
      },
      { px: 0, fr: 0 }
    )
  );
  // #endregion

  // #region host bindings
  private readonly _hostClass = computed(() => {
    return `${this.theme.class()} ${this.theme.class(this.layout())} ${this.isDragging() ? this.theme.class('dragging') : ''}`;
  });
  @HostBinding('class')
  protected get hostClass(): string {
    return this._hostClass();
  }

  private readonly _gridTemplateSizes = computed(() => this.calculateGridTemplateSizes());
  private readonly _gridTemplateColumns = computed(() =>
    this.layout() === 'horizontal' ? this._gridTemplateSizes() : null
  );
  private readonly _gridTemplateRows = computed(() =>
    this.layout() === 'vertical' ? this._gridTemplateSizes() : null
  );
  @HostBinding('style.grid-template-columns')
  protected get gridTemplateColumns(): string | null {
    return this._gridTemplateColumns();
  }
  @HostBinding('style.grid-template-rows')
  protected get gridTemplateRows(): string | null {
    return this._gridTemplateRows();
  }
  @HostBinding('style.grid-template-areas')
  protected get gridTemplateAreas(): string | null {
    const panels = this.orderedPanels();
    if (panels.length === 0) return null;
    let result = '';
    for (let i = 0; i < panels.length; i++) {
      if (i > 0) {
        result +=
          this.layout() === 'horizontal' ? ` ngn-divider-${i - 1} ` : ` "ngn-divider-${i - 1}" `;
      }
      result +=
        this.layout() === 'horizontal' ? panels[i]['gridArea'] : `"${panels[i]['gridArea']}"`;
    }
    return this.layout() === 'horizontal' ? `"${result}"` : result;
  }
  // #endregion

  // #region drag info
  public readonly dragInfo = signal<DragInfo | null>(null);
  public readonly isDragging = computed(() => this.dragInfo() !== null);
  // #endregion

  // #region inputs
  public readonly layout = model.required<SplitterLayout>();
  public readonly dividerStyleClass = input<string | null>();
  public readonly panelOrder = model<string[] | null>();
  public readonly stateStorage = input<NgnStateStorage>(
    this._config.defaults.splitter.stateStorage
  );
  public readonly stateKey = input<string | null>();
  public readonly stateData = input<readonly ('layout' | 'panelOrder' | 'panelSizes')[]>([
    'layout',
    'panelOrder',
    'panelSizes',
  ]);
  // #endregion

  // #region outputs
  public readonly stateSaving = output<SplitterState>();
  public readonly stateLoading = output<SplitterState>();
  // #endregion

  constructor() {
    super();

    afterRenderEffect(() => {
      const panels = this.panels();
      this.updateDividers(panels);
    });

    registerState({
      storage: () => this.stateStorage(),
      key: () => this.stateKey(),
      valueFn: this.computeState.bind(this),
      onLoad: this.onStateLoad.bind(this),
      debounce: 100,
    });
  }

  public ngOnDestroy(): void {
    // Clean up dividers
    this.dividers().forEach(divider => divider.destroy());
    this.dividers.set([]);
  }

  protected onPointerDown(index: number, event: PointerEvent) {
    const panels = this.orderedPanels();
    if (index < 0 || index >= panels.length - 1) return;

    const leftPanel = panels[index];
    const rightPanel = panels[index + 1];

    this.dragInfo.set({
      dividerIndex: index,
      pointerId: event.pointerId,
      startPosition: this.layout() === 'horizontal' ? event.clientX : event.clientY,
      leftStartSize: {
        unit: getSplitterPanelSizeUnit(leftPanel.size()),
        value: getSplitterPanelSizeValue(leftPanel.size()),
      },
      rightStartSize: {
        unit: getSplitterPanelSizeUnit(rightPanel.size()),
        value: getSplitterPanelSizeValue(rightPanel.size()),
      },
      leftLimits: {
        min: {
          unit: getSplitterPanelSizeLimitUnit(leftPanel.minSize()),
          value: getSplitterPanelSizeLimitValue(leftPanel.minSize()),
        },
        max: {
          unit: getSplitterPanelSizeLimitUnit(leftPanel.maxSize()),
          value: getSplitterPanelSizeLimitValue(leftPanel.maxSize()),
        },
      },
      rightLimits: {
        min: {
          unit: getSplitterPanelSizeLimitUnit(rightPanel.minSize()),
          value: getSplitterPanelSizeLimitValue(rightPanel.minSize()),
        },
        max: {
          unit: getSplitterPanelSizeLimitUnit(rightPanel.maxSize()),
          value: getSplitterPanelSizeLimitValue(rightPanel.maxSize()),
        },
      },
      leftPanel,
      rightPanel,
    });

    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      throw new Error('Event target is not an HTMLElement');
    }
    // Make sure the element is stable before capturing the pointer
    requestAnimationFrame(() => target.setPointerCapture(event.pointerId));

    // Prevent default to avoid text selection
    event.preventDefault();
  }

  protected onPointerMove(index: number, event: PointerEvent) {
    const dragInfo = this.dragInfo();
    if (!dragInfo || dragInfo.dividerIndex !== index || dragInfo.pointerId !== event.pointerId)
      return;

    const {
      startPosition,
      leftPanel,
      rightPanel,
      leftStartSize,
      rightStartSize,
      leftLimits,
      rightLimits,
    } = dragInfo;

    let controlSize: number;
    let pxDelta: number;
    if (this.layout() === 'horizontal') {
      controlSize = this.element.nativeElement.offsetWidth;
      pxDelta = event.clientX - startPosition;
    } else {
      controlSize = this.element.nativeElement.offsetHeight;
      pxDelta = event.clientY - startPosition;
    }

    let frPerPx: number = 0;
    let pxPerFr: number = 0;
    if (leftStartSize.unit === 'fr' || rightStartSize.unit === 'fr') {
      const frArea = controlSize - this._totalDividerSize() - this._totalPanelSizes().px;
      frPerPx = this._totalPanelSizes().fr / frArea;
      pxPerFr = frArea / this._totalPanelSizes().fr;
    }

    const leftStartPx =
      leftStartSize.unit === 'px' ? leftStartSize.value : pxPerFr * leftStartSize.value;
    const newLeftPx = leftStartPx + pxDelta;
    if (pxDelta < 0) {
      const min =
        leftLimits.min.unit === 'px'
          ? leftLimits.min.value
          : (leftLimits.min.value / 100) * controlSize;
      if (min > newLeftPx) {
        pxDelta = -(leftStartPx - min);
      }
    } else if (pxDelta > 0) {
      const max =
        leftLimits.max.unit === 'px'
          ? leftLimits.max.value
          : (leftLimits.max.value / 100) * controlSize;
      if (max < newLeftPx) {
        pxDelta = max - leftStartPx;
      }
    }

    const rightStartPx =
      rightStartSize.unit === 'px' ? rightStartSize.value : pxPerFr * rightStartSize.value;
    const newRightPx = rightStartPx - pxDelta;
    if (pxDelta > 0) {
      const min =
        rightLimits.min.unit === 'px'
          ? rightLimits.min.value
          : (rightLimits.min.value / 100) * controlSize;
      if (min > newRightPx) {
        pxDelta = rightStartPx - min;
      }
    } else if (pxDelta < 0) {
      const max =
        rightLimits.max.unit === 'px'
          ? rightLimits.max.value
          : (rightLimits.max.value / 100) * controlSize;
      if (max < newRightPx) {
        pxDelta = -(max - rightStartPx);
      }
    }

    const frDelta = pxDelta * frPerPx;
    if (leftStartSize.unit === 'px') {
      leftPanel.size.set(`${leftStartSize.value + pxDelta}px`);
    } else if (leftStartSize.unit === 'fr') {
      leftPanel.size.set(`${leftStartSize.value + frDelta}fr`);
    }
    if (rightStartSize.unit === 'px') {
      rightPanel.size.set(`${rightStartSize.value - pxDelta}px`);
    } else if (rightStartSize.unit === 'fr') {
      rightPanel.size.set(`${rightStartSize.value - frDelta}fr`);
    }
  }

  protected onPointerUp(index: number, event: PointerEvent) {
    const dragInfo = this.dragInfo();
    if (!dragInfo || dragInfo.dividerIndex !== index || dragInfo.pointerId !== event.pointerId)
      return;

    this.dragInfo.set(null);
  }

  protected onPointerCancel(index: number, event: PointerEvent) {
    const dragInfo = this.dragInfo();
    if (!dragInfo || dragInfo.dividerIndex !== index || dragInfo.pointerId !== event.pointerId)
      return;

    // Reset the panels to their original sizes
    dragInfo.leftPanel.size.set(`${dragInfo.leftStartSize.value}${dragInfo.leftStartSize.unit}`);
    dragInfo.rightPanel.size.set(`${dragInfo.rightStartSize.value}${dragInfo.rightStartSize.unit}`);

    this.dragInfo.set(null);
  }

  private updateDividers(panels: readonly SplitterPanel[]) {
    this.dividers.update(divider => {
      if (divider.length === panels.length - 1) {
        return divider; // No need to update if the number of dividers matches the number of panels
      } else if (divider.length < panels.length - 1) {
        // Add missing dividers
        const newDividers = [...divider];
        for (let i = divider.length; i < panels.length - 1; i++) {
          newDividers.push(this.createDivider(i));
        }
        return newDividers;
      } else {
        // More dividers than needed, remove the excess
        divider.slice(panels.length - 1).forEach(divider => divider.destroy());
        return divider.slice(0, panels.length - 1);
      }
    });

    // Move dividers to the correct positions
    for (let i = 1; i < panels.length; i++) {
      this.moveDividerBefore(panels[i], this.dividers()[i - 1]);
    }
  }

  private createDivider(index: number) {
    const viewRef = this._viewContainer.createEmbeddedView(this._dividerTemplate(), { index });
    viewRef.detectChanges();
    return viewRef;
  }

  private moveDividerBefore(panel: SplitterPanel, divider: EmbeddedViewRef<unknown>) {
    const panelElement = panel.element.nativeElement;
    divider.rootNodes.forEach(node => {
      if (node instanceof HTMLElement) {
        panelElement.parentElement?.insertBefore(node, panelElement);
      }
    });
  }

  private calculateGridTemplateSizes() {
    const panels = this.orderedPanels();
    const dividerSizes = this._dividerSizes();

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
  }

  // #region state
  private computeState(previousState: SplitterState | null) {
    const data = this.stateData();
    const state: SplitterState = {
      layout: data.includes('layout') ? this.layout() : undefined,
      panelOrder: data.includes('panelOrder') ? this.panelOrder() : undefined,
      panelSizes: data.includes('panelSizes')
        ? this.panels().reduce(
            (acc, panel, index) => {
              acc[panel.name() || `ngn-panel-${index}`] = panel.size();
              return acc;
            },
            { ...previousState?.panelSizes }
          )
        : undefined,
    };

    this.stateSaving.emit(state);

    return state;
  }

  private onStateLoad(state: SplitterState | null) {
    if (state) {
      this.ensureValidateState(state);
      this.stateLoading.emit(state);
      this.applyFromState(state);
    }
    return state;
  }

  private ensureValidateState(state: SplitterState): void {
    if (state.layout && state.layout !== 'horizontal' && state.layout !== 'vertical') {
      Logger.warn(`Invalid layout in saved splitter state.`, { state });
      delete state.layout;
    }

    if (
      state.panelOrder &&
      (!Array.isArray(state.panelOrder) || state.panelOrder.some(x => typeof x !== 'string'))
    ) {
      Logger.warn(`Invalid panelOrder in saved splitter state.`, { state });
      delete state.panelOrder;
    }

    if (
      state.panelSizes &&
      (typeof state.panelSizes !== 'object' ||
        state.panelSizes === null ||
        Object.values(state.panelSizes).some(x => !isSplitterPanelSize(x)))
    ) {
      Logger.warn(`Invalid panelSizes in saved splitter state.`, { state });
      delete state.panelSizes;
    }
  }

  private applyFromState(state: SplitterState) {
    if (state.layout && this.stateData().includes('layout')) {
      this.layout.set(state.layout);
    }
    if (state.panelOrder && this.stateData().includes('panelOrder')) {
      this.panelOrder.set(state.panelOrder);
    }
    if (state.panelSizes && this.stateData().includes('panelSizes')) {
      const panels = this.panels();
      for (let i = 0; i < panels.length; i++) {
        const panelName = panels[i].name() || `ngn-panel-${i}`;
        if (panelName in state.panelSizes) {
          panels[i].size.set(state.panelSizes[panelName]);
        }
      }
    }
  }
  // #endregion
}
