import {
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  Injector,
  input,
  runInInjectionContext,
  viewChild,
} from '@angular/core';
import { elementSizeSignal, elementsSizesSignal } from '@awdlab/jig/api/ng';
import { JigBase, JIG_CONTROL, provideSelf, JigPt } from '@awdlab/jig/base';
import { JigRovingGroup, resolveDisabled, resolveFocusable } from '@awdlab/jig/roving-focus';
import { generateElementId } from '@awdlab/jig/utils-ng';
import { buttonGroupControlTemplate } from '@awdlab/jig-themes/templates/button-group';

/**
 * @category control
 */
@Component({
  selector: 'jig-button-group',
  templateUrl: './button-group.html',
  imports: [JigPt, JigRovingGroup],

  providers: [provideSelf(JigButtonGroup)],
})
export class JigButtonGroup extends JigBase<'buttonGroup'> {
  protected readonly theme = this.injectThemeTemplate(buttonGroupControlTemplate, 'root');

  private readonly _contentRef = contentChildren(JIG_CONTROL);
  private readonly _content = computed(() =>
    this._contentRef().map(ref => ref.element.nativeElement)
  );

  /**
   * The roving-focus group on the inner container. Coordinates a single tab
   * stop across the projected buttons: the active button gets `tabindex="0"`,
   * the rest `-1`, and arrow keys move focus between them.
   */
  private readonly _roving = viewChild.required(JigRovingGroup);
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
      const items = this._contentRef()
        // The projected control's host is not always the focusable element:
        // `button[jigButton]` is itself the button, but `jig-toggle-button`
        // wraps a native `<button>`. Roving must own the real tab stop, and a
        // control with no focusable element is not a stop at all.
        .flatMap(ref => {
          const element = resolveFocusable(ref.element.nativeElement);
          return element ? [{ ref, element }] : [];
        })
        .map(({ ref, element }) => {
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
