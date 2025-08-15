import { InjectionToken, Signal } from '@angular/core';

export type TabManagement = {
  activeTab: Signal<string>;
  setActiveTab: (tabId: string) => void;
};

export const TAB_MANAGEMENT = new InjectionToken<TabManagement>('Tab Management');
