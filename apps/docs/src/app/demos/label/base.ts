import { Component, signal } from '@angular/core';
import { JigFor } from '@awdlab/jig/directives';
import { JigRating } from '@awdlab/jig/rating';
import { JigSlider } from '@awdlab/jig/slider';

@Component({
  selector: 'jig-demo-label-base',
  imports: [JigFor, JigRating, JigSlider],
  template: `
    <div class="flex w-72 flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label [jigFor]="volume">Volume</label>
        <jig-slider #volume [(value)]="volumeValue" />
      </div>
      <div class="flex flex-col gap-2">
        <label [jigFor]="score">Score</label>
        <jig-rating #score [(value)]="scoreValue" />
      </div>
    </div>
  `,
})
export class Demo_Label_Base {
  protected readonly volumeValue = signal(40);
  protected readonly scoreValue = signal(3);
}
