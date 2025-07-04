import { Component } from '@angular/core';
import { Button } from '@ngneers/controls/button';

@Component({
  imports: [Button],
  template: `
    <ngn-button kind="primary">Primary</ngn-button>
    <ngn-button kind="secondary">Secondary</ngn-button>
    <ngn-button kind="text">Text</ngn-button>
    <ngn-button kind="link">Link</ngn-button>
  `,
})
export class Button_Kind_Component {}
