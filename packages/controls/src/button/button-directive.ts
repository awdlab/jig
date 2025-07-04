import { Directive, OnDestroy } from '@angular/core';

import { ButtonBase } from './button-base';

@Directive({
  selector: 'button[ngnButton], a[ngnButton]',
})
export class ButtonDirective extends ButtonBase implements OnDestroy {
  constructor() {
    super();
    this.el.nativeElement.classList.toggle(this.theme.class(), true);
  }

  public ngOnDestroy(): void {
    this.el.nativeElement.classList.toggle(this.theme.class(), false);
  }
}
