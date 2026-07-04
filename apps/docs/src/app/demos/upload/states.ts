import { Component } from '@angular/core';
import { NgnUpload, type NgnUploadFile } from '@ngneers/controls/upload';

/**
 * The list surfaces per-item actions: cancel while uploading, retry after a
 * failure, and remove at any time. This demo fails every upload on its first
 * attempt so the failed state and retry are easy to see.
 */
@Component({
  imports: [NgnUpload],
  selector: 'ngn-demo-upload-states',
  template: `
    <ngn-upload
      #up="ngnUpload"
      (upload)="onUpload($event, up)"
      (cancelUpload)="onCancel($event)"
      (remove)="onRemove($event)"
    >
      <input type="file" multiple />
      First attempt always fails — press retry
    </ngn-upload>
  `,
})
export class Demo_Upload_States {
  private readonly attempts = new Map<string, number>();

  protected onUpload(files: NgnUploadFile[], up: NgnUpload): void {
    for (const item of files) {
      const attempt = (this.attempts.get(item.id) ?? 0) + 1;
      this.attempts.set(item.id, attempt);

      let progress = 0;
      const tick = setInterval(() => {
        progress += 25;
        if (progress >= 100) {
          clearInterval(tick);
          if (attempt === 1) {
            up.markFailed(item.id, 'Simulated failure');
          } else {
            up.markDone(item.id);
          }
        } else {
          up.setProgress(item.id, progress);
        }
      }, 400);
    }
  }

  protected onCancel(_item: NgnUploadFile): void {
    // In a real app: abort the in-flight request for `_item`.
  }

  protected onRemove(item: NgnUploadFile): void {
    this.attempts.delete(item.id);
  }
}
