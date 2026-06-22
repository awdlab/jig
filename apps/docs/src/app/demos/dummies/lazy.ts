import { Component } from '@angular/core';

@Component({
  selector: 'dummy-lazy-test',
  template: 'Lazy Content',
})
export class DummyLazyComponent {
  constructor() {
    console.log('DummyLazyComponent initialized');
  }
}
