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
  OnDestroy,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { injectThemeTemplate, NgnTemplate, templateTypeFn } from '@ngneers/controls/api';
import { BaseDirective } from '@ngneers/controls/base';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';

import { SplitterPanel } from './panel/splitter-panel';
import { SplitterPanelSize } from './types';
import { getSplitterPanelSizeUnit, getSplitterPanelSizeValue } from './utils';

type DragInfo = {
  dividerIndex: number;
  pointerId: number;
  startPosition: number;
  leftStartSize: SplitterPanelSize;
  rightStartSize: SplitterPanelSize;
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
  protected readonly theme = injectThemeTemplate(splitterControlTemplate);

  // Divider
  protected readonly dividerTemplateType = templateTypeFn<undefined, { index: number }>();
  private readonly _dividerTemplate =
    viewChild.required<TemplateRef<typeof this.dividerTemplateType>>('defaultDividerTemplate');
  public readonly dividers = signal<EmbeddedViewRef<typeof this.dividerTemplateType>[]>([]);
  private readonly _dividerSizes = computed(() =>
    this.dividers().map(d => {
      const el = d.rootNodes.find(x => x instanceof HTMLElement);
      return el ? (this.direction() === 'horizontal' ? el.offsetWidth : el.offsetHeight) : 0;
    })
  );

  // Panels
  public readonly panels = contentChildren(SplitterPanel);

  // Sizes
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

  // Host Classes
  private readonly _hostClass = computed(() => {
    return `${this.theme.class()} ${this.theme.class(this.direction())} ${this.isDragging() ? this.theme.class('dragging') : ''}`;
  });
  @HostBinding('class')
  protected get hostClass(): string {
    return this._hostClass();
  }

  // Host Styles
  private readonly _gridTemplateSizes = computed(() => this.calculateGridTemplateSizes());
  private readonly _gridTemplateColumns = computed(() =>
    this.direction() === 'horizontal' ? this._gridTemplateSizes() : null
  );
  private readonly _gridTemplateRows = computed(() =>
    this.direction() === 'vertical' ? this._gridTemplateSizes() : null
  );
  @HostBinding('style.grid-template-columns')
  protected get gridTemplateColumns(): string | null {
    return this._gridTemplateColumns();
  }
  @HostBinding('style.grid-template-rows')
  protected get gridTemplateRows(): string | null {
    return this._gridTemplateRows();
  }

  // Dragging
  public readonly dragInfo = signal<DragInfo | null>(null);
  public readonly isDragging = computed(() => this.dragInfo() !== null);

  // Inputs
  public readonly direction = input.required<'horizontal' | 'vertical'>();
  public readonly dividerStyleClass = input<string | null>();

  constructor() {
    super();
    afterRenderEffect(() => {
      const panels = this.panels();
      this.updateDividers(panels);
    });
  }

  public ngOnDestroy(): void {
    // Clean up dividers
    this.dividers().forEach(divider => divider.destroy());
    this.dividers.set([]);
  }

  protected onPointerDown(index: number, event: PointerEvent) {
    const panels = this.panels();
    if (index < 0 || index >= panels.length - 1) return;

    const leftPanel = panels[index];
    const rightPanel = panels[index + 1];

    this.dragInfo.set({
      dividerIndex: index,
      pointerId: event.pointerId,
      startPosition: this.direction() === 'horizontal' ? event.clientX : event.clientY,
      leftStartSize: leftPanel.size(),
      rightStartSize: rightPanel.size(),
      leftPanel,
      rightPanel,
    });

    if (!(event.target instanceof HTMLElement)) {
      throw new Error('Event target is not an HTMLElement');
    }
    event.target.setPointerCapture(event.pointerId);

    // Prevent default to avoid text selection
    event.preventDefault();
  }

  protected onPointerMove(index: number, event: PointerEvent) {
    const dragInfo = this.dragInfo();
    if (!dragInfo || dragInfo.dividerIndex !== index || dragInfo.pointerId !== event.pointerId)
      return;

    const leftSizeUnit = getSplitterPanelSizeUnit(dragInfo.leftStartSize);
    const leftSizeValue = getSplitterPanelSizeValue(dragInfo.leftStartSize);
    const rightSizeUnit = getSplitterPanelSizeUnit(dragInfo.rightStartSize);
    const rightSizeValue = getSplitterPanelSizeValue(dragInfo.rightStartSize);

    let controlSize: number;
    let pxDelta: number;
    if (this.direction() === 'horizontal') {
      controlSize = this.element.nativeElement.offsetWidth;
      pxDelta = event.clientX - dragInfo.startPosition;
    } else {
      controlSize = this.element.nativeElement.offsetHeight;
      pxDelta = event.clientY - dragInfo.startPosition;
    }

    let frDelta: number = 0;
    if (leftSizeUnit === 'fr' || rightSizeUnit === 'fr') {
      const frArea = controlSize - this._totalDividerSize() - this._totalPanelSizes().px;
      const frPerPx = this._totalPanelSizes().fr / frArea;
      frDelta = pxDelta * frPerPx;
    }

    if (leftSizeUnit === 'px') {
      dragInfo.leftPanel.size.set(`${leftSizeValue + pxDelta}px`);
    } else if (leftSizeUnit === 'fr') {
      dragInfo.leftPanel.size.set(`${leftSizeValue + frDelta}fr`);
    }

    if (rightSizeUnit === 'px') {
      dragInfo.rightPanel.size.set(`${rightSizeValue - pxDelta}px`);
    } else if (rightSizeUnit === 'fr') {
      dragInfo.rightPanel.size.set(`${rightSizeValue - frDelta}fr`);
    }
  }

  protected onPointerUp(index: number, event: PointerEvent) {
    const dragInfo = this.dragInfo();
    if (!dragInfo || dragInfo.dividerIndex !== index || dragInfo.pointerId !== event.pointerId)
      return;

    // TODO: Presist the new sizes of the panels

    this.dragInfo.set(null);
  }

  protected onPointerCancel(index: number, event: PointerEvent) {
    const dragInfo = this.dragInfo();
    if (!dragInfo || dragInfo.dividerIndex !== index || dragInfo.pointerId !== event.pointerId)
      return;

    // Reset the panels to their original sizes
    dragInfo.leftPanel.size.set(dragInfo.leftStartSize);
    dragInfo.rightPanel.size.set(dragInfo.rightStartSize);

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
    const panels = this.panels();
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
}
