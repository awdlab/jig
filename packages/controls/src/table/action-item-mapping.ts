import type { AwdActionButtonConfig, JigActionItem } from '@awdlab/jig/api';

/** Whether an action opens a submenu rather than firing a leaf callback. */
export function hasChildren(item: JigActionItem): boolean {
  return !!item.children && item.children.length > 0;
}

/**
 * Adapts an {@link JigActionItem} (the context-menu shape) to the
 * {@link AwdActionButtonConfig} that `jig-action-button` consumes. Icon-only
 * rendering (`kind: 'icon'`) is chosen when the item has an icon, so the label
 * becomes the button's tooltip / accessible name.
 */
export function actionItemToButtonConfig(item: JigActionItem): AwdActionButtonConfig<string> {
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
