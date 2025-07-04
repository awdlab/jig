import { NgClass } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  contentChild,
  contentChildren,
  EmbeddedViewRef,
  HostBinding,
  inject,
  input,
  OnDestroy,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { BaseDirective } from '@ngneers/controls/base';

import { SplitterPanel } from './panel/splitter-panel';

@Component({
  selector: 'ngn-splitter',
  templateUrl: './splitter.html',
  styleUrls: ['./splitter.scss'], // TODO: refactor into theme
  encapsulation: ViewEncapsulation.None,
  imports: [NgClass],
  host: {
    role: 'region',
  },
})
export class Splitter extends BaseDirective implements OnDestroy {
  private readonly viewContainer = inject(ViewContainerRef);

  private readonly _defaultDividerTemplate =
    viewChild.required<TemplateRef<undefined>>('defaultDividerTemplate');
  private readonly _userDividerTemplate = contentChild<TemplateRef<undefined>>('divider');
  public readonly templateDivider = input<TemplateRef<undefined> | null>(null);
  protected readonly dividerTemplate = computed(
    () => this._userDividerTemplate() ?? this.templateDivider() ?? this._defaultDividerTemplate()
  );

  private readonly hostClass = computed(() => `ngn-splitter ngn-splitter-${this.direction()}`);
  @HostBinding('class')
  private get hostClassName(): string {
    return this.hostClass();
  }

  private readonly dividers: EmbeddedViewRef<undefined>[] = [];

  public readonly panels = contentChildren(SplitterPanel);

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
    this.dividers.forEach(divider => divider.destroy());
    this.dividers.length = 0;
  }

  private updateDividers(panels: readonly SplitterPanel[]) {
    // Remove overflow dividers
    while (this.dividers.length > panels.length - 1) {
      const divider = this.dividers.pop();
      divider?.destroy();
    }

    // Add missing dividers and move them between the panels
    for (let i = 1; i < panels.length; i++) {
      const divider = this.getDivider(i - 1);
      this.moveDividerBefore(panels[i], divider);
    }
  }

  private getDivider(index: number): EmbeddedViewRef<undefined> {
    while (index >= this.dividers.length) {
      const viewRef = this.viewContainer.createEmbeddedView(this.dividerTemplate(), undefined);
      viewRef.detectChanges();
      this.dividers.push(viewRef);
    }
    return this.dividers[index];
  }

  private moveDividerBefore(panel: SplitterPanel, divider: EmbeddedViewRef<undefined>) {
    const panelElement = panel.element.nativeElement;
    divider.rootNodes.forEach(node => {
      if (node instanceof HTMLElement) {
        panelElement.parentElement?.insertBefore(node, panelElement);
      }
    });
  }
}
