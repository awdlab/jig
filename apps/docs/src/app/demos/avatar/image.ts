import { Component } from '@angular/core';
import { JigAvatar } from '@awdlab/jig/avatar';

@Component({
  selector: 'jig-demo-avatar-image',
  imports: [JigAvatar],
  template: `<jig-avatar image="img/avatar/1.png" />`,
})
export class Demo_Avatar_Image {}
