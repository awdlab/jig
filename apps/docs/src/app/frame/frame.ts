import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FrameState } from './frame-state';
import { NgnDocsTopbar } from './topbar/topbar';

@Component({
  selector: 'ngn-docs-frame',
  templateUrl: 'frame.html',
  imports: [NgnDocsTopbar, RouterOutlet],
  providers: [FrameState],
  host: { class: 'block h-full w-full' },
})
export class NgnDocsFrame {}
