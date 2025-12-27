import { IconType } from '@ngneers/controls-custom-types';

export type IconTemplateContext = {
  $implicit: {
    icon: IconType;
  };
};

export type DefaultIcon = keyof typeof import('./default-icons/ts').DEFAULT_ICONS;
