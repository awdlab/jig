import { NgModule } from '@angular/core';

import { AwdSplitterPanel } from './panel/splitter-panel';
import { AwdSplitter } from './splitter';

// This module is just for grouping the Splitter and SplitterPanel components for convenience.
// The components are standalone and can be used without this module.

@NgModule({
  imports: [AwdSplitter, AwdSplitterPanel],
  exports: [AwdSplitter, AwdSplitterPanel],
})
export class AwdSplitterModule {}
