import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { provideSelf, ValueControlBase } from '@awdlab/jig/base';
import { NgnRovingGroup } from '@awdlab/jig/roving-focus';
import { radioGroupControlTemplate } from '@awdlab/jig-themes/templates/radio-group';

import { NGN_RADIO_GROUP, type NgnRadioGroupApi, type NgnRadioRef } from './radio-group.token';

/**
 * A themed radio group. Owns the selected {@link value}; the individual
 * `awd-radio` children projected inside are presentational and report their
 * payload up through {@link register}.
 *
 * Keyboard handling and roving tab order are delegated to `NgnRovingGroup`
 * (applied as a host directive). Selection follows focus: moving the roving
 * active item (arrows / Home / End / pointer) selects it, matching native
 * radio-group behavior.
 *
 * @category control
 */
@Component({
  selector: 'awd-radio-group',
  templateUrl: './radio-group.html',
  hostDirectives: [{ directive: NgnRovingGroup, inputs: ['orientation', 'rovingWrap'] }],
  providers: [provideSelf(NgnRadioGroup), { provide: NGN_RADIO_GROUP, useExisting: NgnRadioGroup }],
  host: {
    role: 'radiogroup',
    '[attr.aria-label]': 'label()',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-orientation]': 'roving.orientation()',
    '[attr.aria-invalid]': "invalidState() ? 'true' : null",
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
  },
})
export class NgnRadioGroup<V>
  extends ValueControlBase<'radioGroup', V>
  implements NgnRadioGroupApi<V>
{
  protected readonly theme = this.injectThemeTemplate(radioGroupControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
  });

  /** The roving-focus host directive that drives keyboard/tab coordination. */
  protected readonly roving = inject(NgnRovingGroup);

  private readonly _radios = signal<readonly NgnRadioRef<V>[]>([]);

  public register(ref: NgnRadioRef<V>): void {
    this._radios.update(list => (list.includes(ref) ? list : [...list, ref]));
  }

  public unregister(ref: NgnRadioRef<V>): void {
    this._radios.update(list => list.filter(r => r !== ref));
  }

  constructor() {
    super();

    // Selection follows focus: the roving group emits only on genuine
    // navigation/activation (never on mount or plain Tab-in), so wiring value
    // here gives native "arrow selects" behavior without spurious writes.
    const sub = this.roving.activeItemChange.subscribe(index => {
      if (this.readonly() || this.disabled()) {
        return;
      }
      const element = this.roving.items()[index]?.element;
      const radio = this._radios().find(r => r.element === element);
      if (!radio || radio.disabled()) {
        return;
      }
      this.value.set(radio.value());
      this.markTouched();
    });
    inject(DestroyRef).onDestroy(() => sub.unsubscribe());

    // Keep the roving tab stop on the selected radio so Tab-in lands on the
    // checked option (native behavior). Disabled radios are skipped so a
    // selected-but-disabled option never becomes the tab stop. `syncActiveIndex`
    // updates the tab stop silently — no emit, no focus move — so a programmatic
    // `value` change never yanks DOM focus into the group.
    effect(() => {
      const items = this.roving.items();
      if (!items.length) {
        return;
      }
      const radios = this._radios();
      const value = this.value();
      const index = items.findIndex(item => {
        const radio = radios.find(r => r.element === item.element);
        return radio ? !radio.disabled() && radio.value() === value : false;
      });
      if (index >= 0) {
        this.roving.syncActiveIndex(index);
      }
    });
  }
}
