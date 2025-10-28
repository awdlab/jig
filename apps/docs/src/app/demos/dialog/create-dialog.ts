import { Component, inject, Injector } from '@angular/core';
import { createDialog } from '@ngneers/controls/dialog';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  selector: 'demo-1',
  template: `{{ loremIpsum1 }} <ngn-select [options]="options" />`,
  imports: [NgnSelect],
})
export class DialogDemo1Component {
  protected readonly loremIpsum1 = exampleData.loremIpsum.full.split(' ').slice(0, 100).join(' ');
  protected readonly options = [
    { label: 'Option 1', value: 'option-1' },
    { label: 'Option 2', value: 'option-2' },
    { label: 'Option 3', value: 'option-3' },
  ];
  constructor() {
    console.log('DialogDemo1Component initialized');
  }
}

@Component({
  template: `<button (click)="showDialog()">Open Dialog</button>
    <button (click)="showComponentDialog()">Open Component Dialog</button>`,
})
export class Demo_Dialog_CreateDialog {
  private readonly _injector = inject(Injector);

  protected showDialog() {
    createDialog(this._injector, {
      title: 'Test Dialog',
      content: 'This is a test dialog',
    });
  }

  protected showComponentDialog() {
    createDialog(this._injector, {
      title: 'Test Dialog',
      content: DialogDemo1Component,
      movable: true,
      closeBy: 'escape',
    });
  }
}
