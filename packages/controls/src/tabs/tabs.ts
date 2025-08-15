import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  forwardRef,
  input,
  model,
} from '@angular/core';
import { NgnBase } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';

import { NgnTab } from './tab';
import { TAB_MANAGEMENT, TabManagement } from './types';

@Component({
  selector: 'ngn-tabs',
  imports: [NgTemplateOutlet, NgnDefer],
  templateUrl: './tabs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TAB_MANAGEMENT,
      deps: [forwardRef(() => NgnTabs)],
      useFactory: (tabs: NgnTabs) =>
        <TabManagement>{
          activeTab: tabs.activeTab,
          setActiveTab: tabs.selectTab.bind(tabs),
        },
    },
  ],
})
export class NgnTabs extends NgnBase {
  public readonly cache = input(false);
  public readonly lazy = input(false);

  private readonly _tabs = contentChildren(NgnTab);

  public readonly activeTab = model<string>('');

  protected readonly headers = computed(() =>
    this._tabs().map(tab => ({
      id: tab.tabId(),
      template: tab.header(),
    }))
  );

  protected readonly contents = computed(() =>
    this._tabs().map(tab => ({
      id: tab.tabId(),
      template: tab.content(),
    }))
  );

  public selectTab(tabId: string) {
    this.activeTab.set(tabId);
  }

  constructor() {
    super();
  }
}
