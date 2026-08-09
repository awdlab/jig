import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { JigDocsTopbar } from './topbar/topbar';

@Component({
  selector: 'jig-docs-frame',
  templateUrl: 'frame.html',
  imports: [JigDocsTopbar, RouterOutlet],
  host: { class: 'block min-h-dvh w-full' },
})
export class JigDocsFrame {}
