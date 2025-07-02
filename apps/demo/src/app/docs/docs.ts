import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { allDemos } from '../controls/_all';

@Component({
  selector: 'ngn-docs',
  templateUrl: 'docs.html',
  styleUrl: 'docs.scss',
  imports: [RouterLink, RouterOutlet],
})
export class DocsComponent {
  protected readonly allDemos = allDemos;
}
