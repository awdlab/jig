import { Component, signal } from '@angular/core';
import { JigSelectButton } from '@awdlab/jig/select-button';
import { JigUpload, type JigUploadFile, type JigUploadListPosition } from '@awdlab/jig/upload';

/**
 * `listPosition` places the file list `top`, `bottom` (default), `start`, or
 * `end` of the drop zone. `start`/`end` follow the writing direction.
 */
@Component({
  imports: [JigUpload, JigSelectButton],
  selector: 'jig-demo-upload-position',
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <jig-select-button
        [options]="options"
        [value]="position()"
        (valueChange)="position.set($event)"
      />

      <jig-upload #up="jigUpload" [listPosition]="position()" (upload)="onUpload($event, up)">
        <input type="file" multiple />
        Drag files here or click to browse
      </jig-upload>
    </div>
  `,
})
export class Demo_Upload_Position {
  protected readonly position = signal<JigUploadListPosition>('end');

  protected readonly options: { label: string; value: JigUploadListPosition }[] = [
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Start', value: 'start' },
    { label: 'End', value: 'end' },
  ];

  protected onUpload(files: JigUploadFile[], up: JigUpload): void {
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
