import { Directive, input, OnDestroy } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { NgnBase } from '@ngneers/controls/base';
import { ButtonKindType } from '@ngneers/controls/custom-types';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';
import { pairwise, startWith } from 'rxjs';

/**
 * @category control
 */
@Directive({
  selector: 'button[ngnButton], a[ngnButton]',
})
export class NgnButton extends NgnBase implements OnDestroy {
  protected readonly theme = injectThemeTemplate(buttonControlTemplate);

  public readonly kind = input<ButtonKindType | null | undefined>();

  constructor() {
    super();
    this.element.nativeElement.classList.toggle(this.theme.class(), true);

    toObservable(this.kind)
      .pipe(takeUntilDestroyed(), startWith(null), pairwise())
      .subscribe(([prev, next]) => {
        if (prev) {
          this.element.nativeElement.classList.toggle(this.theme.class(`kind-${prev}`), false);
        }
        if (next) {
          this.element.nativeElement.classList.toggle(this.theme.class(`kind-${next}`), true);
        }
      });
  }

  public ngOnDestroy(): void {
    this.element.nativeElement.classList.toggle(this.theme.class(), false);
    const kind = this.kind();
    if (kind) {
      this.element.nativeElement.classList.toggle(this.theme.class(`kind-${kind}`), false);
    }
  }
}
