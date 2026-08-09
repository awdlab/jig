import { Component } from '@angular/core';
import { NgnAvatar } from '@awdlab/jig/avatar';

@Component({
  selector: 'awd-demo-avatar-image',
  imports: [NgnAvatar],
  template: `<awd-avatar image="img/avatar/1.png" />`,
})
export class Demo_Avatar_Image {}
