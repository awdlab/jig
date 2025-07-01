import { CommonModule } from '@angular/common';
import { Component, input, Type } from '@angular/core';

export type ComponentStory = {
  title: string;
  component: Type<unknown>;
};

@Component({
  selector: 'ngn-all',
  imports: [CommonModule],
  templateUrl: './all.html',
  styleUrls: ['./all.scss'],
})
export class All_Component {
  public readonly components = input.required<ComponentStory[]>();
}
