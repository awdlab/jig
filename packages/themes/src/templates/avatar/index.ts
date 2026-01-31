import { createControlTemplate } from '@ngneers/controls-themes/api';

export const avatarControlTemplate = createControlTemplate({
  scope: 'avatar',
  classNames: ['root', 'image', 'initials', 'kind-*'],
});

export const avatarGroupControlTemplate = createControlTemplate({
  scope: 'avatar-group',
  dependencies: [avatarControlTemplate],
  classNames: ['root', 'kind-*'],
});
