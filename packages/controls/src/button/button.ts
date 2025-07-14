import { ApplicationRef, Directive, effect, inject, input, OnDestroy } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { NgnBase } from '@ngneers/controls/base';
import { ButtonKindType, IconType } from '@ngneers/controls/custom-types';
import { createIconComponent, destroyIconComponent } from '@ngneers/controls/icon';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';
import { pairwise, startWith } from 'rxjs';

@Directive({
  selector: 'button[ngnButton], a[ngnButton]',
})
export class NgnButton extends NgnBase implements OnDestroy {
  private readonly _iconSymbol = Symbol('ngnButton');
  protected readonly theme = injectThemeTemplate(buttonControlTemplate);
  private readonly _applicationRef = inject(ApplicationRef);

  public readonly kind = input<ButtonKindType | null | undefined>();
  public readonly icon = input<IconType | null | undefined>(null);

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

    effect(() => {
      const icon = this.icon();
      if (!icon) {
        destroyIconComponent(this._iconSymbol);
        return;
      }
      createIconComponent(icon, {
        injector: this.injector,
        iconId: this._iconSymbol,
        attachTo: this.element.nativeElement,
      });
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
