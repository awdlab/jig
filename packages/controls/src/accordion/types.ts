import { InjectionToken, Signal } from '@angular/core';

export type HeaderTemplateType = {
  $implicit: {
    panelId: string;
    text?: string;
  };
};
export type AccordionControl = {
  openedPanels: Signal<string[]>;
  togglePanel: (panelId: string) => void;
  lazy: Signal<boolean>;
  cache: Signal<boolean>;
};

export const ACCORDION_CONTROL = new InjectionToken<AccordionControl>('AccordionControl');
