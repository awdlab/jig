import { Component } from '@angular/core';
import { NgnSplitterModule } from '@awdlab/jig/splitter';

@Component({
  imports: [NgnSplitterModule],
  selector: 'awd-demo-splitter-kinds',
  template: `
    <div class="grid">
      <span>default</span>
      <awd-splitter [layout]="'horizontal'" [kind]="'default'" [aria-label]="'Default Kind'">
        <awd-splitter-panel [size]="'1fr'" [aria-label]="'First Panel'">
          Panel 1
        </awd-splitter-panel>
        <awd-splitter-panel [size]="'1fr'" [aria-label]="'Second Panel'">
          Panel 2
        </awd-splitter-panel>
      </awd-splitter>

      <span>thin</span>
      <awd-splitter [layout]="'horizontal'" [kind]="'thin'" [aria-label]="'Thin Kind'">
        <awd-splitter-panel [size]="'1fr'" [aria-label]="'First Panel'">
          Panel 1
        </awd-splitter-panel>
        <awd-splitter-panel [size]="'1fr'" [aria-label]="'Second Panel'">
          Panel 2
        </awd-splitter-panel>
      </awd-splitter>

      <span>invisible</span>
      <!--
        The 'invisible' kind draws no line at rest — style your own seam between
        panels. Here each panel gets a right border to act as the separator.
      -->
      <awd-splitter [layout]="'horizontal'" [kind]="'invisible'" [aria-label]="'Invisible Kind'">
        <awd-splitter-panel [size]="'1fr'" [aria-label]="'First Panel'" class="seam">
          Panel 1
        </awd-splitter-panel>
        <awd-splitter-panel [size]="'1fr'" [aria-label]="'Second Panel'">
          Panel 2
        </awd-splitter-panel>
      </awd-splitter>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
    .grid {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 0.5rem 1rem;
    }
    awd-splitter {
      height: 80px;
    }
    .seam {
      border-right: 1px solid var(--awd-color-surface-200, #e5e7eb);
    }
  `,
})
export class Demo_Splitter_Kinds {}
