import { Component, signal } from '@angular/core';
import { NgnSelectButton } from '@awdlab/jig/select-button';
import { NgnUpload, type NgnUploadFile, type NgnUploadListPosition } from '@awdlab/jig/upload';

/**
 * `listPosition` places the file list `top`, `bottom` (default), `left`, or
 * `right` of the drop zone.
 */
@Component({
  imports: [NgnUpload, NgnSelectButton],
  selector: 'awd-demo-upload-position',
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <awd-select-button
        [options]="options"
        [value]="position()"
        (valueChange)="position.set($event)"
      />

      <awd-upload #up="ngnUpload" [listPosition]="position()" (upload)="onUpload($event, up)">
        <input type="file" multiple />
        Drag files here or click to browse
      </awd-upload>
    </div>
  `,
})
export class Demo_Upload_Position {
  protected readonly position = signal<NgnUploadListPosition>('right');

  protected readonly options: { label: string; value: NgnUploadListPosition }[] = [
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
  ];

  protected onUpload(files: NgnUploadFile[], up: NgnUpload): void {
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
