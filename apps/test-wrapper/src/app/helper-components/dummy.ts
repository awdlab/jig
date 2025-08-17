import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'dummy',
  template: `Dummy: {{ dummyId() }}`,
})
export class DummyComponent implements OnInit {
  public readonly dummyId = input<string>('Dummy');

  constructor() {
    console.log('DUMMY constructor', this.dummyId());
  }

  ngOnInit() {
    console.log('DUMMY ngOnInit', this.dummyId());
  }
}
