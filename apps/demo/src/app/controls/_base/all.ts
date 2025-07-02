import { CommonModule } from '@angular/common';
import { Component, computed, input, Type } from '@angular/core';

import sources from '../../sources.json' with { type: 'json' };

export type ComponentStories = {
  id: string;
  name: string;
  stories: () => ComponentStory[];
};

export type ComponentStory = {
  fileName: string;
  title: string;
  component: Promise<Type<unknown>>;
};

export type ComponentStoryFull = ComponentStory & {
  code: string;
};

@Component({
  selector: 'ngn-all',
  imports: [CommonModule],
  templateUrl: './all.html',
  styleUrls: ['./all.scss'],
})
export class All_Component {
  public readonly stories = input.required<ComponentStories>();

  protected readonly componentStories = computed<ComponentStoryFull[]>(() =>
    this.stories()
      .stories()
      .map(component => {
        return {
          code: this.getDemoCode(component),
          ...component,
        };
      })
  );

  private getDemoCode(component: ComponentStory): string {
    const typedSources = sources as Record<string, Record<string, string>>;
    return typedSources[this.stories().id][component.fileName];
  }
}
