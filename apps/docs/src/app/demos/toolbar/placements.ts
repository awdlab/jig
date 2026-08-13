import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigToolbar } from '@awdlab/jig/toolbar';

@Component({
  selector: 'jig-demo-toolbar-placements',
  imports: [JigButton, JigToolbar],
  template: `<jig-toolbar>
    <button jigButton kind="text">Undo</button>
    <button jigButton kind="text">Redo</button>
    <strong placement="center">Untitled document</strong>
    <button jigButton kind="text" placement="end">Share</button>
    <button jigButton kind="primary" placement="end">Publish</button>
  </jig-toolbar>`,
})
export class Demo_Toolbar_Placements {}
