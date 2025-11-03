import { Component, input, output } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  selector: 'ngn-docs-topbar',
  templateUrl: 'topbar.html',
  imports: [NgnButton, NgnIcon],
})
export class NgnDocsTopbar {
  public readonly menuToggled = output<void>();
  public readonly isCompact = input<boolean>(false);
}
