import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigToolbar } from '@awdlab/jig/toolbar';

@Component({
  selector: 'jig-demo-toolbar-base',
  imports: [JigButton, JigToolbar],
  template: `<jig-toolbar>
    <strong>Report.pdf</strong>
    <button jigButton kind="text">Bold</button>
    <button jigButton kind="text">Italic</button>
    <button jigButton kind="primary" placement="end">Save</button>
  </jig-toolbar>`,
})
export class Demo_Toolbar_Base {}
