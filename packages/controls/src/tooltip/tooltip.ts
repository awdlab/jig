import {
  Component,
  ComponentRef,
  computed,
  Directive,
  DOCUMENT,
  effect,
  inject,
  input,
  type OnDestroy,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  afterRenderEffect,
} from '@angular/core';
import {
  autoPositionElement,
  type AutoPositioningHandle,
  domEventHandler,
  JIG_CONFIG,
  type PositioningSizeConstraints,
  roundByDpr,
  splitPlacement,
  type TooltipOptions,
} from '@awdlab/jig/api/ng';
import { JigBase, provideSelf, JigPt } from '@awdlab/jig/base';
import { JigDefer } from '@awdlab/jig/defer';
import { getTimeSpanMilliseconds, notNullish, type TimeSpan } from '@awdlab/jig/utils';
import { computedWithPrevious, generateElementId, OverlayLifecycle } from '@awdlab/jig/utils-ng';
import { tooltipControlTemplate } from '@awdlab/jig-themes/templates/tooltip';

import {
  relativeAnchorElementPosition,
  type RelativeAnchorElementPositionData,
} from './relative-anchor-element-position';

import type { Placement } from '@floating-ui/dom';

/**
 * @category control
 */
@Directive({
  selector: '[jigTooltip]',
  exportAs: 'jigTooltip',
  providers: [provideSelf(JigTooltip)],
})
export class JigTooltip extends JigBase<'tooltip'> implements OnDestroy {
  protected readonly theme = null;
  private readonly _viewContainerRef = inject(ViewContainerRef);
  private readonly _config = inject(JIG_CONFIG);
  private readonly _tooltip = signal<ComponentRef<TooltipComponent> | null>(null);

  /**
   * The content of the tooltip, can be a string or a TemplateRef.
   * If the value is falsy, the tooltip will not be shown.
   * @alias jigTooltip
   */
  public readonly content = input<TemplateRef<unknown> | string | null | undefined>(null, {
    alias: 'jigTooltip',
  });
  /**
   * If set to `true`, the tooltip will only be shown if the anchor element is truncated. `""` is equivalent to `true`.
   * @alias jigTooltipShowOnlyIfTruncated
   * @default false
   */
  public readonly showOnlyIfTruncated = input<boolean | ''>(false, {
    alias: 'jigTooltipShowOnlyIfTruncated',
  });
  /**
   * The size constraints for the tooltip.
   * This can be used to limit the width and height of the tooltip.
   * If not provided, the tooltip is only constrained by the size of the screen.
   * @alias jigTooltipSize
   */
  public readonly size = input<PositioningSizeConstraints | null | undefined>(null, {
    alias: 'jigTooltipSize',
  });

