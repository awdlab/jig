import { Component } from '@angular/core';
import { NgnUpload, type NgnUploadFile } from '@awdlab/jig/upload';

/**
 * Confirm mode: selected files queue up as `pending`. Nothing is uploaded until
 * the rendered "Upload" button is pressed. One `(upload)` fires with every
 * pending file.
 */
@Component({
  imports: [NgnUpload],
  selector: 'awd-demo-upload-confirm',
  template: `
    <awd-upload #up="ngnUpload" mode="confirm" confirmTrigger="all" (upload)="onUpload($event, up)">
      <input type="file" multiple />
      Add files, then press Upload
    </awd-upload>
  `,
})
export class Demo_Upload_Confirm {
  protected onUpload(files: NgnUploadFile[], up: NgnUpload): void {
    for (const item of files) {
      let progress = 0;
      const tick = setInterval(() => {
        progress += 25;
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
