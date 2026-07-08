import { Component } from '@angular/core';
import { NgnSplitterModule } from '@ngneers/controls/splitter';

@Component({
  imports: [NgnSplitterModule],
  selector: 'ngn-demo-splitter-kinds',
  template: `
    <div class="grid">
      <span>default</span>
      <ngn-splitter [layout]="'horizontal'" [kind]="'default'" [aria-label]="'Default Kind'">
        <ngn-splitter-panel [size]="'1fr'" [aria-label]="'First Panel'">
          Panel 1
        </ngn-splitter-panel>
        <ngn-splitter-panel [size]="'1fr'" [aria-label]="'Second Panel'">
          Panel 2
        </ngn-splitter-panel>
      </ngn-splitter>

      <span>thin</span>
      <ngn-splitter [layout]="'horizontal'" [kind]="'thin'" [aria-label]="'Thin Kind'">
        <ngn-splitter-panel [size]="'1fr'" [aria-label]="'First Panel'">
          Panel 1
        </ngn-splitter-panel>
        <ngn-splitter-panel [size]="'1fr'" [aria-label]="'Second Panel'">
          Panel 2
        </ngn-splitter-panel>
      </ngn-splitter>

      <span>invisible</span>
      <!--
        The 'invisible' kind draws no line at rest — style your own seam between
        panels. Here each panel gets a right border to act as the separator.
      -->
      <ngn-splitter [layout]="'horizontal'" [kind]="'invisible'" [aria-label]="'Invisible Kind'">
        <ngn-splitter-panel [size]="'1fr'" [aria-label]="'First Panel'" class="seam">
          Panel 1
        </ngn-splitter-panel>
        <ngn-splitter-panel [size]="'1fr'" [aria-label]="'Second Panel'">
          Panel 2
        </ngn-splitter-panel>
      </ngn-splitter>
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
    ngn-splitter {
      height: 80px;
    }
    .seam {
      border-right: 1px solid var(--ngn-color-surface-200, #e5e7eb);
    }
  `,
})
export class Demo_Splitter_Kinds {}
