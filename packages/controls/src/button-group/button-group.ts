import {
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  Injector,
  input,
  isSignal,
  runInInjectionContext,
  viewChild,
  type Signal,
} from '@angular/core';
import { elementSizeSignal, elementsSizesSignal } from '@awdlab/jig/api/ng';
import { NgnBase, NGN_CONTROL, provideSelf, NgnPt } from '@awdlab/jig/base';
import { NgnRovingGroup } from '@awdlab/jig/roving-focus';
import { generateElementId } from '@awdlab/jig/utils-ng';
import { buttonGroupControlTemplate } from '@awdlab/jig-themes/templates/button-group';

const FOCUSABLE_SELECTOR = 'button, a[href], input, select, textarea, [tabindex]';

/**
 * Resolve the element that should own the roving tab stop for a projected
 * control. The control's host is the focusable element for a native
 * `button[ngnButton]`/`a[ngnButton]`; for wrapper controls like
 * `awd-toggle-button` the real tab stop is a focusable descendant.
 */
function resolveFocusable(host: HTMLElement): HTMLElement {
  if (host.matches(FOCUSABLE_SELECTOR)) return host;
  return host.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? host;
}

/**
 * Reactive disabled flag for a projected control so roving navigation skips it.
 * Prefer the control's own `disabled` signal (e.g. `awd-toggle-button`); fall
 * back to reflecting the focusable element's native `disabled`/`aria-disabled`
 * for plain `button[ngnButton]`, which has no such signal.
 */
function resolveDisabled(ref: object, element: HTMLElement): Signal<boolean> {
  const controlDisabled = (ref as { disabled?: unknown }).disabled;
  if (isSignal(controlDisabled)) {
    return controlDisabled as Signal<boolean>;
  }
  return computed(
    () => element.matches(':disabled') || element.getAttribute('aria-disabled') === 'true'
  );
}

/**
 * @category control
 */
@Component({
  selector: 'awd-button-group',
  templateUrl: './button-group.html',
  imports: [NgnPt, NgnRovingGroup],

  providers: [provideSelf(NgnButtonGroup)],
})
export class NgnButtonGroup extends NgnBase<'buttonGroup'> {
  protected readonly theme = this.injectThemeTemplate(buttonGroupControlTemplate, 'root');

  private readonly _contentRef = contentChildren(NGN_CONTROL);
  private readonly _content = computed(() =>
    this._contentRef().map(ref => ref.element.nativeElement)
  );

  /**
   * The roving-focus group on the inner container. Coordinates a single tab
   * stop across the projected buttons: the active button gets `tabindex="0"`,
   * the rest `-1`, and arrow keys move focus between them.
   */
  private readonly _roving = viewChild.required(NgnRovingGroup);
  private readonly _parentSize = elementSizeSignal(this.element.nativeElement);
  private readonly _contentSizes = elementsSizesSignal(this._content);
  private readonly _contentWidth = computed(() => {
    const sizes = this._contentSizes();
    return sizes.reduce((acc, size) => acc + size.width, 0);
  });

  /**
   * Defines the orientation of the button group.
   * - 'auto' - The orientation is determined based on the available space.
   * - 'horizontal' - The buttons are arranged horizontally. (Default for `auto` if enough space)
   * - 'vertical' - The buttons are arranged vertically.
   * @default 'auto'
   */
  public readonly orientation = input<'auto' | 'horizontal' | 'vertical'>('auto');
  protected readonly appliedOrientation = computed(() => {
    const orientation = this.orientation();
    if (orientation === 'auto') {
      return this._contentWidth() > this._parentSize().width ? 'vertical' : 'horizontal';
    }
    return orientation;
  });

  private readonly _injector = inject(Injector);

  constructor() {
    super();

    // Register the projected buttons as roving items so the group owns a single
    // tab stop instead of every button being tabbable. Re-runs when the set of
    // children changes; onCleanup unregisters the previous set. `generateElementId`
    // calls `inject()`, so it must run in an injection context.
    effect(onCleanup => {
      const group = this._roving();
      const items = this._contentRef().map(ref => {
        // The projected control's host is not always the focusable element:
        // `button[ngnButton]` is itself the button, but `awd-toggle-button`
        // wraps a native `<button>`. Roving must own the real tab stop.
        const host = ref.element.nativeElement;
        const element = resolveFocusable(host);
        if (!element.id) {
          element.id = runInInjectionContext(this._injector, () => generateElementId());
        }
        return { id: element.id, element, disabled: resolveDisabled(ref, element) };
      });
      items.forEach(item => group.register(item));
      onCleanup(() => items.forEach(item => group.unregister(item)));
    });
  }
}