  /**
   * The options for the tooltip.
   * This is a shorthand for setting multiple options at once.
   * The individual options take precedence over the options set here.
   * @alias jigTooltipOptions
   */
  public readonly options = input<Partial<TooltipOptions> | null | undefined>(null, {
    alias: 'jigTooltipOptions',
  });
  /**
   * The placement of the tooltip relative to the anchor element.
   * @alias jigTooltipPlacement
   * @default 'bottom'
   */
  public readonly placement = input<Placement | null | undefined>(null, {
    alias: 'jigTooltipPlacement',
  });
  /**
   * The offset in Pixels of the tooltip from the anchor element.
   * @alias jigTooltipOffset
   * @default 4
   */
  public readonly offset = input<number | null | undefined>(null, {
    alias: 'jigTooltipOffset',
  });
  /**
   * The delay before the tooltip is shown. If a number is provided, it is interpreted as milliseconds.
   * @alias jigTooltipShowDelay
   * @default '0.5s'
   */
  public readonly showDelay = input<TimeSpan | null | undefined>(null, {
    alias: 'jigTooltipShowDelay',
  });
  /**
   * The delay before the tooltip is hidden. If a number is provided, it is interpreted as milliseconds.
   * @alias jigTooltipHideDelay
   * @default '0.1s'
   */
  public readonly hideDelay = input<TimeSpan | null | undefined>(null, {
    alias: 'jigTooltipHideDelay',
  });
  /**
   * Whether to show an arrow pointing to the anchor element. `""` is equivalent to `true`.
   * @alias jigTooltipShowArrow
   * @default true
   */
  public readonly showArrow = input<boolean | '' | null | undefined>(null, {
    alias: 'jigTooltipShowArrow',
  });
  /**
   * Shows the tooltip on hover.
   * @alias jigTooltipShowOnHover
   * @default true
   */
  public readonly showOnHover = input<boolean | '' | null | undefined>(null, {
    alias: 'jigTooltipShowOnHover',
  });
  /**
   * Shows the tooltip on focus.
   * @alias jigTooltipShowOnFocus
   * @default true
   */
  public readonly showOnFocus = input<boolean | '' | null | undefined>(null, {
    alias: 'jigTooltipShowOnFocus',
  });
  /**
   * Hides the tooltip (without delay) when the mouse hovers over the tooltip.
   * @alias jigTooltipHideOnTooltipHover
   * @default false
   */
  public readonly hideOnTooltipHover = input<boolean | '' | null | undefined>(null, {
    alias: 'jigTooltipHideOnTooltipHover',
  });
  /**
   * Hides the tooltip (without delay) when the user clicks on the tooltip.
   * @alias jigTooltipHideOnClick
   * @default true
   */
  public readonly hideOnClick = input<boolean | '' | null | undefined>(null, {
    alias: 'jigTooltipHideOnClick',
  });
  /**
   * Whether to automatically manage ARIA attributes for the tooltip.
   * @alias jigTooltipAutoAriaMode
   * @default 'description'
   */
  public readonly autoAriaMode = input<'label' | 'description' | 'none' | null | undefined>(null, {
    alias: 'jigTooltipAutoAriaMode',
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
      autoAriaMode: this.autoAriaMode() ?? this.options()?.autoAriaMode ?? defaults.autoAriaMode,
    };
  });

  public readonly tooltip = computed(() => this._tooltip()?.instance);

  constructor() {
    super();

    const el = this.element.nativeElement;
    domEventHandler(el, 'mouseenter', () => this.onMouseEnter());
    domEventHandler(el, 'mouseleave', () => this.onMouseLeave());
    domEventHandler(el, 'focus', () => this.onFocus());
    domEventHandler(el, 'blur', () => this.onBlur());

    effect(() => {
      const tooltip = this._tooltip();
      if (tooltip) this.updateContent(tooltip);
    });
    effect(() => this._tooltip()?.setInput('showOnlyIfTruncated', this.showOnlyIfTruncated()));
    effect(() => this._tooltip()?.setInput('size', this.size()));
    effect(() => this._tooltip()?.setInput('options', this.effectiveOptions()));

    afterRenderEffect(() => {
      const el = this.element.nativeElement;
      const content = this.content();
      const autoAriaMode = this.effectiveOptions().autoAriaMode;

      el.removeAttribute('aria-label');
      el.removeAttribute('aria-description');
      el.removeAttribute('aria-labelledby');
      el.removeAttribute('aria-describedby');

      if (autoAriaMode === 'none' || !content) {
        return;
      }

      const tooltip = this.tooltip();
      const isShown = tooltip?.isShown() ?? false;

      if (typeof content === 'string') {
        if (isShown && tooltip) {
          const attr = autoAriaMode === 'label' ? 'aria-labelledby' : 'aria-describedby';
          el.setAttribute(attr, tooltip.id);
        } else {
          const attr = autoAriaMode === 'label' ? 'aria-label' : 'aria-description';
          el.setAttribute(attr, content);
        }
      } else if (content instanceof TemplateRef && isShown && tooltip) {
        const attr = autoAriaMode === 'label' ? 'aria-labelledby' : 'aria-describedby';
        el.setAttribute(attr, tooltip.id);
      }
    });
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
  selector: 'jig-tooltip',
  templateUrl: './tooltip.html',
  imports: [JigPt, JigDefer],
  providers: [provideSelf(TooltipComponent)],
  host: {
    '[class]': `positionClass()`,
    '[style.--anchor-start]': `toPixels(relativeAnchorElementPosition()?.start)`,
    '[style.--anchor-center]': `toPixels(relativeAnchorElementPosition()?.center)`,
    '[style.--anchor-end]': `toPixels(relativeAnchorElementPosition()?.end)`,
    '[style.left]': `toPixels(position().x)`,
    '[style.top]': `toPixels(position().y)`,
    '[attr.id]': `id`,
    '[attr.role]': `'tooltip'`,
    '(toggle)': 'onToggle($event)',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(click)': 'onClick($event)',
    '[attr.aria-hidden]': `isShown() ? null : true`,
  },
})
export class TooltipComponent extends JigBase<'tooltip'> {
  private _showHideTimeout?: ReturnType<typeof setTimeout>;
  protected readonly theme = this.injectThemeTemplate(tooltipControlTemplate, {
    root: true,
    closing: () => this.isClosing(),
    'with-arrow': () => this.options().showArrow !== false,
  });
  private readonly _config = inject(JIG_CONFIG);

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

  /**
   * Open/close state and the `popover` attribute. `hint` never light-dismisses other
   * popovers, and the attribute is dropped while hidden so a tooltip that has been
   * shown once does not linger as a top-layer element.
   */
  private readonly _lifecycle = new OverlayLifecycle(() => this.element.nativeElement, {
    mode: () => 'hint',
  });

  public readonly id = generateElementId();
  /** Whether the tooltip is currently displayed. */
  public readonly isShown = this._lifecycle.isOpen;
  /** Whether the tooltip is playing its exit animation. */
  public readonly isClosing = computed(() => this._lifecycle.phase() === 'closing');

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
        // Whole-pixel placement: sub-pixel coords jitter on resize/DPR, re-firing the RO and tripping NG0100 on the left/top/--anchor-* bindings.
        const anchor = middlewareData[relativeAnchorElementPosition.name];
        this.relativeAnchorElementPosition.set(
          anchor && {
            start: Math.round(anchor.start),
            center: Math.round(anchor.center),
            end: Math.round(anchor.end),
          }
        );
        this.position.set({ x: Math.round(x), y: Math.round(y) });
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
    domEventHandler(document, 'keydown', event => {
      if (this.isShown() && !this.isClosing()) {
        this.onDocumentKeyDown(event);
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

    this._lifecycle.show();
  }

  protected onHide() {
    this._lifecycle.hide();
  }

  protected onToggle(event: Event) {
    this._lifecycle.onNativeToggle(event);
  }

  protected toPixels(value: number | undefined): string | undefined {
    if (value === undefined) {
      return undefined;
    }
    return `${roundByDpr(this.element.nativeElement, value)}px`;
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
