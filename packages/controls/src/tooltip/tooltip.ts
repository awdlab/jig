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
  NGN_CONFIG,
  PositioningSizeConstraints,
  splitPlacement,
} from '@ngneers/controls/api/ng';
import { NgnBase } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { getTimeSpanMilliseconds, notNullish, TimeSpan } from '@ngneers/controls/utils';
import { computedWithPrevious } from '@ngneers/controls/utils-ng';
import { tooltipControlTemplate } from '@ngneers/controls-themes/templates/tooltip';

/**
 * @category control
 */
@Directive({
  selector: '[ngnTooltip]',
  exportAs: 'ngnTooltip',
})
export class NgnTooltip extends NgnBase implements OnDestroy {
  private readonly _viewContainerRef = inject(ViewContainerRef);
  private readonly _config = inject(NGN_CONFIG);
  private _tooltip?: ComponentRef<TooltipComponent>;

  /**
   * The content of the tooltip, can be a string or a TemplateRef.
   * If the value is falsy, the tooltip will not be shown.
   * @alias ngnTooltip
   */
  public readonly content = input<TemplateRef<unknown> | string | null | undefined>(undefined, {
    alias: 'ngnTooltip',
  });
  /**
   * The size constraints for the tooltip.
   * This can be used to limit the width and height of the tooltip.
   * If not provided, the tooltip is only constrained by the size of the screen.
   * @alias ngnTooltipSize
   */
  public readonly size = input<PositioningSizeConstraints | null | undefined>(undefined, {
    alias: 'ngnTooltipSize',
  });
  /**
   * The placement of the tooltip relative to the anchor element.
   * @alias ngnTooltipPlacement
   * @defaultValue `bottom`
   */
  public readonly placement = input<Placement>(this._config.defaults.tooltip.placement, {
    alias: 'ngnTooltipPlacement',
  });
  /**
   * The offset in Pixels of the tooltip from the anchor element.
   * @alias ngnTooltipOffset
   * @defaultValue `4`
   */
  public readonly offset = input<number>(this._config.defaults.tooltip.offset, {
    alias: 'ngnTooltipOffset',
  });
  /**
   * The delay before the tooltip is shown. If a number is provided, it is interpreted as milliseconds.
   * @alias ngnTooltipShowDelay
   * @defaultValue `"0.5s"`
   */
  public readonly showDelay = input<TimeSpan>(this._config.defaults.tooltip.showDelay, {
    alias: 'ngnTooltipShowDelay',
  });
  /**
   * The delay before the tooltip is hidden. If a number is provided, it is interpreted as milliseconds.
   * @alias ngnTooltipHideDelay
   * @defaultValue `"0.1s"`
   */
  public readonly hideDelay = input<TimeSpan>(this._config.defaults.tooltip.hideDelay, {
    alias: 'ngnTooltipHideDelay',
  });
  /**
   * If set to `true`, the tooltip will only be shown if the anchor element is truncated. `""` is equivalent to `true`.
   * @alias ngnTooltipShowOnlyIfTruncated
   * @defaultValue `false`
   */
  public readonly showOnlyIfTruncated = input<boolean | ''>(false, {
    alias: 'ngnTooltipShowOnlyIfTruncated',
  });
  /**
   * The CSS class to apply to the tooltip.
   * This can be used to apply custom styles to the tooltip.
   * @alias ngnTooltipStyleClass
   */
  public readonly styleClass = input<string | null | undefined>(undefined, {
    alias: 'ngnTooltipStyleClass',
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
    effect(() => {
      if (this._tooltip) this._tooltip.setInput('offset', this.offset());
    });
    effect(() => {
      if (this._tooltip) this._tooltip.setInput('showDelay', this.showDelay());
    });
    effect(() => {
      if (this._tooltip) this._tooltip.setInput('hideDelay', this.hideDelay());
    });
    effect(() => {
      if (this._tooltip) this._tooltip.setInput('showOnlyIfTruncated', this.showOnlyIfTruncated());
    });
    effect(() => {
      if (this._tooltip) this._tooltip.setInput('styleClass', this.styleClass());
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
      if (tooltip) {
        requestAnimationFrame(() => tooltip.show());
      }
    }
  }

  protected onMouseLeave(): void {
    this._tooltip?.instance.hide();
  }

  private getTooltip(): TooltipComponent | undefined {
    if (!this._tooltip && this.content()) {
      this._tooltip = this._viewContainerRef.createComponent(TooltipComponent);
      this._tooltip.setInput('anchor', this.element.nativeElement);
      this._tooltip.setInput('size', this.size());
      this._tooltip.setInput('placement', this.placement());
      this._tooltip.setInput('offset', this.offset());
      this._tooltip.setInput('showDelay', this.showDelay());
      this._tooltip.setInput('hideDelay', this.hideDelay());
      this._tooltip.setInput('showOnlyIfTruncated', this.showOnlyIfTruncated());
      this._tooltip.setInput('styleClass', this.styleClass());
      this.updateContent(this._tooltip);
    }
    return this._tooltip?.instance;
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
    '[class]': `[theme.class(), positionClass(), styleClass() ?? '']`,
    '[attr.popover]': `''`,
    '(toggle)': 'onToggle($event)',
    '(mouseenter)': 'show(true)',
    '(mouseleave)': 'hide()',
    '(click)': 'hide(true)',
  },
})
export class TooltipComponent extends NgnBase {
  private _showHideTimeout?: ReturnType<typeof setTimeout>;
  protected readonly theme = injectThemeTemplate(tooltipControlTemplate);
  private readonly _config = inject(NGN_CONFIG);

