import { Component } from '@angular/core';
import { JigUpload } from '@awdlab/jig/upload';

/**
 * The `interaction` input restricts how files can be added: `click` (picker
 * only), `drag` (drop only), or `both` (default).
 */
@Component({
  imports: [JigUpload],
  selector: 'jig-demo-upload-interaction',
  template: `
    <div style="display: grid; gap: 1rem;">
      <jig-upload interaction="click">
        <input type="file" multiple />
        Click only — no drop
      </jig-upload>

      <jig-upload interaction="drag">
        <input type="file" multiple />
        Drag only — clicking does nothing
      </jig-upload>
    </div>
  `,
})
export class Demo_Upload_Interaction {}
