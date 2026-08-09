import { Component, signal } from '@angular/core';
import { AwdSelectButton } from '@awdlab/jig/select-button';
import { AwdUpload, type AwdUploadFile, type AwdUploadListPosition } from '@awdlab/jig/upload';

/**
 * `listPosition` places the file list `top`, `bottom` (default), `left`, or
 * `right` of the drop zone.
 */
@Component({
  imports: [AwdUpload, AwdSelectButton],
  selector: 'jig-demo-upload-position',
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <jig-select-button
        [options]="options"
        [value]="position()"
        (valueChange)="position.set($event)"
      />

      <jig-upload #up="ngnUpload" [listPosition]="position()" (upload)="onUpload($event, up)">
        <input type="file" multiple />
        Drag files here or click to browse
      </jig-upload>
    </div>
  `,
})
export class Demo_Upload_Position {
  protected readonly position = signal<AwdUploadListPosition>('right');

  protected readonly options: { label: string; value: AwdUploadListPosition }[] = [
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
  ];

  protected onUpload(files: AwdUploadFile[], up: AwdUpload): void {
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
