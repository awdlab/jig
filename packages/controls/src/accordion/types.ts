import { InjectionToken, Signal } from '@angular/core';
import { IconType } from '@ngneers/controls-custom-types';

export type HeaderTemplateType = {
  $implicit: {
    panelId: string;
    text?: string;
    expanded: boolean;
  };
};
export type AccordionControl = {
  expandedPanels: Signal<string[]>;
  togglePanel: (panelId: string) => void;
  lazy: Signal<boolean>;
  cache: Signal<boolean>;
  iconExpanded: Signal<IconType>;
  iconCollapsed: Signal<IconType>;
};

export const ACCORDION_CONTROL = new InjectionToken<AccordionControl>('AccordionControl');
