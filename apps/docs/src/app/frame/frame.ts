import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AwdDocsTopbar } from './topbar/topbar';

@Component({
  selector: 'jig-docs-frame',
  templateUrl: 'frame.html',
  imports: [AwdDocsTopbar, RouterOutlet],
  host: { class: 'block min-h-dvh w-full' },
})
export class AwdDocsFrame {}
