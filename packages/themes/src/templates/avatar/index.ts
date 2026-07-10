import { createControlTemplate } from '@ngneers/controls-themes/api';

export const avatarControlTemplate = createControlTemplate({
  scope: 'avatar',
  classNames: ['root', 'image', 'initials', 'kind-*'],
});

export const avatarGroupControlTemplate = createControlTemplate({
  scope: 'avatar-group',
  dependencies: [{ class: 'avatar', template: avatarControlTemplate, projected: true }],
  classNames: ['root', 'kind-*'],
});
