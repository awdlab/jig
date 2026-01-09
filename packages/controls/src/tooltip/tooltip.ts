import { NgClass } from '@angular/common';
import {
  Component,
  ComponentRef,
  computed,
  Directive,
  DOCUMENT,
  effect,
  inject,
  input,
  OnDestroy,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Placement } from '@floating-ui/dom';
import {
  abortSignalOnDestroy,
  autoPositionElement,
  AutoPositioningHandle,
  NGN_CONFIG,
  PositioningSizeConstraints,
  splitPlacement,
  TooltipOptions,
} from '@ngneers/controls/api/ng';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { getTimeSpanMilliseconds, notNullish, TimeSpan } from '@ngneers/controls/utils';
import { computedWithPrevious, generateElementId } from '@ngneers/controls/utils-ng';
import { tooltipControlTemplate } from '@ngneers/controls-themes/templates/tooltip';

import {
  relativeAnchorElementPosition,
  RelativeAnchorElementPositionData,
} from './relative-anchor-element-position';

/**
 * @category control
 */
@Directive({
  selector: '[ngnTooltip]',
  exportAs: 'ngnTooltip',
  providers: [provideSelf(NgnTooltip)],
})
export class NgnTooltip extends NgnBase<'tooltip'> implements OnDestroy {
  protected readonly theme = null;
  private readonly _viewContainerRef = inject(ViewContainerRef);
  private readonly _config = inject(NGN_CONFIG);
  private readonly _tooltip = signal<ComponentRef<TooltipComponent> | null>(null);

  /**
   * The content of the tooltip, can be a string or a TemplateRef.
   * If the value is falsy, the tooltip will not be shown.
   * @alias ngnTooltip
   */
  public readonly content = input<TemplateRef<unknown> | string | null | undefined>(null, {
    alias: 'ngnTooltip',
  });
  /**
   * The CSS class to apply to the tooltip.
   * This can be used to apply custom styles to the tooltip.
   * @alias ngnTooltipStyleClass
   */
  public readonly styleClass = input<string | null | undefined>(null, {
    alias: 'ngnTooltipStyleClass',
  });
  /**
   * If set to `true`, the tooltip will only be shown if the anchor element is truncated. `""` is equivalent to `true`.
   * @alias ngnTooltipShowOnlyIfTruncated
   * @default false
   */
  public readonly showOnlyIfTruncated = input<boolean | ''>(false, {
    alias: 'ngnTooltipShowOnlyIfTruncated',
  });
  /**
   * The size constraints for the tooltip.
   * This can be used to limit the width and height of the tooltip.
   * If not provided, the tooltip is only constrained by the size of the screen.
   * @alias ngnTooltipSize
   */
  public readonly size = input<PositioningSizeConstraints | null | undefined>(null, {
    alias: 'ngnTooltipSize',
  });

  /**
   * The options for the tooltip.
   * This is a shorthand for setting multiple options at once.
   * The individual options take precedence over the options set here.
   * @alias ngnTooltipOptions
   */
  public readonly options = input<Partial<TooltipOptions> | null | undefined>(null, {
    alias: 'ngnTooltipOptions',
  });
  /**
   * The placement of the tooltip relative to the anchor element.
   * @alias ngnTooltipPlacement
   * @default 'bottom'
   */
  public readonly placement = input<Placement | null | undefined>(null, {
    alias: 'ngnTooltipPlacement',
  });
  /**
   * The offset in Pixels of the tooltip from the anchor element.
   * @alias ngnTooltipOffset
   * @default 4
   */
  public readonly offset = input<number | null | undefined>(null, {
    alias: 'ngnTooltipOffset',
  });
  /**
   * The delay before the tooltip is shown. If a number is provided, it is interpreted as milliseconds.
   * @alias ngnTooltipShowDelay
   * @default '0.5s'
   */
  public readonly showDelay = input<TimeSpan | null | undefined>(null, {
    alias: 'ngnTooltipShowDelay',
  });
  /**
   * The delay before the tooltip is hidden. If a number is provided, it is interpreted as milliseconds.
   * @alias ngnTooltipHideDelay
   * @default '0.1s'
   */
  public readonly hideDelay = input<TimeSpan | null | undefined>(null, {
    alias: 'ngnTooltipHideDelay',
  });
  /**
   * Whether to show an arrow pointing to the anchor element. `""` is equivalent to `true`.
   * @alias ngnTooltipShowArrow
   * @default true
   */
  public readonly showArrow = input<boolean | '' | null | undefined>(null, {
    alias: 'ngnTooltipShowArrow',
  });
  /**
   * Shows the tooltip on hover.
   * @alias ngnTooltipShowOnHover
   * @default true
   */
  public readonly showOnHover = input<boolean | '' | null | undefined>(null, {
    alias: 'ngnTooltipShowOnHover',
  });
  /**
   * Shows the tooltip on focus.
   * @alias ngnTooltipShowOnFocus
   * @default true
   */
  public readonly showOnFocus = input<boolean | '' | null | undefined>(null, {
    alias: 'ngnTooltipShowOnFocus',
  });
  /**
   * Hides the tooltip (without delay) when the mouse hovers over the tooltip.
   * @alias ngnTooltipHideOnTooltipHover
   * @default false
   */
  public readonly hideOnTooltipHover = input<boolean | '' | null | undefined>(null, {
    alias: 'ngnTooltipHideOnTooltipHover',
  });
  /**
   * Hides the tooltip (without delay) when the user clicks on the tooltip.
   * @alias ngnTooltipHideOnClick
   * @default true
   */
  public readonly hideOnClick = input<boolean | '' | null | undefined>(null, {
    alias: 'ngnTooltipHideOnClick',
  });

