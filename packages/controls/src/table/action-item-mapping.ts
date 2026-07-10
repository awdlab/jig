import type { NgnActionButtonConfig, NgnActionItem } from '@ngneers/controls/api';

/** Whether an action opens a submenu rather than firing a leaf callback. */
export function hasChildren(item: NgnActionItem): boolean {
  return !!item.children && item.children.length > 0;
}

/**
 * Adapts an {@link NgnActionItem} (the context-menu shape) to the
 * {@link NgnActionButtonConfig} that `ngn-action-button` consumes. Icon-only
 * rendering (`kind: 'icon'`) is chosen when the item has an icon, so the label
 * becomes the button's tooltip / accessible name.
 */
export function actionItemToButtonConfig(item: NgnActionItem): NgnActionButtonConfig<string> {
  return {
    label: item.label,
    value: item.id,
    icon: item.icon,
    kind: item.icon ? 'icon' : undefined,
    disabled: item.disabled,
    testId: item.testId,
    action: () => item.callback?.(),
  };
}
