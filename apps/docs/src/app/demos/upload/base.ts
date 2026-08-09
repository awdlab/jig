import { Component } from '@angular/core';
import { AwdUpload, type AwdUploadFile } from '@awdlab/jig/upload';

/**
 * Auto mode: files upload the moment they are selected or dropped. The consumer
 * runs the (here simulated) transfer and reports progress back through the
 * `exportAs="ngnUpload"` handle.
 */
@Component({
  imports: [AwdUpload],
  selector: 'jig-demo-upload-base',
  template: `
    <jig-upload #up="ngnUpload" (upload)="onUpload($event, up)">
      <input type="file" multiple />
      Drag files here or click to browse
    </jig-upload>
  `,
})
export class Demo_Upload_Base {
  protected onUpload(files: AwdUploadFile[], up: AwdUpload): void {
    for (const item of files) {
      this.simulate(item, up);
    }
  }

  private simulate(item: AwdUploadFile, up: AwdUpload): void {
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
