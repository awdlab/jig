import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'docs-start',
  templateUrl: 'start.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent {
  constructor() {}
}
