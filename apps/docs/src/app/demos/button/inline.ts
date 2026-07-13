import { Component } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';

@Component({
  selector: 'ngn-demo-button-inline',
  imports: [NgnButton],
  template: `
    <p class="max-w-prose">
      Inline buttons sit inside running text and match the line height, so a
      <button ngnButton ngnButtonInline>tiny action</button> reads as part of the sentence instead
      of breaking the flow. Compare that to a <button ngnButton>default button</button> on the same
      line, which uses the full control height.
    </p>
  `,
})
export class Demo_Button_Inline {}
