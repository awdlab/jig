import { Component } from '@angular/core';
import { JigSplitterModule } from '@awdlab/jig/splitter';

@Component({
  imports: [JigSplitterModule],
  selector: 'jig-demo-splitter-kinds',
  template: `
    <div class="grid">
      <span>default</span>
      <jig-splitter [layout]="'horizontal'" [kind]="'default'" [aria-label]="'Default Kind'">
        <jig-splitter-panel [size]="'1fr'" [aria-label]="'First Panel'">
          Panel 1
        </jig-splitter-panel>
        <jig-splitter-panel [size]="'1fr'" [aria-label]="'Second Panel'">
          Panel 2
        </jig-splitter-panel>
      </jig-splitter>

      <span>thin</span>
      <jig-splitter [layout]="'horizontal'" [kind]="'thin'" [aria-label]="'Thin Kind'">
        <jig-splitter-panel [size]="'1fr'" [aria-label]="'First Panel'">
          Panel 1
        </jig-splitter-panel>
        <jig-splitter-panel [size]="'1fr'" [aria-label]="'Second Panel'">
          Panel 2
        </jig-splitter-panel>
      </jig-splitter>

      <span>invisible</span>
      <!--
        The 'invisible' kind draws no line at rest — style your own seam between
        panels. Here each panel gets a right border to act as the separator.
      -->
      <jig-splitter [layout]="'horizontal'" [kind]="'invisible'" [aria-label]="'Invisible Kind'">
        <jig-splitter-panel [size]="'1fr'" [aria-label]="'First Panel'" class="seam">
          Panel 1
        </jig-splitter-panel>
        <jig-splitter-panel [size]="'1fr'" [aria-label]="'Second Panel'">
          Panel 2
        </jig-splitter-panel>
      </jig-splitter>
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
    jig-splitter {
      height: 80px;
    }
    .seam {
      border-right: 1px solid var(--jig-color-surface-200, #e5e7eb);
    }
  `,
})
export class Demo_Splitter_Kinds {}
