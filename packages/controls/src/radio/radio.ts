import {
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { NgnBase, NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnRovingItem } from '@ngneers/controls/roving-focus';
import { radioControlTemplate } from '@ngneers/controls-themes/templates/radio';

import { NGN_RADIO_GROUP } from './radio-group.token';

/**
 * A single radio option. Must be projected inside an `ngn-radio-group`, which
 * owns the selected value — this control only contributes its {@link value}
 * payload and renders the themed dot. The label is authored via content
 * projection (`<ngn-radio [value]="…">Label</ngn-radio>`) with an optional
 * {@link label} input fallback.
 *
 * @category control
 */
@Component({
  selector: 'ngn-radio',
  templateUrl: './radio.html',
  imports: [NgnPt],
  hostDirectives: [NgnRovingItem],
  providers: [provideSelf(NgnRadio)],
  host: {
    role: 'radio',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-disabled]': "effectiveDisabled() ? 'true' : null",
    '[attr.aria-label]': 'label()',
  },
})
export class NgnRadio<V> extends NgnBase<'radio'> {
  protected readonly theme = this.injectThemeTemplate(radioControlTemplate, {
    root: true,
  });

  /** The payload this radio selects into the enclosing group. */
  public readonly value = input.required<V>();
  /** Disables this individual option. */
  public readonly disabled = input(false, { transform: booleanAttribute });
  /** Optional accessible label; overrides projected content for the a11y name. */
  public readonly label = input<string | null>(null);

  private readonly _group = inject(NGN_RADIO_GROUP);
  private readonly _rovingItem = inject(NgnRovingItem);

  /** Whether this radio is the currently selected option in its group. */
  protected readonly checked = computed(() => this._group.value() === this.value());

  /** Disabled if this option or the whole group is disabled. */
  protected readonly effectiveDisabled = computed(() => this.disabled() || this._group.disabled());

  constructor() {
    super();

    // Feed the roving-focus item so keyboard nav / pointer activation skip a
    // disabled radio.
    effect(() => this._rovingItem.disabled.set(this.effectiveDisabled()));

    const ref = {
      element: this.element.nativeElement,
      value: this.value,
      disabled: this.effectiveDisabled,
    };
    this._group.register(ref);
    inject(DestroyRef).onDestroy(() => this._group.unregister(ref));
  }
}
