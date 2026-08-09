import { Component } from '@angular/core';
import { NgnAvatar } from '@awdlab/jig/avatar';

@Component({
  selector: 'awd-demo-avatar-size',
  imports: [NgnAvatar],
  template: `
    <awd-avatar initials="AB" [size]="14" />
    <awd-avatar initials="AB" [size]="18" />
    <awd-avatar initials="AB" [size]="24" />
    <awd-avatar initials="AB" [size]="32" />
    <awd-avatar initials="AB" [size]="48" />
    <awd-avatar initials="AB" [size]="64" />
    <awd-avatar initials="AB" [size]="128" />
  `,
})
export class Demo_Avatar_Size {}
