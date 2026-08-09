import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigUpload, type JigUploadFile } from '@awdlab/jig/upload';

/**
 * Manual mode: selected files queue as `pending` and no trigger is rendered.
 * Uploading starts only from code — here an external button calls the control's
 * `uploadAll()` method, which returns a promise resolving once every file has
 * settled. The resolved items carry their final `state`, so we can summarise
 * how many succeeded and failed.
 */
@Component({
  imports: [JigUpload, JigButton],
  selector: 'jig-demo-upload-manual',
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
      <jig-upload #up="jigUpload" mode="manual" (upload)="onUpload($event, up)">
        <input type="file" multiple />
        Add files — upload is triggered from code
      </jig-upload>

      <button jigButton kind="primary" (click)="start(up)">Start upload from code</button>

      @if (summary()) {
        <span>{{ summary() }}</span>
      }
    </div>
  `,
})
export class Demo_Upload_Manual {
  protected readonly summary = signal('');

  protected async start(up: JigUpload): Promise<void> {
    this.summary.set('Uploading…');
    const result = await up.uploadAll();
    const done = result.filter(f => f.state === 'done').length;
    const failed = result.filter(f => f.state === 'failed').length;
    this.summary.set(`Finished: ${done} succeeded, ${failed} failed.`);
  }

  protected onUpload(files: JigUploadFile[], up: JigUpload): void {
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
