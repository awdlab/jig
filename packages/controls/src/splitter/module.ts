import { NgModule } from '@angular/core';

import { SplitterPanel } from './panel/splitter-panel';
import { Splitter } from './splitter';

// This module is just for grouping the Splitter and SplitterPanel components for convenience.
// The components are standalone and can be used without this module.

@NgModule({
  imports: [Splitter, SplitterPanel],
  exports: [Splitter, SplitterPanel],
})
export class SplitterModule {}
