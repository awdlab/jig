import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'jig-root',

  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class RootComponent {}
