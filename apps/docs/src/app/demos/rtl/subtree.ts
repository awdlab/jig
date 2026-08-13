import { Component } from '@angular/core';
import { type BreadcrumbItem, JigBreadcrumb } from '@awdlab/jig/breadcrumb';
import { JigButton } from '@awdlab/jig/button';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSwitch } from '@awdlab/jig/switch';

/**
 * A `dir="rtl"` island inside the otherwise left-to-right docs page. Nothing here
 * is configured for RTL — the controls read the inherited direction themselves.
 */
@Component({
  selector: 'jig-demo-rtl-subtree',
  imports: [JigBreadcrumb, JigButton, JigInputField, JigInput, JigSwitch],
  template: `
    <div dir="rtl" class="flex flex-col gap-4 p-4">
      <jig-breadcrumb [items]="crumbs" />
      <jig-input-field label="الاسم الكامل">
        <input jigInput value="سارة عبد الله" />
      </jig-input-field>
      <div class="flex items-center gap-4">
        <jig-switch [value]="true" />
        <span>تلقّي الإشعارات</span>
      </div>
      <div class="flex gap-2">
        <button jigButton>حفظ</button>
        <button jigButton kind="secondary">إلغاء</button>
      </div>
    </div>
  `,
})
export class Demo_Rtl_Subtree {
  protected readonly crumbs: BreadcrumbItem[] = [
    { label: 'الرئيسية', id: 'home', callback: () => {} },
    { label: 'الإعدادات', id: 'settings', callback: () => {} },
    { label: 'الحساب', id: 'account', callback: () => {} },
  ];
}