  public readonly effectiveOptions = computed<TooltipOptions>(() => {
    const defaults = this._config.defaults.tooltip;
    return {
      placement: this.placement() ?? this.options()?.placement ?? defaults.placement,
      offset: this.offset() ?? this.options()?.offset ?? defaults.offset,
      showDelay: this.showDelay() ?? this.options()?.showDelay ?? defaults.showDelay,
      hideDelay: this.hideDelay() ?? this.options()?.hideDelay ?? defaults.hideDelay,
      showArrow: (this.showArrow() ?? this.options()?.showArrow ?? defaults.showArrow) !== false,
      showOnHover:
        (this.showOnHover() ?? this.options()?.showOnHover ?? defaults.showOnHover) !== false,
      showOnFocus:
        (this.showOnFocus() ?? this.options()?.showOnFocus ?? defaults.showOnFocus) !== false,
      hideOnTooltipHover:
        (this.hideOnTooltipHover() ??
          this.options()?.hideOnTooltipHover ??
          defaults.hideOnTooltipHover) !== false,
      hideOnClick:
        (this.hideOnClick() ?? this.options()?.hideOnClick ?? defaults.hideOnClick) !== false,
    };
  });

  public readonly tooltip = computed(() => this._tooltip()?.instance);

  constructor() {
    super();

    const abortSignal = abortSignalOnDestroy();
    this.element.nativeElement.addEventListener('mouseenter', this.onMouseEnter.bind(this), {
      signal: abortSignal,
    });
    this.element.nativeElement.addEventListener('mouseleave', this.onMouseLeave.bind(this), {
      signal: abortSignal,
    });
    this.element.nativeElement.addEventListener('focus', this.onFocus.bind(this), {
      signal: abortSignal,
    });
    this.element.nativeElement.addEventListener('blur', this.onBlur.bind(this), {
      signal: abortSignal,
    });

    effect(() => {
      const tooltip = this._tooltip();
      if (tooltip) this.updateContent(tooltip);
    });
    effect(() => this._tooltip()?.setInput('styleClass', this.styleClass()));
    effect(() => this._tooltip()?.setInput('showOnlyIfTruncated', this.showOnlyIfTruncated()));
    effect(() => this._tooltip()?.setInput('size', this.size()));
    effect(() => this._tooltip()?.setInput('options', this.effectiveOptions()));
  }

  public ngOnDestroy(): void {
    this._tooltip()?.destroy();
    this._tooltip.set(null);
  }

  public show(): void {
    const tooltip = this._tooltip();
    if (tooltip) {
      tooltip.instance.show();
    } else {
      const tooltip = this.getTooltip();
      if (tooltip) {
        requestAnimationFrame(() => tooltip.show());
      }
    }
  }

  public hide(): void {
    this._tooltip()?.instance.hide();
  }

  protected onMouseEnter() {
    if (this.effectiveOptions().showOnHover) {
      this.show();
    }
  }

  protected onMouseLeave() {
    if (this.effectiveOptions().showOnHover) {
      this.hide();
    }
  }

  protected onFocus() {
    if (this.effectiveOptions().showOnFocus) {
      this.show();
    }
  }

  protected onBlur() {
    if (this.effectiveOptions().showOnFocus) {
      this.hide();
    }
  }

