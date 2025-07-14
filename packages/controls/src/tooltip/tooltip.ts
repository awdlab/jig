import { NgClass } from '@angular/common';
import {
  Component,
  ComponentRef,
  computed,
  Directive,
  effect,
  inject,
  input,
  OnDestroy,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { Placement } from '@floating-ui/dom';
import {
  autoPositionElement,
  AutoPositioningHandle,
  injectThemeTemplate,
  PositioningSizeConstraints,
} from '@ngneers/controls/api';
import { NgnBase } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { computedWithPrevious } from '@ngneers/controls/utils';
import { tooltipControlTemplate } from '@ngneers/controls-themes/templates/tooltip';

@Directive({
  selector: '[ngnTooltip]',
  exportAs: 'ngnTooltip',
})
export class NgnTooltip extends NgnBase implements OnDestroy {
  private readonly _viewContainerRef = inject(ViewContainerRef);
  private _tooltip?: ComponentRef<TooltipComponent>;

  public readonly content = input<TemplateRef<unknown> | string | null | undefined>(undefined, {
    alias: 'ngnTooltip',
  });
  public readonly size = input<PositioningSizeConstraints | null | undefined>(undefined, {
    alias: 'ngnTooltipSize',
  });
  public readonly placement = input<Placement>('bottom', {
    alias: 'ngnTooltipPlacement',
  });

  constructor() {
    super();
    this.element.nativeElement.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.element.nativeElement.addEventListener('mouseleave', this.onMouseLeave.bind(this));

    effect(() => {
      if (this._tooltip) this.updateContent(this._tooltip);
    });
    effect(() => {
      if (this._tooltip) this._tooltip.setInput('size', this.size());
    });
    effect(() => {
      if (this._tooltip) this._tooltip.setInput('placement', this.placement());
    });
  }

  public ngOnDestroy(): void {
    this.element.nativeElement.removeEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.element.nativeElement.removeEventListener('mouseleave', this.onMouseLeave.bind(this));
    this._tooltip?.destroy();
    this._tooltip = undefined;
  }

  protected onMouseEnter(): void {
    if (this._tooltip) {
      this._tooltip.instance.show();
    } else {
      const tooltip = this.getTooltip();
      requestAnimationFrame(() => tooltip.show());
    }
  }

  protected onMouseLeave(): void {
    this._tooltip?.instance.hide();
  }

  private getTooltip(): TooltipComponent {
    if (!this._tooltip) {
      this._tooltip = this._viewContainerRef.createComponent(TooltipComponent);
      this._tooltip.setInput('anchor', this.element.nativeElement);
      this._tooltip.setInput('size', this.size());
      this._tooltip.setInput('placement', this.placement());
      this.updateContent(this._tooltip);
    }
    return this._tooltip.instance;
  }

  private updateContent(tooltip: ComponentRef<TooltipComponent>) {
    const content = this.content();
    if (content instanceof TemplateRef) {
      tooltip.setInput('text', null);
      tooltip.setInput('content', content);
    } else {
      tooltip.setInput('text', content);
      tooltip.setInput('content', null);
    }
  }
}

@Component({
  selector: 'ngn-tooltip',
  templateUrl: './tooltip.html',
  imports: [NgClass, NgnDefer],
  host: {
    '[class]': `theme.class()`,
    '[attr.popover]': `''`,
    '(toggle)': 'onToggle($event)',
  },
})
export class TooltipComponent extends NgnBase {
  protected readonly theme = injectThemeTemplate(tooltipControlTemplate);

  public readonly anchor = input.required<HTMLElement>();
  public readonly text = input<string | null>();
  public readonly content = input<TemplateRef<unknown>>();
  public readonly size = input<PositioningSizeConstraints | null>();
  public readonly placement = input<Placement>('bottom');

  private readonly _isOpen = signal(false);
  protected readonly isOpen = this._isOpen.asReadonly();

  private readonly _defaultContentTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultContentTemplate');
  protected readonly contentTemplate = computed(
    () => this.content() ?? this._defaultContentTemplate()
  );

  private readonly _autoPos = computedWithPrevious<AutoPositioningHandle | undefined>(prev => {
    prev?.stop();
    const element = this.element.nativeElement;
    if (!element) {
      return undefined;
    }
    return autoPositionElement(this.anchor(), element, {
      injector: this.injector,
      stopped: true,
      resize: false,
      sizeConstraints: this.size() ?? undefined,
      placement: this.placement(),
    });
  });

  public show() {
    this.element.nativeElement.showPopover();
  }

  public hide() {
    this.element.nativeElement.hidePopover();
  }

  protected onToggle(event: Event) {
    const evt = event as ToggleEvent;
    if (evt.newState === 'closed') {
      this._isOpen.set(false);
      this._autoPos()?.stop();
    } else {
      this._isOpen.set(true);
      this._autoPos()?.start();
    }
  }
}
