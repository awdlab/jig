import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal, Type } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { asyncComputed } from '@ngneers/controls/utils';

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

export type ComponentStoryFull = Omit<ComponentStory, 'component'> & {
  code: string;
  component: Type<unknown>;
};

@Component({
  selector: 'ngn-all',
  imports: [CommonModule, RouterLink],
  templateUrl: './all.html',
  styleUrls: ['./all.scss'],
})
export class All_Component {
  private readonly _activatedRoute = inject(ActivatedRoute);
  public readonly stories = input.required<ComponentStories>();

  protected readonly componentStories = asyncComputed<ComponentStoryFull[]>(
    () =>
      Promise.all(
        this.stories()
          .stories()
          .map(async component => {
            return <ComponentStoryFull>{
              ...component,
              code: this.getDemoCode(component),
              component: await component.component,
            };
          })
      ),
    []
  );

  constructor() {
    const fragment = signal<string | null>(null);
    this._activatedRoute.fragment.subscribe(f => {
      fragment.set(f);
    });
    effect(() => {
      const f = fragment();
      const componentStories = this.componentStories();
      if (f && componentStories.length > 0) {
        setTimeout(() => {
          const element = document.getElementById(f);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    });
  }

  private getDemoCode(component: ComponentStory): string {
    const typedSources = sources as Record<string, Record<string, string>>;
    return typedSources[this.stories().id][component.fileName];
  }
}
