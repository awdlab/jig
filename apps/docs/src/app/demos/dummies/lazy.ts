import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dummy-lazy-test',
  template: 'Lazy Content',
})
export class DummyLazyComponent {
  constructor() {
    console.log('DummyLazyComponent initialized');
  }
}
