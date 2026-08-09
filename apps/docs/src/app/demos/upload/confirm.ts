import { Component } from '@angular/core';
import { AwdUpload, type AwdUploadFile } from '@awdlab/jig/upload';

/**
 * Confirm mode: selected files queue up as `pending`. Nothing is uploaded until
 * the rendered "Upload" button is pressed. One `(upload)` fires with every
 * pending file.
 */
@Component({
  imports: [AwdUpload],
  selector: 'jig-demo-upload-confirm',
  template: `
    <jig-upload #up="ngnUpload" mode="confirm" confirmTrigger="all" (upload)="onUpload($event, up)">
      <input type="file" multiple />
      Add files, then press Upload
    </jig-upload>
  `,
})
export class Demo_Upload_Confirm {
  protected onUpload(files: AwdUploadFile[], up: AwdUpload): void {
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
