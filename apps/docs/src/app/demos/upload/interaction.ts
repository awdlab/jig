import { Component } from '@angular/core';
import { NgnUpload } from '@awdlab/jig/upload';

/**
 * The `interaction` input restricts how files can be added: `click` (picker
 * only), `drag` (drop only), or `both` (default).
 */
@Component({
  imports: [NgnUpload],
  selector: 'awd-demo-upload-interaction',
  template: `
    <div style="display: grid; gap: 1rem;">
      <awd-upload interaction="click">
        <input type="file" multiple />
        Click only — no drop
      </awd-upload>

      <awd-upload interaction="drag">
        <input type="file" multiple />
        Drag only — clicking does nothing
      </awd-upload>
    </div>
  `,
})
export class Demo_Upload_Interaction {}
