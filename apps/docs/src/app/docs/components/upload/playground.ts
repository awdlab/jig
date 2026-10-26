import { Component, viewChild } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigUpload, type JigUploadFile } from '@awdlab/jig/upload';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-upload-playground',
  imports: [JigUpload, JigButton, JigDocsPlayground],
  template: `
    <jig-docs-playground
      #playground
      [controls]="[{ componentName: 'JigUpload', component: component() }]"
    >
      <div class="flex flex-col items-center gap-2">
        <jig-upload #ref="jigUpload" (upload)="onUpload($event)">
          <input type="file" multiple />
          Drag files here or click to browse
        </jig-upload>
        @if (playground.values().JigUpload?.mode === 'manual') {
          <button jigButton (click)="ref.uploadAll()">Upload all</button>
        }
      </div>
    </jig-docs-playground>
  `,
})
export class JigDocsUploadPlayground {
  protected readonly component = viewChild.required('ref', { read: JigUpload });

  protected onUpload(files: JigUploadFile[]): void {
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
