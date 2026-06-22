import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ngn-root',

  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class RootComponent {}
