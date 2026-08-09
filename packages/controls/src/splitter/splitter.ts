import {
  afterRenderEffect,
  Component,
  computed,
  contentChildren,
  EmbeddedViewRef,
  inject,
  input,
  model,
  type OnDestroy,
  output,
  runInInjectionContext,
  signal,
  TemplateRef,
  untracked,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { elementSizeSignal, NGN_CONFIG, AwdTemplate, templateTypeFn } from '@awdlab/jig/api/ng';
import { AwdBase, provideSelf, AwdPt } from '@awdlab/jig/base';
import { I18n } from '@awdlab/jig/i18n';
import { Logger, AwdError } from '@awdlab/jig/utils';
import { type AwdStateStorage, registerState } from '@awdlab/jig/utils-ng';
import { splitterControlTemplate } from '@awdlab/jig-themes/templates/splitter';

import { AwdSplitterPanel } from './panel/splitter-panel';
import { DefaultSplitterCalculator, type SplitterCalculatorType } from './splitter-calculator';
import { isSplitterPanelSize } from './utils';

import type { SplitterLayout, SplitterResizeMode, SplitterState, SplitterStateData } from './types';

/**
 * @category control
 */
@Component({
  selector: 'jig-splitter',
  templateUrl: './splitter.html',
  imports: [AwdPt, AwdTemplate],
  providers: [provideSelf(AwdSplitter)],
  host: {
    role: 'region',
    '[style.grid-template-columns]': `layout() === 'horizontal' ? calculator().gridTemplateSizes() : null`,
    '[style.grid-template-rows]': `layout() === 'vertical' ? calculator().gridTemplateSizes() : null`,
    '[style.grid-template-areas]': 'calculator().gridTemplateAreas()',
    '[style.max-width]': `layout() === 'horizontal' ? calculator().maxSize() : null`,
    '[style.max-height]': `layout() === 'vertical' ? calculator().maxSize() : null`,
    '[style.min-width]': `layout() === 'horizontal' ? calculator().minSize() : null`,
    '[style.min-height]': `layout() === 'vertical' ? calculator().minSize() : null`,
  },
})
export class AwdSplitter extends AwdBase<'splitter'> implements OnDestroy {
  private readonly _viewContainer = inject(ViewContainerRef);
  private readonly _config = inject(NGN_CONFIG);
  protected readonly theme = this.injectThemeTemplate(splitterControlTemplate, {
    root: true,
    dragging: () => this.isDragging(),
    horizontal: () => this.layout() === 'horizontal',
    vertical: () => this.layout() === 'vertical',
  });
  protected readonly translations = inject(I18n).translations;

  /**
   * The layout of the splitter.
   */
  public readonly layout = model.required<SplitterLayout>();
  /**
   * A array of panel names that defines the order of panels.
   * If nullish, the order is determined by the order the panels are defined in the template.
   */
  public readonly panelOrder = model<string[] | null>();
  /**
   * The storage to use for saving the splitter state.
   * @default `session`
   */
  public readonly stateStorage = input<AwdStateStorage>(
    this._config.defaults.splitter.stateStorage
  );
  /**
   * The key to use for saving the splitter state.
   * If nullish, the state will not be saved.
   */
  public readonly stateKey = input<string | null>();
  /**
   * The type of data to save in the splitter state.
   * @default `['layout', 'panelOrder', 'panelSizes']`
   */
  public readonly stateData = input<readonly SplitterStateData[]>([
    'layout',
    'panelOrder',
    'panelSizes',
  ]);
  /**
   * The type of calculator to use for the splitter.
   * @default `DefaultSplitterCalculator`
   */
  public readonly calculatorType = input<SplitterCalculatorType>(DefaultSplitterCalculator);
  /**
   * The resize distribution mode for the splitter.
   * - `'adjacent'`: Only the panels adjacent to the divider are resized.
   * - `'proportional'`: The deficit is distributed proportionally across all panels on the other side.
   * @default adjacent
   */
  public readonly resizeMode = input<SplitterResizeMode>('adjacent');
  /**
   * Whether to lock affected panels to fixed `px` values after a resize completes.
   * When `true`, panels whose size changed are converted from their original unit to `px`.
   * When `false`, panels keep their original units (`fr`, `px`).
   * @default false
   */
  public readonly lockSizes = input<boolean>(false);
  /**
   * The step size for moving the dividers using the keyboard.
   * This can be a pixel value (e.g., '5px') or a percentage value (e.g., '5%').
   * If a percentage is used, it will be calculated based on the size of the splitter element.
   * @default '5px'
   */
  public readonly step = input<`${number}${'%' | 'px'}`>('5px');

  /**
   * Event emitted when the splitter state is being saved.
   * This can be used to modify the state before it is saved.
   */
  public readonly stateSaving = output<SplitterState>();
  /**
   * Event emitted when the splitter state is loaded.
   * This can be used to modify the state before it is applied or to perform actions based on the loaded state.
   */
  public readonly stateLoading = output<SplitterState>();

  protected readonly dividerTemplateType = templateTypeFn<never, { index: number }>();
  private readonly _dividerTemplate =
    viewChild.required<TemplateRef<typeof this.dividerTemplateType>>('defaultDividerTemplate');

  /**
   * The current dividers in the splitter.
   */
  public readonly dividers = signal<EmbeddedViewRef<typeof this.dividerTemplateType>[]>([]);
  /**
   * The current panels in the splitter.
   */
  public readonly panels = contentChildren(AwdSplitterPanel);
  /**
   * The current size of the splitter element.
   */
  public readonly elementSize = elementSizeSignal(this.element);

  /**
   * A value indicating whether the splitter is currently being dragged.
   */
  public readonly isDragging = computed(() => this.calculator().dragContext() !== null);

  protected readonly calculator = computed(() => {
    const calculatorType = this.calculatorType();
    return untracked(() => runInInjectionContext(this.injector, () => new calculatorType(this)));
  });

  constructor() {
    super();

    afterRenderEffect(() => {
      const panels = this.panels();
      this.updateDividers(panels);
    });

    // Measure divider positions in the after-render phase (post-layout) and cache
    // them in a signal. Reading DOM offsets directly in the template binding causes
    // NG0100, since the grid sizes are applied in the same CD cycle and the reflow
    // settles the measured value between the CD and verify passes.
    afterRenderEffect(() => {
      const values = this.measureDividerValues();
      untracked(() => {
        const prev = this._dividerValues();
        if (values.length !== prev.length || values.some((v, i) => v !== prev[i])) {
          this._dividerValues.set(values);
        }
      });
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

  protected onHandlePointerDown(index: number, event: PointerEvent) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      throw new Error('Event target is not an HTMLElement');
    }
    // Make sure the element is stable before capturing the pointer
    requestAnimationFrame(() => {
      try {
        target.setPointerCapture(event.pointerId);
      } catch {
        // Ignore errors if the element is not capable of capturing the pointer
      }
    });

    this.calculator().startDrag(index, event);
  }

  protected onHandlePointerMove(index: number, event: PointerEvent) {
    this.calculator().drag(index, event);
  }

  protected onHandlePointerUp(index: number, event: PointerEvent) {
    this.calculator().endDrag(index, event, false);
  }

  protected onHandlePointerCancel(index: number, event: PointerEvent) {
    this.calculator().endDrag(index, event, true);
  }

  protected onHandleKeyDown(index: number, event: KeyboardEvent) {
    if (
      (event.key === 'ArrowLeft' && this.layout() === 'horizontal') ||
      (event.key === 'ArrowUp' && this.layout() === 'vertical')
    ) {
      this.calculator().moveDivider(index, -this.getStepInPx());
      event.preventDefault(); // Prevent default scrolling behavior
    } else if (
      (event.key === 'ArrowRight' && this.layout() === 'horizontal') ||
      (event.key === 'ArrowDown' && this.layout() === 'vertical')
    ) {
      this.calculator().moveDivider(index, this.getStepInPx());
      event.preventDefault(); // Prevent default scrolling behavior
    } else if (event.key === 'Home') {
      this.calculator().moveDivider(index, Number.NEGATIVE_INFINITY);
      event.preventDefault(); // Prevent default scrolling behavior
    } else if (event.key === 'End') {
      this.calculator().moveDivider(index, Number.POSITIVE_INFINITY);
      event.preventDefault(); // Prevent default scrolling behavior
    }
  }

  private updateDividers(panels: readonly AwdSplitterPanel[]) {
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

    // Move dividers to the correct positions (skip first panel — no divider before it)
    for (let i = 1; i < panels.length; i++) {
      const panel = panels[i]!;
      const divider = this.dividers()[i - 1];
      if (!divider) {
        throw new AwdError('AwdSplitter', `Divider is missing for panel at index ${i}`);
      }
      this.moveDividerBefore(panel, divider);
    }
  }

  private createDivider(index: number) {
    const viewRef = this._viewContainer.createEmbeddedView(this._dividerTemplate(), { index });
    viewRef.detectChanges();
    return viewRef;
  }

  private moveDividerBefore(panel: AwdSplitterPanel, divider: EmbeddedViewRef<unknown>) {
    const panelElement = panel.element.nativeElement;
    divider.rootNodes.forEach(node => {
      if (node instanceof HTMLElement) {
        panelElement.parentElement?.insertBefore(node, panelElement);
      }
    });
  }

  private computeState(previousState: SplitterState | null) {
    const data = this.stateData();
    const state: SplitterState = {
      layout: data.includes('layout') ? this.layout() : undefined,
      panelOrder: data.includes('panelOrder') ? this.panelOrder() : undefined,
      panelSizes: data.includes('panelSizes')
        ? this.panels().reduce(
            (acc, panel, index) => {
              acc[panel.name() || `jig-panel-${index}`] = panel.size();
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
      this.ensureValidState(state);
      this.stateLoading.emit(state);
      this.applyFromState(state);
    }
    return state;
  }

  private ensureValidState(state: SplitterState): void {
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
        const panelName = panels[i]?.name() || `jig-panel-${i}`;
        if (panelName in state.panelSizes) {
          const panelSize = state.panelSizes[panelName];
          if (!panelSize) {
            continue;
          }
          panels[i]?.size.set(panelSize);
        }
      }
    }
  }

  /** Cached divider positions (percentage) measured post-layout; see the after-render effect in the constructor. */
  private readonly _dividerValues = signal<readonly number[]>([]);

  /**
   * The divider's current position as a percentage (0–100) of the total panel
   * content size, used for `aria-valuenow` on the `role="separator"` handle.
   * Reads the cached value measured in the after-render phase.
   */
  protected dividerValueNow(index: number): number {
    return this._dividerValues()[index] ?? 0;
  }

  /**
   * Measures each divider's position as a percentage (0–100) of the total panel
   * content size. Reads `gridTemplateSizes()`, `elementSize()` and `dragContext()`
   * as reactive triggers, then measures the rendered panel sizes.
   */
  private measureDividerValues(): number[] {
    // ponytail: DOM-offset heuristic; one CD-frame lag during drag is fine for
    // an aria value. Swap for an engine-reported px signal if exactness matters.
    const calculator = this.calculator();
    calculator.gridTemplateSizes(); // reactive trigger
    calculator.dragContext(); // reactive trigger (live update during drag)
    this.elementSize(); // reactive trigger (container resize)
    const panels = calculator.orderedPanels();
    const horizontal = this.layout() === 'horizontal';
    const sizes = panels.map(panel => {
      const el = panel.element.nativeElement;
      return horizontal ? el.offsetWidth : el.offsetHeight;
    });
    const total = sizes.reduce((a, b) => a + b, 0);
    if (total <= 0) return [];
    // One value per divider: cumulative size up to and including panel i.
    const values: number[] = [];
    let before = 0;
    for (let i = 0; i < panels.length - 1; i++) {
      before += sizes[i]!;
      values.push(Math.round((before / total) * 100));
    }
    return values;
  }

  private getStepInPx(): number {
    const step = this.step();
    if (step.endsWith('px')) {
      return parseFloat(step.slice(0, -2));
    } else if (step.endsWith('%')) {
      const size =
        this.layout() === 'horizontal' ? this.elementSize().width : this.elementSize().height;
      return (parseFloat(step.slice(0, -1)) / 100) * size;
    } else {
      Logger.warn(`Invalid step value: ${step}.`);
      return 10; // Default step in pixels
    }
  }
}
