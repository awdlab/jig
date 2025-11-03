import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NgnDocsFrame } from './frame/frame';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgnDocsFrame],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
