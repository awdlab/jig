import { NgTemplateOutlet } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api';

@Component({
  selector: 'ngn-calendar-months',
  templateUrl: './months.html',
  styleUrls: ['./months.scss'], // TODO: refactor into theme
  imports: [NgTemplateOutlet, NgnTemplate],
})
export class CalendarMonths {
  public readonly year = input.required<number>();
  public readonly currentValue = input.required<Date | null>();
  public readonly monthSelected = output<number>();

  protected readonly months = Array.from({ length: 12 }, (_, i) =>
    Intl.DateTimeFormat(undefined, { month: 'long' }).format(new Date(2020, i))
  );

  public readonly previousYear = output();
  public readonly nextYear = output();

  protected prev() {
    this.previousYear.emit();
  }

  protected next() {
    this.nextYear.emit();
  }

  protected selectMonth(index: number) {
    this.monthSelected.emit(index);
  }
}
