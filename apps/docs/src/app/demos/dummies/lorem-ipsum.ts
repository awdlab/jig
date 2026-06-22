import { Component } from '@angular/core';

import { exampleData } from '../../helper/data';

@Component({
  selector: 'dummy-lorem-ipsum-1',
  template: `{{ loremIpsum1 }}`,
})
export class DummyLoremIpsumComponent1 {
  protected readonly loremIpsum1 = exampleData.loremIpsum.full.split(' ').slice(0, 90).join(' ');
  constructor() {
    console.log('DummyLoremIpsumComponent1 initialized');
  }
}

@Component({
  selector: 'dummy-lorem-ipsum-2',
  template: `{{ loremIpsum2 }}`,
})
export class DummyLoremIpsumComponent2 {
  protected readonly loremIpsum2 = exampleData.loremIpsum.full.split(' ').slice(90, 180).join(' ');
  constructor() {
    console.log('DummyLoremIpsumComponent2 initialized');
  }
}
