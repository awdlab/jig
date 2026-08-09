import { Component, viewChild } from '@angular/core';
import { AwdUpload, type AwdUploadFile } from '@awdlab/jig/upload';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-upload-playground',
  imports: [AwdUpload, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdUpload', component: component() }]">
      <jig-upload #ref="ngnUpload" (upload)="onUpload($event)">
        <input type="file" multiple />
        Drag files here or click to browse
      </jig-upload>
    </jig-docs-playground>
  `,
})
export class AwdDocsUploadPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdUpload });

  protected onUpload(files: AwdUploadFile[]): void {
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
