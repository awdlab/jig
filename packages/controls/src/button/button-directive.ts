import { Directive, OnDestroy } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { pairwise, startWith } from 'rxjs';

import { ButtonBase } from './button-base';

@Directive({
  selector: 'button[ngnButton], a[ngnButton]',
})
export class ButtonDirective extends ButtonBase implements OnDestroy {
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
