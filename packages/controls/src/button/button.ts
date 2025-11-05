import { Directive, OnDestroy } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { toggleClass } from '@ngneers/controls/utils';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';
import { pairwise, startWith } from 'rxjs';

/**
 * @category control
 */
@Directive({
  selector: 'button[ngnButton], a[ngnButton]',
  providers: [provideSelf(NgnButton)],
})
export class NgnButton extends NgnBase<'button'> implements OnDestroy {
  protected readonly theme = this.injectThemeTemplate(buttonControlTemplate);

  constructor() {
    super();
    toggleClass(this.element.nativeElement, this.theme.class(), true);

    toObservable(this.kind)
      .pipe(takeUntilDestroyed(), startWith(null), pairwise())
      .subscribe(([prev, next]) => {
        if (prev) {
          toggleClass(this.element.nativeElement, this.theme.class(`kind-${prev}`), false);
        }
        if (next) {
          toggleClass(this.element.nativeElement, this.theme.class(`kind-${next}`), true);
        }
      });
  }

  public ngOnDestroy(): void {
    toggleClass(this.element.nativeElement, this.theme.class(), false);
    const kind = this.kind();
    if (kind) {
      toggleClass(this.element.nativeElement, this.theme.class(`kind-${kind}`), false);
    }
  }
}
