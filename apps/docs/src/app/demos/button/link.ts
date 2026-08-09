import { Component } from '@angular/core';
import tablerExternalLink from '@iconify/icons-tabler/external-link';
import { NgnButton } from '@awdlab/jig/button';
import { NgnIcon } from '@awdlab/jig/icon';

@Component({
  selector: 'awd-demo-button-link',
  imports: [NgnButton, NgnIcon],
  template: `
    <!-- The anchors keep real hrefs so they behave like links; the demo just cancels the
         navigation so reading the page doesn't move you off it. -->
    <p class="max-w-prose" (click)="$event.preventDefault()">
      The link kind is a text-level control: it inherits the surrounding typography and wraps with
      the paragraph, so
      <a ngnButton kind="link" href="#/components/button">a navigating anchor</a> and
      <button ngnButton kind="link" (click)="ran = true">an in-place action</button> both read as
      part of the sentence{{ ran ? ' — that action just ran.' : '.' }} Use an
      <code>&lt;a&gt;</code> when the click navigates, a <code>&lt;button&gt;</code> when it does
      not. Icons flow along with the text, as in
      <a ngnButton kind="link" href="#/components/icon"
        ><awd-icon [icon]="externalLink" /> icon link</a
      >, and a long label keeps flowing across the line break instead of being pushed onto its own
      row, like
      <a ngnButton kind="link" href="#/components/button">this deliberately verbose link label</a>
      does. A disabled link stays inline too:
      <button ngnButton kind="link" disabled>unavailable action</button>.
    </p>
  `,
})
export class Demo_Button_Link {
  protected readonly externalLink = tablerExternalLink;
  protected ran = false;
}
