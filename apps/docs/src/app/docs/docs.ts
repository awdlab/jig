import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';
import { NgDocNavbarComponent, NgDocRootComponent } from '@ng-doc/app';
import { NgDocSidebarComponent } from '@ng-doc/app/components/sidebar';
import { NG_DOC_ROUTING } from '@ng-doc/generated';

@Component({
  selector: 'ng-doc-docs',
  imports: [RouterOutlet, NgDocRootComponent, NgDocNavbarComponent, NgDocSidebarComponent],
  template: `
    <ng-doc-root>
      <ng-doc-navbar>
        <h3 style="margin: 0" ngDocNavbarLeft>ngn-controls</h3>
      </ng-doc-navbar>
      <ng-doc-sidebar></ng-doc-sidebar>
      <router-outlet></router-outlet>
    </ng-doc-root>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsComponent {}

const routes: Routes = [
  {
    path: '',
    component: DocsComponent,
    children: NG_DOC_ROUTING,
  },
];

export default routes;
