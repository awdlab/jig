import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NgnDocsTopbar } from './topbar/topbar';

@Component({
  selector: 'awd-docs-frame',
  templateUrl: 'frame.html',
  imports: [NgnDocsTopbar, RouterOutlet],
  host: { class: 'block min-h-dvh w-full' },
})
export class NgnDocsFrame {}
