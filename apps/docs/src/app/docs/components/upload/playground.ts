import { Component, viewChild } from '@angular/core';
import { NgnUpload, type NgnUploadFile } from '@awdlab/jig/upload';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-upload-playground',
  imports: [NgnUpload, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnUpload', component: component() }]">
      <awd-upload #ref="ngnUpload" (upload)="onUpload($event)">
        <input type="file" multiple />
        Drag files here or click to browse
      </awd-upload>
    </awd-docs-playground>
  `,
})
export class NgnDocsUploadPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnUpload });

  protected onUpload(files: NgnUploadFile[]): void {
    const up = this.component();
    for (const item of files) {
      let progress = 0;
      const tick = setInterval(() => {
        progress += 20;
        if (progress >= 100) {
          clearInterval(tick);
          up.markDone(item.id);
        } else {
          up.setProgress(item.id, progress);
        }
      }, 400);
    }
  }
}
