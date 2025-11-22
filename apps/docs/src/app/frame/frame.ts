import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FrameState } from './frame-state';
import { NgnDocsTopbar } from './topbar/topbar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-frame',
  templateUrl: 'frame.html',
  imports: [NgnDocsTopbar, RouterOutlet],
  providers: [FrameState],
  host: { class: 'block h-full w-full' },
})
export class NgnDocsFrame {}
