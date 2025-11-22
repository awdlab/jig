import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgnButton } from '@ngneers/controls/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-start',
  templateUrl: 'start.html',
  imports: [NgnButton],
})
export class Start {
  private readonly _router = inject(Router);

  protected getStarted() {
    this._router.navigate(['/components']);
  }
}
