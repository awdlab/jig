import { NgModule } from '@angular/core';

import { JigSplitterPanel } from './panel/splitter-panel';
import { JigSplitter } from './splitter';

// This module is just for grouping the Splitter and SplitterPanel components for convenience.
// The components are standalone and can be used without this module.

@NgModule({
  imports: [JigSplitter, JigSplitterPanel],
  exports: [JigSplitter, JigSplitterPanel],
})
export class JigSplitterModule {}
