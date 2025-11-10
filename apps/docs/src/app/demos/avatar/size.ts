import { Component } from '@angular/core';
import { NgnAvatar } from '@ngneers/controls/avatar';

@Component({
  selector: 'ngn-demo-avatar-size',
  imports: [NgnAvatar],
  template: `
    <ngn-avatar initials="AB" [size]="14" />
    <ngn-avatar initials="AB" [size]="18" />
    <ngn-avatar initials="AB" [size]="24" />
    <ngn-avatar initials="AB" [size]="32" />
    <ngn-avatar initials="AB" [size]="48" />
    <ngn-avatar initials="AB" [size]="64" />
    <ngn-avatar initials="AB" [size]="128" />
  `,
})
export class Demo_Avatar_Size {}
