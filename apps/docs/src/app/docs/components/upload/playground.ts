import { Component, viewChild } from '@angular/core';
import { NgnUpload, type NgnUploadFile } from '@ngneers/controls/upload';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-upload-playground',
  imports: [NgnUpload, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnUpload', component: component() }]">
      <ngn-upload #ref="ngnUpload" (upload)="onUpload($event)">
        <input type="file" multiple />
        Drag files here or click to browse
      </ngn-upload>
    </ngn-docs-playground>
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
