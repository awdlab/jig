import { Component, input, OnInit, output } from '@angular/core';

@Component({
  selector: 'dummy',
  template: `<ng-content />`,
})
export class DummyComponent implements OnInit {
  public readonly dummyId = input<string>('Dummy');

  public readonly calledConstructor = output<string>();
  public readonly calledNgOnInit = output<string>();

  constructor() {
    setTimeout(() => {
      this.calledConstructor.emit(this.dummyId());
      console.log('DUMMY constructor', this.dummyId());
    });
  }

  ngOnInit() {
    this.calledNgOnInit.emit(this.dummyId());
    console.log('DUMMY ngOnInit', this.dummyId());
  }
}
