import { Component } from '@angular/core';

import { exampleData } from '../../../utils/sample-data/data';

@Component({
  selector: 'jig-demo-dummies-lorem-ipsum-1',
  template: `{{ loremIpsum1 }}`,
})
export class Demo_Dummies_LoremIpsum_1 {
  protected readonly loremIpsum1 = exampleData.loremIpsum.full.split(' ').slice(0, 90).join(' ');
  constructor() {
    console.log('Demo_Dummies_LoremIpsum_1 initialized');
  }
}

@Component({
  selector: 'jig-demo-dummies-lorem-ipsum-2',
  template: `{{ loremIpsum2 }}`,
})
export class Demo_Dummies_LoremIpsum_2 {
  protected readonly loremIpsum2 = exampleData.loremIpsum.full.split(' ').slice(90, 180).join(' ');
  constructor() {
    console.log('Demo_Dummies_LoremIpsum_2 initialized');
  }
}
