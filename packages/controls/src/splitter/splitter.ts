import { NgClass } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  contentChildren,
  EmbeddedViewRef,
  inject,
  input,
  model,
  OnDestroy,
  output,
  runInInjectionContext,
  signal,
  TemplateRef,
  untracked,
  viewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  elementSizeSignal,
  NGN_CONFIG,
  NgnTemplate,
  templateTypeFn,
} from '@ngneers/controls/api/ng';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { I18n } from '@ngneers/controls/i18n';
import { Logger } from '@ngneers/controls/utils';
import { NgnStateStorage, registerState } from '@ngneers/controls/utils-ng';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';

import { NgnSplitterPanel } from './panel/splitter-panel';
import { DefaultSplitterCalculator, SplitterCalculatorType } from './splitter-calculator';
import { SplitterLayout, SplitterState, SplitterStateData } from './types';
import { isSplitterPanelSize } from './utils';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-splitter',
  templateUrl: './splitter.html',
  imports: [NgClass, NgnTemplate],
  providers: [provideSelf(NgnSplitter)],
  host: {
    role: 'region',
    '[class]': 'hostClass()',
    '[style.grid-template-columns]': `layout() === 'horizontal' ? calculator().gridTemplateSizes() : null`,
    '[style.grid-template-rows]': `layout() === 'vertical' ? calculator().gridTemplateSizes() : null`,
    '[style.grid-template-areas]': 'calculator().gridTemplateAreas()',
    '[style.max-width]': `layout() === 'horizontal' ? calculator().maxSize() : null`,
    '[style.max-height]': `layout() === 'vertical' ? calculator().maxSize() : null`,
    '[style.min-width]': `layout() === 'horizontal' ? calculator().minSize() : null`,
    '[style.min-height]': `layout() === 'vertical' ? calculator().minSize() : null`,
  },
})
export class NgnSplitter extends NgnBase<'splitter'> implements OnDestroy {
  private readonly _viewContainer = inject(ViewContainerRef);
  private readonly _config = inject(NGN_CONFIG);
  protected readonly theme = this.injectThemeTemplate(splitterControlTemplate);
  protected readonly translations = inject(I18n).translations;

  /**
   * The layout of the splitter.
   */
  public readonly layout = model.required<SplitterLayout>();
  /**
   * The CSS class(es) to apply to the divider elements.
   */
  public readonly dividerStyleClass = input<string | null>();
  /**
   * A array of panel names that defines the order of panels.
   * If nullish, the order is determined by the order the panels are defined in the template.
   */
  public readonly panelOrder = model<string[] | null>();
  /**
   * The storage to use for saving the splitter state.
   * @default `session`
   */
  public readonly stateStorage = input<NgnStateStorage>(
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
  public readonly panels = contentChildren(NgnSplitterPanel);
  /**
   * The current size of the splitter element.
   */
  public readonly elementSize = elementSizeSignal(this.element);

  protected readonly hostClass = computed(() => {
    return `${this.theme.class()} ${this.theme.class(this.layout())} ${this.isDragging() ? this.theme.class('dragging') : ''}`;
  });

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

  private updateDividers(panels: readonly NgnSplitterPanel[]) {
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

  private moveDividerBefore(panel: NgnSplitterPanel, divider: EmbeddedViewRef<unknown>) {
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
        const panelName = panels[i].name() || `ngn-panel-${i}`;
        if (panelName in state.panelSizes) {
          panels[i].size.set(state.panelSizes[panelName]);
        }
      }
    }
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
