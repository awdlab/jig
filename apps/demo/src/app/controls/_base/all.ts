import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, Type } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { asyncComputed } from '@ngneers/controls/utils';

import sources from '../../sources.json' with { type: 'json' };

export type ComponentStories = {
  id: string;
  name: string;
  stories: ComponentStory[];
};

export type ComponentStory = {
  fileName: string;
  title: string;
  component: () => Promise<Type<unknown>>;
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
  public readonly stories = signal<ComponentStories | null>(null);

  private readonly _singleStory = signal<string | null>(null);
  protected readonly componentStories = asyncComputed<ComponentStoryFull[]>(() => {
    const singleStory = this._singleStory();

    const stories =
      this.stories()?.stories.filter(story => !singleStory || story.fileName === singleStory) ?? [];

    const promises =
      stories.map(async component => {
        return <ComponentStoryFull>{
          ...component,
          code: this.getDemoCode(component),
          component: await component.component(),
        };
      }) ?? [];
    return Promise.all(promises);
  }, []);

  constructor() {
    const fragment = signal<string | null>(null);
    this._activatedRoute.fragment.subscribe(f => {
      fragment.set(f);
    });
    this._activatedRoute.data.subscribe(data => {
      const demo = data['demo'] as ComponentStories;
      this.stories.set(demo || null);
    });
    this._activatedRoute.queryParams.subscribe(params => {
      const singleStory = params['story'];
      this._singleStory.set(singleStory || null);
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
    const stories = this.stories();
    if (!stories) {
      return '';
    }
    const typedSources = sources as Record<string, Record<string, string>>;
    return typedSources[stories.id][component.fileName];
  }
}
