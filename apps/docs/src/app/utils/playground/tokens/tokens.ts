import { Component, input, signal, computed, inject, Injector, effect } from '@angular/core';
import tablerPalette from '@iconify/icons-tabler/palette';
import tablerPointer from '@iconify/icons-tabler/pointer';
import { injectTheme } from '@awdlab/jig/api/ng';
import { AwdIcon } from '@awdlab/jig/icon';
import { AwdMessage } from '@awdlab/jig/message';
import { notNullish } from '@awdlab/jig/utils';
import { setInputSignalValue } from '@awdlab/jig/utils-ng';
import { ConsoleLogger, Deserializer, FileRegistry } from 'typedoc/browser';

import { getInternalControlName } from '../../api/api-docs-helper';
import { getTypedocProject } from '../../typedoc';

import type { AnyAwdBase, FullAnyAwdBase, AwdPassthrough } from '@awdlab/jig/base';
import type { ControlName, ControlTemplate } from '@awdlab/jig-themes';
import type { ProjectReflection } from 'typedoc/browser';

@Component({
  selector: 'jig-docs-tokens',
  templateUrl: 'tokens.html',
  styleUrl: 'tokens.scss',
  imports: [AwdMessage, AwdIcon],
  host: { class: 'flex flex-col' },
})
export class AwdDocsPlaygroundTokens<
  T extends ControlTemplate<N, C>,
  N extends ControlName,
  C extends string[],
> {
  protected readonly iconPalette = tablerPalette;
  protected readonly iconPointer = tablerPointer;
  private readonly _injector = inject(Injector);
  private readonly _project = signal<ProjectReflection | null>(null);

  public readonly controls = input.required<
    {
      component: AnyAwdBase | readonly AnyAwdBase[];
      componentName: string;
    }[]
  >();

  protected readonly tokensGroups = computed(() => {
    const project = this._project();
    const controls = this.controls();

    if (!project) {
      return [];
    }

    const res = controls
      .map(control => {
        const internalName = getInternalControlName(project, control.componentName);
        if (!internalName) {
          return null;
        }
        const classes = injectTheme(internalName, { injector: this._injector }).classNames;
        return {
          ...control,
          classes,
        };
      })
      .filter(notNullish);

    const finalFormat = res.map(item => {
      return {
        name: item.componentName,
        tokens: item.classes.map(c => ({
          name: c,
          component: item.component,
        })),
      };
    });

    return finalFormat;
  });

  protected readonly activeToken = signal<{
    name: string;
    component: AnyAwdBase | readonly AnyAwdBase[];
  } | null>(null);

  protected readonly pt = computed(() => {
    const activeToken = this.activeToken();
    if (activeToken === null) {
      return null;
    }

    return {
      components: Array.isArray(activeToken.component)
        ? activeToken.component
        : [activeToken.component],
      pt: {
        [activeToken.name]: {
          $classes: ['token-highlight'],
        },
      } as AwdPassthrough<T['scope']>,
    };
  });

  constructor() {
    const logger = new ConsoleLogger();
    const deserializer = new Deserializer(logger);

    void getTypedocProject().then(projectJson => {
      const project = deserializer.reviveProject('API Docs', projectJson as any, {
        projectRoot: '/',
        registry: new FileRegistry(),
      });
      this._project.set(project);
    });

    effect(() => {
      const components = this.controls().flatMap(x => x.component) as FullAnyAwdBase[];
      const pt = this.pt();
      components.forEach(comp => {
        if (pt?.components.includes(comp)) {
          setInputSignalValue(comp.pt, pt.pt);
        } else {
          setInputSignalValue(comp.pt, undefined);
        }
      });
    });
  }
}
