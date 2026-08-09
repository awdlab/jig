import { NgModule } from '@angular/core';

import { NgnSplitterPanel } from './panel/splitter-panel';
import { NgnSplitter } from './splitter';

// This module is just for grouping the Splitter and SplitterPanel components for convenience.
// The components are standalone and can be used without this module.

@NgModule({
  imports: [NgnSplitter, NgnSplitterPanel],
  exports: [NgnSplitter, NgnSplitterPanel],
})
export class NgnSplitterModule {}
