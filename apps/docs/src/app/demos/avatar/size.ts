import { Component } from '@angular/core';
import { AwdAvatar } from '@awdlab/jig/avatar';

@Component({
  selector: 'jig-demo-avatar-size',
  imports: [AwdAvatar],
  template: `
    <jig-avatar initials="AB" [size]="14" />
    <jig-avatar initials="AB" [size]="18" />
    <jig-avatar initials="AB" [size]="24" />
    <jig-avatar initials="AB" [size]="32" />
    <jig-avatar initials="AB" [size]="48" />
    <jig-avatar initials="AB" [size]="64" />
    <jig-avatar initials="AB" [size]="128" />
  `,
})
export class Demo_Avatar_Size {}
