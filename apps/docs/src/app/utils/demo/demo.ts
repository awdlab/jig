import { NgComponentOutlet } from '@angular/common';
import { Component, computed, input, signal, Type, ChangeDetectionStrategy } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';

import { style } from '../code/prism';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-demo',
  templateUrl: 'demo.html',
  styleUrl: 'demo.scss',
  imports: [NgComponentOutlet, NgnButton, NgnIcon],
})
export class NgnDocsDemo {
  public readonly component = input.required<Type<unknown>>();

  protected readonly codeVisible = signal(false);
  protected readonly code = signal('');
  protected readonly formattedCode = computed(() => style(this.code()));

  protected toggleCodeVisibility() {
    this.codeVisible.update(v => !v);
    if (!this.code()) {
      this.loadCode();
    }
  }

  private async loadCode() {
    const componentName = this.component().name.replace(/^_/, ''); // Example: Demo_ListBox_Base
    const componentNameParts = componentName.split('_');
    // Pascal case to kebab case
    function toKebabCase(input: string) {
      return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    const componentShortName = toKebabCase(componentNameParts[1]);
    const demoShortName = toKebabCase(componentNameParts[2]);

    const path = `/demos/${componentShortName}/${demoShortName}.ts`;
    const res = await fetch(path);
    const text = await res.text();
    this.code.set(text);
  }

  protected copyCode() {
    if (this.code()) {
      navigator.clipboard.writeText(this.code());
    }
  }
}
