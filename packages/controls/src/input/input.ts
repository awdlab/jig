import {
  type AfterViewInit,
  booleanAttribute,
  computed,
  Directive,
  effect,
  input,
  model,
  output,
  runInInjectionContext,
} from '@angular/core';
import { domEventHandler, domEventSignal } from '@awdlab/jig/api/ng';
import {
  injectNgControlRequired,
  JigBase,
  type JigInvalidTrigger,
  provideSelf,
  resolveInvalidState,
} from '@awdlab/jig/base';
import { inputControlTemplate } from '@awdlab/jig-themes/templates/input';

/**
 * @category control
 */
@Directive({
  selector: 'input[jigInput], textarea[jigInput]',
  providers: [provideSelf(JigInput)],
  exportAs: 'jigInput',
  host: {
    '[attr.aria-invalid]': 'invalidState() ? "true" : null',
    // Declaring a `required` input takes the binding away from the native
    // element (Angular only falls back to the DOM property when no directive
    // claims it), so mirror it back to keep native constraint validation.
    '[required]': 'required()',
    // A validator-only required (reactive forms) sets no native attribute, so
    // this is what conveys it to assistive tech.
    '[attr.aria-required]': 'requiredState() ? "true" : null',
  },
})
export class JigInput extends JigBase<'input'> implements AfterViewInit {
  public override readonly isFieldControl = true;
  protected readonly theme = this.injectThemeTemplate(inputControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
    empty: () => this.empty(),
  });

  public override readonly empty = computed(() => !this.value());
  /**
   * The raw invalid flag (bound from a signal-forms field's validity, or set
   * explicitly). Whether it *shows* is gated by {@link invalidOn} — read
   * {@link invalidState}.
   * @default false
   */
  public readonly invalid = input(false, { transform: booleanAttribute });

  /**
   * When the input surfaces its invalid styling.
   * @default touched
   */
  public readonly invalidOn = input<JigInvalidTrigger>('touched');

  /**
   * The raw required flag, written by Angular from a bound signal-forms field,
   * and set by the plain `required` attribute. Read {@link requiredState}, which
   * also covers a reactive/template-driven control's required validator.
   * @default false
   */
  public override readonly required = input(false, { transform: booleanAttribute });

  private readonly _ngControlRequired = injectNgControlRequired();

  /**
   * Whether a value is required: {@link required} OR-ed with the required
   * validator of a bound reactive/template-driven form control.
   */
  public override readonly requiredState = computed(
    () => this.required() || this._ngControlRequired()
  );

  /**
   * Touched state. A bound signal-forms field writes it in (`FormUiControl`
   * `touched` input); the input also sets it on blur, and reports blur out
   * through {@link touch}.
   */
  public readonly touched = model(false);

  /**
   * The invalid state the theme renders: {@link invalid} gated by
   * {@link invalidOn}. (Dirty tracking isn't wired for the bare directive, so the
   * `dirty` trigger behaves like `immediate` here.)
   */
  protected readonly invalidState = computed(() =>
    resolveInvalidState(this.invalid(), this.invalidOn(), this.touched(), true)
  );

  /**
   * The current value of the input, kept in sync with the native element in both directions.
   * @default ''
   */
  public readonly value = model<string | null>('');

  /**
   * Emits on blur so a bound signal-forms field is marked touched (the
   * `FormUiControl` `touch` contract) — enables `jigErrorsShowOn="touched"`.
   */
  public readonly touch = output<void>();

  private readonly _input = this.element.nativeElement as HTMLInputElement;

  public ngAfterViewInit() {
    const changeEvent = domEventSignal(
      this.element.nativeElement as HTMLInputElement,
      'change',
      this.injector
    );
    const inputEvent = domEventSignal(
      this.element.nativeElement as HTMLInputElement,
      'input',
      this.injector
    );

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const _changeEvent = changeEvent();
        const _inputEvent = inputEvent();
        if (!_changeEvent && !_inputEvent) {
          return;
        }
        const val = this._input.value;
        this.value.set(val ?? '');
      });
    });
  }

  constructor() {
    super();
    effect(() => {
      if (this._input.value !== this.value()) {
        this._input.value = this.value() || '';
      }
    });
    domEventHandler(this.element, 'blur', () => this.markTouched());
  }

  /**
   * Marks the input touched on blur: flips {@link touched} for local consumers
   * (e.g. `jigErrors`) and emits {@link touch} so a bound signal-forms field is
   * marked too. Mirrors `ValueControlBase.markTouched`, which this directive
   * can't inherit (it extends {@link JigBase} as a native-element directive).
   */
  private markTouched(): void {
    this.touched.set(true);
    this.touch.emit();
  }
}
