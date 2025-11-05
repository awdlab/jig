import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgnButton } from '@ngneers/controls/button';

@Component({
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