  private getTooltip(): TooltipComponent | undefined {
    let tooltip = this._tooltip();
    if (!tooltip && this.content()) {
      tooltip = this._viewContainerRef.createComponent(TooltipComponent);
      tooltip.setInput('anchor', this.element.nativeElement);
      this.updateContent(tooltip);
      tooltip.setInput('styleClass', this.styleClass());
      tooltip.setInput('showOnlyIfTruncated', this.showOnlyIfTruncated());
      tooltip.setInput('size', this.size());
      tooltip.setInput('options', this.effectiveOptions());
      this._tooltip.set(tooltip);
    }
    return tooltip?.instance;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-tooltip',
  templateUrl: './tooltip.html',
  imports: [NgClass, NgnDefer],
  providers: [provideSelf(TooltipComponent)],
  host: {
    '[class]': `[theme.class(), isClosing() ? theme.class('closing') : '', options().showArrow !== false ? theme.class('with-arrow') : '', positionClass(), styleClass() ?? ''].join(' ')`,
    '[style.--anchor-start]': `toPixels(relativeAnchorElementPosition()?.start)`,
    '[style.--anchor-center]': `toPixels(relativeAnchorElementPosition()?.center)`,
    '[style.--anchor-end]': `toPixels(relativeAnchorElementPosition()?.end)`,
    '[style.left]': `toPixels(position().x)`,
    '[style.top]': `toPixels(position().y)`,
    '[attr.popover]': `'hint'`,
    '[attr.id]': `id`,
    '[attr.role]': `'tooltip'`,
    '(toggle)': 'onToggle($event)',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(click)': 'onClick($event)',
  },
})
export class TooltipComponent extends NgnBase<'tooltip'> {
  private _showHideTimeout?: ReturnType<typeof setTimeout>;
  protected readonly theme = this.injectThemeTemplate(tooltipControlTemplate);
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
   * The CSS class to apply to the tooltip.
   * This can be used to apply custom styles to the tooltip.
   */
  public readonly styleClass = input<string | null>();
  /**
   * If set to `true`, the tooltip will only be shown if the anchor element is truncated. `""` is equivalent to `true`.
   * @default `false`
   */
  public readonly showOnlyIfTruncated = input<boolean | ''>(false);
  /**
   * The size constraints for the tooltip.
   * This can be used to limit the width and height of the tooltip.
   * If not provided, the tooltip is only constrained by the size of the screen.
   */
  public readonly size = input<PositioningSizeConstraints | null>();
  /**
   * The options for the tooltip.
   *
   */
  public readonly options = input<TooltipOptions>(this._config.defaults.tooltip);

  protected readonly showDelayMs = computed(() =>
    getTimeSpanMilliseconds(this.options().showDelay)
  );
  protected readonly hideDelayMs = computed(() =>
    getTimeSpanMilliseconds(this.options().hideDelay)
  );

  protected readonly position = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  protected readonly positionClass = signal<string>('');
  protected readonly relativeAnchorElementPosition = signal<
    RelativeAnchorElementPositionData | undefined
  >(undefined);

  private readonly _isShown = signal(false);
  private readonly _isClosing = signal(false);

  public readonly id = generateElementId();
  public readonly isShown = this._isShown.asReadonly();
  public readonly isClosing = this._isClosing.asReadonly();

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
      placement: this.options().placement,
      offset: this.options().offset,
      middleware: [relativeAnchorElementPosition],
      disableSettingStyles: true,
      strategy: 'fixed',
      onPositionChange: ({ x, y, placement, middlewareData }) => {
        this.relativeAnchorElementPosition.set(middlewareData[relativeAnchorElementPosition.name]);
        this.position.set({ x, y });
        this.positionClass.set(
          splitPlacement(placement)
            .filter(notNullish)
            .map(x => this.theme.class(x))
            .join(' ')
        );
      },
    });
  });

  constructor() {
    super();
    const document = inject(DOCUMENT);
    const destroyAbortSignal = abortSignalOnDestroy();
    effect(() => {
      if (this.isShown() && !this.isClosing()) {
        document.addEventListener('keydown', this.onDocumentKeyDown.bind(this), {
          signal: destroyAbortSignal,
        });
      } else {
        document.removeEventListener('keydown', this.onDocumentKeyDown.bind(this));
      }
    });
    effect(() => {
      if (this.isShown()) {
        this._autoPos()?.start();
      } else {
        this._autoPos()?.stop();
      }
    });
  }

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

  protected onMouseEnter() {
    if (this.options().hideOnTooltipHover) {
      this.hide(true);
    } else {
      this.show(true);
    }
  }

  protected onMouseLeave() {
    this.hide();
  }

  protected onClick(event: PointerEvent) {
    if (this.options().hideOnClick) {
      this.hide(true);
    }
    event.stopPropagation();
  }

  protected onDocumentKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.hide(true);
      event.preventDefault();
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
    this.element.nativeElement.showPopover();
  }

  protected onHide() {
    this._isClosing.set(true);
    requestAnimationFrame(() => {
      Promise.all(this.element.nativeElement.getAnimations().map(a => a.finished))
        .then(() => this.element.nativeElement.hidePopover())
        .catch(() => {})
        .finally(() => this._isClosing.set(false));
    });
  }

  protected onToggle(event: Event) {
    const evt = event as ToggleEvent;
    if (evt.newState === 'closed') {
      this._isShown.set(false);
    } else {
      this._isShown.set(true);
    }
  }

  protected toPixels(value: number | undefined): string | undefined {
    return value !== undefined ? `${value}px` : undefined;
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
