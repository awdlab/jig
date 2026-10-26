import {
  afterRenderEffect,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { generateElementId, toggleIdRefs } from '@awdlab/jig/utils-ng';

/** The target itself when it is a tab stop, else its first enabled descendant tab stop (a group's active item). */
function tabStop(target: HTMLElement): HTMLElement | undefined {
  if (target.tabIndex >= 0) {
    return target;
  }
  return [...target.querySelectorAll<HTMLElement>('*')].find(
    el => el.tabIndex >= 0 && !el.matches(':disabled')
  );
}

/**
 * Associates a `<label>` with a control (or any element by id) given via
 * {@link JigFor.jigFor}: the target is named through `aria-labelledby`, so the
 * label wins over the control's own `label`, and a label click focuses it — or,
 * for a group, its active tab stop.
 *
 * @category directive
 */
@Directive({
  selector: 'label[jigFor]',
  host: {
    '[attr.for]': 'targetId()',
    '(click)': 'clicked($event)',
  },
})
export class JigFor {
  private readonly _label = inject<ElementRef<HTMLLabelElement>>(ElementRef).nativeElement;
  private readonly _generatedId = generateElementId();
  private _linked: HTMLElement | null = null;

  /**
   * The control to label, or the id of the element to label when the label is
   * rendered in a different template than its control.
   */
  public readonly jigFor = input.required<string | { inputId(): string }>();

  protected readonly targetId = computed(() => {
    const target = this.jigFor();
    return typeof target === 'string' ? target : target.inputId();
  });

  constructor() {
    // ponytail: resolves once per render and on click, so a target rendered later (e.g. inside an `@if`) is named on first click; observe the DOM if that matters.
    afterRenderEffect(() => this.link());
    inject(DestroyRef).onDestroy(() => this.unlink());
  }

  private target(): HTMLElement | null {
    // A document or shadow root from any window; a detached label's root is itself, which has none.
    const root = this._label.getRootNode() as Node & {
      getElementById?(id: string): HTMLElement | null;
    };
    return root.getElementById?.(this.targetId()) ?? null;
  }

  private link(): HTMLElement | null {
    const target = this.target();
    if (target !== this._linked) {
      this.unlink();
    }
    if (!target) {
      return null;
    }
    this._label.id ||= this._generatedId;
    toggleIdRefs(target, 'aria-labelledby', this._label.id, 'prepend');
    this._linked = target;
    return target;
  }

  private unlink() {
    if (this._linked) {
      toggleIdRefs(this._linked, 'aria-labelledby', this._label.id, 'remove');
      this._linked = null;
    }
  }

  protected clicked(event: MouseEvent) {
    const target = this.link();
    // A click inside a control the label wraps is that control's own.
    if (target && !(event.target instanceof Node && target.contains(event.target))) {
      tabStop(target)?.focus();
    }
  }
}
