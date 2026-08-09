import {
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { JigBase, JigPt, provideSelf } from '@awdlab/jig/base';
import { JigRovingItem } from '@awdlab/jig/roving-focus';
import { radioControlTemplate } from '@awdlab/jig-themes/templates/radio';

import { JIG_RADIO_GROUP } from './radio-group.token';

/**
 * A single radio option. Must be projected inside an `jig-radio-group`, which
 * owns the selected value — this control only contributes its {@link value}
 * payload and renders the themed dot. The label is authored via content
 * projection (`<jig-radio [value]="…">Label</jig-radio>`) with an optional
 * {@link label} input fallback.
 *
 * @category control
 */
@Component({
  selector: 'jig-radio',
  templateUrl: './radio.html',
  imports: [JigPt],
  hostDirectives: [JigRovingItem],
  providers: [provideSelf(JigRadio)],
  host: {
    role: 'radio',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-disabled]': "effectiveDisabled() ? 'true' : null",
    '[attr.aria-label]': 'label()',
  },
})
export class JigRadio<V> extends JigBase<'radio'> {
  protected readonly theme = this.injectThemeTemplate(radioControlTemplate, {
    root: true,
  });

  /** The payload this radio selects into the enclosing group. */
  public readonly value = input.required<V>();
  /** Disables this individual option. */
  public readonly disabled = input(false, { transform: booleanAttribute });
  /** Optional accessible label; overrides projected content for the a11y name. */
  public readonly label = input<string | null>(null);

  private readonly _group = inject(JIG_RADIO_GROUP);
  private readonly _rovingItem = inject(JigRovingItem);

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
