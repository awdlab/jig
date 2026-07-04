import { Component } from '@angular/core';
import { NgnUpload } from '@ngneers/controls/upload';

/**
 * The `interaction` input restricts how files can be added: `click` (picker
 * only), `drag` (drop only), or `both` (default).
 */
@Component({
  imports: [NgnUpload],
  selector: 'ngn-demo-upload-interaction',
  template: `
    <div style="display: grid; gap: 1rem;">
      <ngn-upload interaction="click">
        <input type="file" multiple />
        Click only — no drop
      </ngn-upload>

      <ngn-upload interaction="drag">
        <input type="file" multiple />
        Drag only — clicking does nothing
      </ngn-upload>
    </div>
  `,
})
export class Demo_Upload_Interaction {}