  /**
   * The anchor element to which the tooltip is attached.
   */
  public readonly anchor = input.required<HTMLElement>();
  /**
   * The text content of the tooltip.
   */
  public readonly text = input<string | null>();
  /**
   * The content template of the tooltip.
   */
  public readonly content = input<TemplateRef<unknown>>();
  /**
   * The size constraints for the tooltip.
   * This can be used to limit the width and height of the tooltip.
   * If not provided, the tooltip is only constrained by the size of the screen.
   */
  public readonly size = input<PositioningSizeConstraints | null>();
  /**
   * The placement of the tooltip relative to the anchor element.
   * @defaultValue `bottom`
   */
  public readonly placement = input<Placement>(this._config.defaults.tooltip.placement);
  /**
   * The offset in Pixels of the tooltip from the anchor element.
   * @defaultValue `4`
   */
  public readonly offset = input<number>(this._config.defaults.tooltip.offset);
  /**
   * The delay before the tooltip is shown. If a number is provided, it is interpreted as milliseconds.
   * @defaultValue `"0.5s"`
   */
  public readonly showDelay = input<TimeSpan>(this._config.defaults.tooltip.showDelay);
  /**
   * The delay before the tooltip is hidden. If a number is provided, it is interpreted as milliseconds.
   * @defaultValue `"0.1s"`
   */
  public readonly hideDelay = input<TimeSpan>(this._config.defaults.tooltip.hideDelay);
  /**
   * If set to `true`, the tooltip will only be shown if the anchor element is truncated. `""` is equivalent to `true`.
   * @defaultValue `false`
   */
  public readonly showOnlyIfTruncated = input<boolean | ''>(false);
  /**
   * The CSS class to apply to the tooltip.
   * This can be used to apply custom styles to the tooltip.
   */
  public readonly styleClass = input<string | null>();

  protected readonly showDelayMs = computed(() => getTimeSpanMilliseconds(this.showDelay()));
  protected readonly hideDelayMs = computed(() => getTimeSpanMilliseconds(this.hideDelay()));

  private readonly _isShown = signal(false);
  protected readonly isShown = this._isShown.asReadonly();
  protected readonly positionClass = signal<string>('');

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
      offset: this.offset(),
      strategy: 'fixed',
      onPositionChange: ({ placement }) =>
        this.positionClass.set(
          splitPlacement(placement)
            .filter(notNullish)
            .map(x => this.theme.class(x))
            .join(' ')
        ),
    });
  });

  public show(skipDelay = false) {
    clearTimeout(this._showHideTimeout);

    const delay = skipDelay ? 0 : this.showDelayMs();
    if (delay <= 0) {
      this.onShow();
    } else {
      this._showHideTimeout = setTimeout(() => this.onShow(), delay);
    }
  }

  public hide(skipDelay = false) {
    clearTimeout(this._showHideTimeout);

    const delay = skipDelay ? 0 : this.hideDelayMs();
    if (delay <= 0) {
      this.onHide();
    } else {
      this._showHideTimeout = setTimeout(() => this.onHide(), delay);
    }
  }

  protected onShow() {
    if (!this.content() && !this.text()) {
      return;
    }
    if (this.showOnlyIfTruncated() !== false && !isElementTruncated(this.anchor())) {
      return;
    }

    this._isShown.set(true);
    this._autoPos()?.start();
    this.element.nativeElement.showPopover();
  }

  protected onHide() {
    this.element.nativeElement.classList.toggle(this.theme.class('closing'), true);
    Promise.all(this.element.nativeElement.getAnimations().map(a => a.finished))
      .then(() => this.element.nativeElement.hidePopover())
      .catch(() => {})
      .finally(() =>
        this.element.nativeElement.classList.toggle(this.theme.class('closing'), false)
      );
  }

  protected onToggle(event: Event) {
    const evt = event as ToggleEvent;
    if (evt.newState === 'closed') {
      this._isShown.set(false);
      this._autoPos()?.stop();
    } else {
      this._isShown.set(true);
      this._autoPos()?.start();
    }
  }
}

function isElementTruncated(element: HTMLElement): boolean {
  return (
    element.clientWidth < element.scrollWidth || // horizontal overflow
    element.clientHeight < element.scrollHeight || // vertical overflow
    element.offsetWidth < element.scrollWidth || // single-line ellipsis
    element.offsetHeight < element.scrollHeight // multi-line ellipsis (line-clamp)
  );
}
