import {
  Component,
  input,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  Injector,
  effect,
} from '@angular/core';
import { injectTheme } from '@ngneers/controls/api/ng';
import { AnyNgnBase, FullAnyNgnBase, NgnPassthrough } from '@ngneers/controls/base';
import { NgnMessage } from '@ngneers/controls/message';
import { notNullish } from '@ngneers/controls/utils';
import { setInputSignalValue } from '@ngneers/controls/utils-ng';
import { ControlName, ControlTemplate } from '@ngneers/controls-themes';
import { ConsoleLogger, Deserializer, FileRegistry, ProjectReflection } from 'typedoc/browser';

import { getInternalControlName } from '../../api/api-docs-helper';
import { getTypedocProject } from '../../typedoc';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-tokens',
  templateUrl: 'tokens.html',
  styleUrl: 'tokens.scss',
  imports: [NgnMessage],
  host: { class: 'flex flex-col' },
})
export class NgnDocsPlaygroundTokens<
  T extends ControlTemplate<N, C>,
  N extends ControlName,
  C extends string[],
> {
  private readonly _injector = inject(Injector);
  private readonly _project = signal<ProjectReflection | null>(null);

  public readonly controls = input.required<
    {
      component: AnyNgnBase | readonly AnyNgnBase[];
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
    component: AnyNgnBase | readonly AnyNgnBase[];
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
      } as NgnPassthrough<T['scope']>,
    };
  });

  constructor() {
    const logger = new ConsoleLogger();
    const deserializer = new Deserializer(logger);

    getTypedocProject().then(projectJson => {
      const project = deserializer.reviveProject('API Docs', projectJson as any, {
        projectRoot: '/',
        registry: new FileRegistry(),
      });
      this._project.set(project);
    });

    effect(() => {
      const components = this.controls().flatMap(x => x.component) as FullAnyNgnBase[];
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
