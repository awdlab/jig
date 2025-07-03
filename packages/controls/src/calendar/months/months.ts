import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api';

@Component({
  selector: 'ngn-calendar-months',
  templateUrl: './months.html',
  styleUrls: ['./months.scss'], // TODO: refactor into theme
  imports: [NgTemplateOutlet, NgnTemplate],
})
export class CalendarMonths {}
